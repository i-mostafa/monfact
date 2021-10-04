import { NextFunction } from "express";
import { Model } from "mongoose";

import { IObject, IQuery } from "./interfaces";
import ResFactory from "./ResFactory";

const monfact = (dbModel: Model<any>) => {
  const resFactory = new ResFactory();

  dbModel.monfact = {
    getOne: (params: IObject<any>, select = "") =>
      resFactory.getOne(dbModel, params, select),

    getAll: (queryObj: IQuery) => resFactory.getAll(dbModel, queryObj),
    deleteOne: (params: IObject<any>, next: NextFunction) =>
      resFactory.deleteOne(dbModel, params, next),
    updateOne: (
      params: IObject<any>,
      update: IObject<any>,
      next: NextFunction
    ) => resFactory.updateOne(dbModel, params, update, next),
    updateMany: (
      params: IObject<any>,
      update: IObject<any>,
      next: NextFunction
    ) => resFactory.updateMany(dbModel, params, update, next),
    createOne: (doc: IObject<any>, next: NextFunction) =>
      resFactory.createOne(dbModel, doc, next),
    count: (queryObj = {}) => resFactory.count(dbModel, queryObj),

    // with res

    getOneRes: () => resFactory.getOneRes(dbModel),
    getAllRes: () => resFactory.getAllRes(dbModel),
    deleteOneRes: () => resFactory.deleteOneRes(dbModel),
    updateOneRes: () => resFactory.updateOneRes(dbModel),
    createOneRes: () => resFactory.createOneRes(dbModel, null),
    getOnePopulatedRes: () => resFactory.getOnePopulatedRes(dbModel),
    countRes: () => resFactory.countRes(dbModel),
  };
};

export default monfact;
