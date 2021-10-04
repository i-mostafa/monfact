import { NextFunction } from "express";
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

  // with res

  getOneRes(): void;
  getAllRes(): void;
  deleteOneRes(): void;
  updateOneRes(): void;
  createOneRes(): void;
  getOnePopulatedRes(): void;
  countRes(): void;
}
