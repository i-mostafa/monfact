import Factory from "./Factory";
import ResFactory from "./ResFactory";
import monfact from "./MonFact";
import mongoose from "mongoose";
import { IMonFact, IObject } from "./interfaces";
const factory = new Factory();
const resFactory = new ResFactory();
declare module "mongoose" {
  interface Model<T, TQueryHelpers = {}, TMethods = {}, TVirtuals = {}> {
    monfact: IMonFact;
  }
}

export { factory, resFactory, monfact };
