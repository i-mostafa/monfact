import { Schema } from "mongoose";
import { IObject, IQuery } from "./interfaces";

export const excludeFilterOptions = (queryObj: any, apiOptions: any) => {
  apiOptions.filterOptions.forEach((option: string) => delete queryObj[option]);
};

export const extractPushAndPull = (queryObj: IQuery) => {
  let queryStr = JSON.stringify({ ...queryObj });
  queryStr = queryStr.replace(/\b(push|pull)\b/g, (match) => `$${match}`);
  return JSON.parse(queryStr);
};

export const resolveNestedQuery = (queryObj: IQuery) => {
  const resolved: IObject<any> = {};
  Object.keys(queryObj).forEach((key) => {
    const resolvedKey = key.replace("-", ".");
    resolved[resolvedKey] = queryObj[key];
  });
  return resolved;
};

export const getRefQueries = (queryObj: IQuery, refPathes: IObject<string>) => {
  const refKeys = Object.keys(refPathes);
  const refQueries: IObject<any> = {};
  Object.keys(queryObj).forEach((param) => {
    const pathParts = param.split(".");
    const parent = pathParts[0];

    if (refKeys.includes(parent)) {
      refQueries[refPathes[parent]] = {
        parent,
        query: { [pathParts.slice(1).join(".")]: queryObj[param] },
      };
      delete queryObj[param];
    }
  });
  return { refQueries, queryObj };
};

export const isEmpty = (obj: IObject<any> | any[]) =>
  !(Object.keys(obj || {}).length > 0);

/**
 *  check if str is convertable to number
 * @param  {String} str
 *
 */
export const isNumeric = (str: string) => str !== "" && !isNaN(Number(str));

export const getRefPathes = (
  schema: Schema,
  refPathes: IObject<string> = {},
  parentPath = ""
) => {
  schema.eachPath((path) => {
    const obj = schema.paths[path].options;
    if (obj.type instanceof Schema)
      return getRefPathes(obj.type, refPathes, `${path}.`);

    if (obj.ref) refPathes[`${parentPath}${path}`] = obj.ref;
  });
  return refPathes;
};
