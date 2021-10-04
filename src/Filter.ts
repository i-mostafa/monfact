import { Model, QueryWithHelpers } from "mongoose";
import { apiOptions } from "./constants";
import { IQuery } from "./interfaces";
import { excludeFilterOptions } from "./utils";

export default class Filter {
  model: Model<any>;
  queryObj: IQuery;
  query: QueryWithHelpers<Array<any>, any>;
  constructor(dbModel: Model<any>, queryObj: IQuery = {}) {
    this.model = dbModel;
    this.queryObj = queryObj;
    this.query = this.model.find();
  }

  filter() {
    const queryObj = { ...this.queryObj };

    // remove filter options fields
    excludeFilterOptions(queryObj, apiOptions);

    // get filter mongoose query
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|lte|gt|lt)\b/g,
      (match) => `$${match}`
    );

    // apply query
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortSring = this.queryObj.sort.split(",").join(" ");
      this.query = this.query.sort(sortSring);
    } else this.query = this.query.sort("-createdAt");
    return this;
  }

  exclude() {
    if (this.queryObj.exclude)
      this.query = this.query.find({ _id: { $ne: this.queryObj.exclude } });
    return this;
  }
  count() {
    return this.query.count();
  }

  limitFields() {
    if (this.queryObj.fields) {
      const fieldsString = this.queryObj.fields.split(",").join(" ");
      this.query = this.query.select(fieldsString);
    } else this.query = this.query.select("-__v");
    return this;
  }

  paginate() {
    let page = 1;

    if (this.queryObj.page) page = this.queryObj.page * 1;

    let limit = apiOptions.defualtResultsLimit;

    if (this.queryObj.limit)
      limit =
        this.queryObj.limit * 1 > apiOptions.maxResultsLimit
          ? apiOptions.maxResultsLimit
          : this.queryObj.limit * 1;

    const skip = this.queryObj.skip
      ? this.queryObj.skip * 1
      : (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  populate() {
    if (this.queryObj.popFields) {
      const popFields = this.queryObj.popFields.split(",");
      popFields.map(
        (field) =>
          (this.query = this.query.populate({
            path: field,
            // select: populateOptions[field],
          }))
      );
    }
    return this;
  }
}
