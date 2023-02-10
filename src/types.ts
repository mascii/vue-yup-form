import type * as yup from "./yup";

export type FirstParameter<T extends (...args: any) => any> =
  Parameters<T>["length"] extends 0 ? undefined : Parameters<T>[0];
export type InitialValueListOrLength<T extends (...args: any) => any> =
  | (undefined extends FirstParameter<T> ? number : 0)
  | FirstParameter<T>[];
export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T;
export type ValidateOptions = {
  abortEarly?: boolean;
};

type IfYupVersion1_0_0<Y, N> = keyof yup.Schema extends never
  ? N // tested with yup@0.32.11
  : Y; // tested with yup@1.0.0

type YupSchema = IfYupVersion1_0_0<yup.Schema, yup.AnySchema>;
export type FieldSchema = YupSchema | (() => YupSchema);

type InnerType<T> = IfYupVersion1_0_0<T[] | undefined, yup.AnySchema<T>>;
export type FormsFieldSchema<T> =
  | yup.ArraySchema<InnerType<T>, any>
  | ((
      arraySchema: yup.ArraySchema<InnerType<T>, any>
    ) => yup.ArraySchema<InnerType<T>, any>);
