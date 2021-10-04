import { Model } from "mongoose";

export interface IQuery {
  [key: string]: string | undefined | number | object;
  page?: number;
  limit?: number;
  skip?: number;
  sort?: string;
  fields?: string;
  popFields?: string;
  exclude?: string;
}
export interface IObject<T> {
  [key: string]: T;
}
export interface IMonFactModel extends Model<any> {
  monfact: IObject<any>;
}
