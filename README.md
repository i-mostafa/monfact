# MonFact

## MongoDb factory to translate API Queries to MongoDb

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Monfact is an npm package to handle all mongodb queries on top of mongoose ORM In roder to generalize the targets.

## Features

- Easy to use.
- Standard Error response.
- Has most required operations on mongodb (CRUd, with a graphQl filter query).
- You can append it to the mongoose model itself in order to be used as static methods or use the factory to custom queries.
- Makes the code pretty clean, scalable and maintainble.
- Injected to the mongoose Model interface so the intellisense will recognise it.

## Installation

```sh
npm i monfact
```

## Methods

For injected version:

```js
export interface IMonFact {
  getOne(params: IObject<any>, select: string): Promise<any>;
  getAll(queryObj: IQuery): Promise<any>;
  deleteOne(params: IObject<any>, next: NextFunction): Promise<any>;
  updateOne(
    params: IObject<any>,
    update: IObject<any>,
    next: NextFunction
  ): Promise<any>;
  updateMany(
    params: IObject<any>,
    update: IObject<any>,
    next: NextFunction
  ): Promise<any>;
  createOne(doc: IObject<any>, next: NextFunction): Promise<any>;
  count(queryObj: IQuery): Promise<any>;
  getOneRes(): void;
  getAllRes(): void;
  deleteOneRes(): void;
  updateOneRes(): void;
  createOneRes(): void;
  getOnePopulatedRes(): void;
  countRes(): void;
}
```

\*\*when using the factory or ResFactory version you must pass the mongoose model as the first paramater.

## ResMethods

ResMethods usees (req.body, req.params, req.query);

- getOneRes: uses req.params to filter
- getAllRes: uses req.query to filter
- deleteOneRes: uses req.params to filter
- updateOneRes: uses req.params to filter and req.body to update
- createOneRes: uses req.body to create
- getOnePopulatedRes: uses req.params to filter but make sure that there is a filed "popFields" to be populated
- countRes: uses req.query to filter

## Query

```js
{
  "page": 1, // optional default 1
  "limit": 10, // optional default 10
  "skip": 20, // optional default 0
  "sort": "name"| "-name"| "-name,age", // optional default '-createdAt'
  "fields": "name"| "name,_id", // optional default all fields
  "popFields": "products,favourites.meals", // optional default null
  'exclude': "excludeId", // optional default null
  .
  .
  //other fields on the object
  "name":"islam",
  "age":{gt:15, lt:20},
  "list":{push:"item1", pull:"item2"} // remove item2 and add item1
}
```

## Usage

```js
// there is two ways to use monfact
// first is to inject it to the mongoose model and use injected methods.

// in category.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { monfact } = require("monfact");

const CategorySchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
});

const CategoryModel = mongoose.model("Categories", CategorySchema);
// inject monfact to CategoryModel
monfact(CategoryModel);
// export CategoryModel
module.exports = CategoryModel;

// in category.controller.js
// you can use it inside a function like this
exports.getAllCategories = async (req, res, next) => {
  const categories = await CategoryModel.monfact.getAll({ name: "souly" });
  res.json({ status: "success", data: categories });
};

// or use the res version which uses the req.body & req.params & req.query
exports.getAllCategories = CategoryModel.monfact.getAllRes();

// then pass this function to the router
router.get("/", getAllCategories);

// the second method is to use the factory to build queries
// with res version
const { resFactory } = require("monfact");
exports.getAllCategories = resFactory.getAllRes(CategoryModel);

// plain version
exports.getAllCategories = async (req, res, next) => {
  const categories = await factory.getAll(CategoryModel, { name: "souly" });
  res.json({ status: "success", data: categories });
};
```

## Response

The response is in standard format (status, message, errCode)

```json
{
"status": "error",
"errCode": "err-code",
"message": "error - message"
}
{
"status": "success",
"data":  [] | {} | null
}
```

## License

MIT

**Feel free to fork it!**
