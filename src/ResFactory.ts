import { Model } from "mongoose";

import Factory from "./Factory";
import { isEmpty } from "./utils";
import { catchAsync, ExpErrors } from "experr";
import { IObject } from "./interfaces";

export default class ResFactory extends Factory {
  getAllRes = (dbModel: Model<any>) =>
    catchAsync(async (req, res, next) => {
      const docs = await this.getAll(dbModel, req.query);

      res.status(200).json({
        status: "success",
        results: docs.length,
        data: docs,
      });
    });

  getOneRes = (dbModel: Model<any>) =>
    catchAsync(async (req, res, next) => {
      //check for query params
      if (isEmpty(req.params))
        return next(ExpErrors.noQery("req.params can't be embty"));
      const doc = await this.getOne(dbModel, req.params);

      if (!doc)
        return next(
          ExpErrors.noDocumentMatched("there is no record matches this query")
        );
      res.status(200).json({
        status: "success",
        results: 1,
        data: doc,
      });
    });

  deleteOneRes = (dbModel: Model<any>) =>
    catchAsync(async (req, res, next) => {
      //check for query params
      if (isEmpty(req.params))
        return next(ExpErrors.noQery("req.params can't be embty"));

      const doc = await this.deleteOne(dbModel, req.params, next);

      if (!doc?.deletedCount)
        return next(
          ExpErrors.noDocumentMatched("there is no record matches this query")
        );

      res.status(202).json({
        status: "success",
      });
    });

  updateOneRes = (dbModel: Model<any>) =>
    catchAsync(async (req, res, next) => {
      //check for query obj & body
      if (isEmpty(req.params) || isEmpty(req.body))
        return next(ExpErrors.noQery("req.body can't be embty"));

      const doc = await this.updateOne(dbModel, req.params, req.body, next);

      if (!doc)
        return next(
          ExpErrors.noDocumentMatched("there is no record matches this query")
        );

      res.status(202).json({
        status: "success",
      });
    });

  createOneRes = (dbModel: Model<any>, body: IObject<any> | null) =>
    catchAsync(async (req, res, next) => {
      const item = body || req.body;

      //check for  body
      if (isEmpty(item))
        return next(ExpErrors.noQery("req.body can't be embty"));

      const doc = await this.createOne(dbModel, item, next);

      res.status(201).json({
        status: "success",
        // results: 1,
        // data: doc,
      });
    });

  getOnePopulatedRes = (dbModel: Model<any>) =>
    catchAsync(async (req, res, next) => {
      //check for query obj
      if (isEmpty(req.params))
        return next(ExpErrors.noQery("req.params can't be embty"));
      const docs = await this.getAll(dbModel, req.params);

      if (!docs?.length)
        return next(
          ExpErrors.noDocumentMatched("there is no record matches this query")
        );
      res.json({
        status: "success",
        results: docs?.length ? 1 : 0,
        data: {
          doc: docs[0],
        },
      });
    });

  countRes = (dbModel: Model<any>) =>
    catchAsync(async (req, res, next) => {
      const query = req.query;
      const count = await this.count(dbModel, query);
      res.json({
        status: "success",
        data: count,
      });
    });

  //   getDataTableData = (dbModel: Model<any>) =>
  //     catchAsync(async (req, res, next) => {
  //       const result = await mongoDataTables(dbModel).get(req.query);
  //       res.json(result);
  //     });

  accept = (dbModel: Model<any>) =>
    catchAsync(async (req, res, next) => {
      const state = req.body.state;
      const _id = req.body._id;
      await this.updateOne(dbModel, { _id }, { state }, next);
      res.json({
        status: "success",
      });
    });

  toggle = (dbModel: Model<any>) =>
    catchAsync(async (req, res, next) => {
      const status = req.body.status;
      const _id = req.body._id;
      await this.updateOne(dbModel, { _id }, { status }, next);
      res.json({
        status: "success",
      });
    });
}
