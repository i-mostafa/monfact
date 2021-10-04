import { ExpErrors } from "experr";
import { NextFunction } from "express";
import { Model } from "mongoose";
import Filter from "./Filter";
import { IObject, IQuery } from "./interfaces";
import Populator from "./Populator";
import { extractPushAndPull, isEmpty, resolveNestedQuery } from "./utils";

export default class Factory {
  getAll = async (dbModel: Model<any>, queryObj: IQuery = {}) => {
    queryObj = resolveNestedQuery(queryObj);
    queryObj = await new Populator(dbModel, queryObj).exec();

    const dbHelper = new Filter(dbModel, queryObj)
      .filter()
      .exclude()
      .sort()
      .limitFields()
      .paginate()
      .populate();

    return await dbHelper.query;
  };

  // get one
  getOne = async (dbModel: Model<any>, params: IObject<any>, select = "") => {
    let query = dbModel.findOne(params);
    if (select) query = query.select(select);
    return await query;
  };

  // delete one
  deleteOne = async (
    dbModel: Model<any>,
    params: IObject<any>,
    next: NextFunction
  ) => {
    //check for query obj
    if (isEmpty(params))
      return next(ExpErrors.noQery("req.params can't be embty"));

    return await dbModel.deleteOne(params);
  };

  // update one
  updateOne = async (
    dbModel: Model<any>,
    params: IObject<any>,
    update: IObject<any>,
    next: NextFunction
  ) => {
    //check for query obj & body
    if (isEmpty(params) || isEmpty(update))
      return next(ExpErrors.noQery("req.body can't be embty"));

    update = extractPushAndPull(update);
    return await dbModel.findOneAndUpdate(params, update, { new: true });
  };

  // update many
  updateMany = async (
    dbModel: Model<any>,
    params: IObject<any>,
    update: IObject<any>,
    next: NextFunction
  ) => {
    //check for query obj & body
    if (isEmpty(params) || isEmpty(update))
      return next(ExpErrors.noQery("req.body can't be embty"));

    update = extractPushAndPull(update);
    return await dbModel.updateMany(params, update, { new: true });
  };

  // create one
  createOne = async (
    dbModel: Model<any>,
    doc: IObject<any>,
    next: NextFunction
  ) => {
    //check for  body
    if (isEmpty(doc)) return next(ExpErrors.noQery("req.body can't be embty"));
    return await dbModel.create(doc);
  };

  // count
  count = async (dbModel: Model<any>, queryObj = {}) => {
    queryObj = resolveNestedQuery(queryObj);
    queryObj = await new Populator(dbModel, queryObj).exec();
    return await new Filter(dbModel, queryObj).filter().count();
  };
}
