import { NextFunction } from "express";

import { IMonFactModel, IObject, IQuery } from "./interfaces";
import ResFactory from "./ResFactory";

const monfact = (dbModel: IMonFactModel) => {
  const resFactory = new ResFactory();
  dbModel.monfact = {};

  dbModel.monfact.getOne = (params: IObject<any>, select = "") =>
    resFactory.getOne(dbModel, params, select);

  dbModel.monfact.getAll = (queryObj: IQuery) =>
    resFactory.getAll(dbModel, queryObj);

  dbModel.monfact.deleteOne = (params: IObject<any>, next: NextFunction) =>
    resFactory.deleteOne(dbModel, params, next);

  dbModel.monfact.updateOne = (
    params: IObject<any>,
    update: IObject<any>,
    next: NextFunction
  ) => resFactory.updateOne(dbModel, params, update, next);

  dbModel.monfact.updateMany = (
    params: IObject<any>,
    update: IObject<any>,
    next: NextFunction
  ) => resFactory.updateMany(dbModel, params, update, next);

  dbModel.monfact.createOne = (doc: IObject<any>, next: NextFunction) =>
    resFactory.createOne(dbModel, doc, next);

  dbModel.monfact.count = (queryObj = {}) =>
    resFactory.count(dbModel, queryObj);

  // with res

  dbModel.monfact.getOneRes = () => resFactory.getOneRes(dbModel);

  dbModel.monfact.getAllRes = () => resFactory.getAllRes(dbModel);

  dbModel.monfact.deleteOneRes = () => resFactory.deleteOneRes(dbModel);

  dbModel.monfact.updateOneRes = () => resFactory.updateOneRes(dbModel);

  dbModel.monfact.createOneRes = () => resFactory.createOneRes(dbModel, null);

  dbModel.monfact.getOnePopulatedRes = () =>
    resFactory.getOnePopulatedRes(dbModel);

  dbModel.monfact.countRes = () => resFactory.countRes(dbModel);
};

export default monfact;
