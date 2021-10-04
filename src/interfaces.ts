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
