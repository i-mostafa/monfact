import mongoose, { Model } from "mongoose";
import Filter from "./Filter";
import { IObject } from "./interfaces";
import { getRefPathes, getRefQueries, isEmpty } from "./utils";

export default class Populator extends Filter {
  refPathes: IObject<string>;
  refQueries: IObject<any>;

  constructor(dbModel: Model<any>, queryObj = {}) {
    super(dbModel, queryObj);
    this.refPathes = getRefPathes(dbModel.schema) || {};
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
        const docs = await mongoose.connection.db
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
    if (!isEmpty(this.refQueries)) await this.resolvePopPathes();
    return this.queryObj;
  }
}
