import { Model } from "mongoose";
import Filter from "./Filter";
import { IObject, IQuery } from "./interfaces";
import { getRefQueries } from "./utils";

const { dbConnection } = require("../models/mongodb.connect");

export default class Populator extends Filter {
  refPathes: IObject<string>;
  refQueries: IObject<any>;

  constructor(dbModel: Model<any>, queryObj = {}) {
    super(dbModel, queryObj);
    this.refPathes = dbModel.refPathes || {};
    this.refQueries = {};

    ({ refQueries: this.refQueries, queryObj: this.queryObj } = getRefQueries(
      queryObj,
      this.refPathes
    ));
  }

  async resolvePopPathes() {
    const collections = Object.keys(this.refQueries);
    await Promise.all(
      collections.map(async (collection) => {
        const { query, parent } = this.refQueries[collection];
        const docs = await dbConnection.db
          .collection(collection.toLowerCase())
          .find(query)
          .toArray();

        this.queryObj[parent] = {
          $in: docs.map((doc: IObject<any>) => doc._id),
        };
      })
    );
  }
  async exec() {
    console.log(this.refQueries);
    if (!_.isEmpty(this.refQueries)) await this.resolvePopPathes();

    return this.queryObj;
  }
}
