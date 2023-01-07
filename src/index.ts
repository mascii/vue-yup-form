import {
  computed,
  isRef,
  shallowRef,
  type ComputedRef,
  type PropType,
  type Ref,
} from "vue-demi";

import { ArraySchema, NumberSchema } from "yup";
import type * as yup from "./yup";
import type {
  FirstParameter,
  InitialValueListOrLength,
  Expand,
  ValidateOptions,
  FieldSchema,
  FormsFieldSchema,
} from "./types";

export type Form = {
  [key: `$${string}`]: never;
  [key: string]:
    | Field<any>
    | PrivateField<any>
    | FormsField<(arg: any) => Form>
    | ((...args: any[]) => any)
    | Form;
};

export type FormPropType<T extends () => Form> = PropType<
  ReturnType<T> & { $key?: number }
>;

class Field<T> {
  private readonly $valueRef: Ref<T>;
  private readonly $errorRef: ComputedRef<yup.ValidationError | undefined>;
  public readonly $label: string;

  constructor(
    value: T | Ref<T>,
    schema?: FieldSchema,
    validateOptions?: ValidateOptions
  ) {
    this.$valueRef = isRef(value) ? value : shallowRef(value);

    const initialSchema = typeof schema === "function" ? schema() : schema;
    const isNumberSchemaField = initialSchema instanceof NumberSchema;
    this.$errorRef = computed(
      schema
        ? () => {
            const obtainedSchema =
              typeof schema === "function" ? schema() : schema;

            // Changing `<input type="number" v-model.number="foo" />` to blank, `foo` is set to empty string.
            const targetValue =
              isNumberSchemaField && typeof this.$valueRef.value !== "number"
                ? undefined
                : this.$valueRef.value;

            try {
              obtainedSchema.validateSync(targetValue, validateOptions);
            } catch (e: any) {
              return e;
            }

            return undefined;
          }
        : () => undefined
    );

    this.$label = initialSchema?.describe().label || "";
  }

  public get $value(): T {
    return this.$valueRef.value;
  }
  public set $value(value) {
    this.$valueRef.value = value;
  }

  public get $error(): yup.ValidationError | undefined {
    return this.$errorRef.value;
  }

  public get $errorMessages(): string[] {
    return this.$errorRef.value?.errors || [];
  }
}

class PrivateField<T> extends Field<T> {
  // Distinguish between Field and PrivateField in the structural type system
  private readonly __isPrivateField!: true;
}

class FormsField<T extends (arg: any) => Form> {
  private readonly $generateFormWithKey: (
    initialValue: FirstParameter<T>
  ) => ReturnType<T> & { $key: number };
  private readonly $formsRef: Ref<(ReturnType<T> & { $key: number })[]>;
  private readonly $errorRef: ComputedRef<yup.ValidationError | undefined>;
  public readonly $label: string;

  constructor(
    generateForm: T,
    initialValueListOrLength: InitialValueListOrLength<T>,
    schema?: FormsFieldSchema<ReturnType<T>>,
    validateOptions?: ValidateOptions
  ) {
    let count = 1;
    this.$generateFormWithKey = (initialValue) => {
      const form: any = generateForm(initialValue);
      form.$key = count++;
      return form as ReturnType<T> & { $key: number };
    };

    this.$formsRef = shallowRef([]);
    this.$initialize(initialValueListOrLength);

    this.$errorRef = computed(
      schema
        ? () => {
            const obtainedSchema =
              typeof schema === "function" ? schema(new ArraySchema()) : schema;

            try {
              obtainedSchema.validateSync(
                this.$formsRef.value,
                validateOptions
              );
            } catch (e: any) {
              return e;
            }

            return undefined;
          }
        : () => undefined
    );

    const initialSchema =
      typeof schema === "function" ? schema(new ArraySchema()) : schema;
    this.$label = initialSchema?.describe().label || "";
  }

  public get $forms(): readonly (ReturnType<T> & { $key: number })[] {
    return this.$formsRef.value;
  }

  public get $writableForms(): (ReturnType<T> & { $key: number })[] {
    return this.$formsRef.value;
  }
  public set $writableForms(value) {
    this.$formsRef.value = value;
  }

  public get $error(): yup.ValidationError | undefined {
    return this.$errorRef.value;
  }

  public get $errorMessages(): string[] {
    return this.$errorRef.value?.errors || [];
  }

  public $initialize(
    initialValueListOrLength: InitialValueListOrLength<T> = []
  ): void {
    const initialValueList =
      typeof initialValueListOrLength === "number"
        ? ([...Array(initialValueListOrLength)] as undefined[])
        : initialValueListOrLength;

    this.$formsRef.value = initialValueList.map((initialValue) =>
      this.$generateFormWithKey(initialValue)
    );
  }

  public $append(
    ...args: undefined extends FirstParameter<T>
      ? [initialValue?: FirstParameter<T>]
      : [initialValue: FirstParameter<T>]
  ): void;
  public $append(initialValue?: FirstParameter<T>): void {
    const forms = this.$formsRef.value.slice();
    forms.push(this.$generateFormWithKey(initialValue));
    this.$formsRef.value = forms;
  }

  public $prepend(
    ...args: undefined extends FirstParameter<T>
      ? [initialValue?: FirstParameter<T>]
      : [initialValue: FirstParameter<T>]
  ): void;
  public $prepend(initialValue?: FirstParameter<T>): void {
    const forms = this.$formsRef.value.slice();
    forms.unshift(this.$generateFormWithKey(initialValue));
    this.$formsRef.value = forms;
  }

  public $remove(index: number): void {
    const forms = this.$formsRef.value.slice();
    forms.splice(index + (index < 0 ? this.$formsRef.value.length : 0), 1);
    this.$formsRef.value = forms;
  }
}

export function defineForm<T extends Form>(form: T): T {
  return form;
}

export function field<T>(
  value: T | Ref<T>,
  schema?: FieldSchema,
  validateOptions?: ValidateOptions
): Field<T> {
  return new Field(value, schema, validateOptions);
}

export function privateField<T>(
  value: T,
  schema?: FieldSchema,
  validateOptions?: ValidateOptions
): PrivateField<T> {
  return new PrivateField(value, schema, validateOptions);
}

export function formsField<T extends (arg: any) => Form>(
  generateForm: T,
  initialValueListOrLength: InitialValueListOrLength<T> = [],
  schema?: FormsFieldSchema<ReturnType<T>>,
  validateOptions?: ValidateOptions
): FormsField<T> {
  return new FormsField(
    generateForm,
    initialValueListOrLength,
    schema,
    validateOptions
  );
}

export function isValidForm<T extends Form>(
  form: T | (T & { $key: number })
): boolean {
  for (const value of Object.values(form)) {
    if (typeof value !== "object") {
      continue;
    }

    if (value instanceof Field) {
      if (value.$error) {
        return false;
      }
    } else if ("$forms" in value) {
      if (value.$error || value.$forms.some((form) => !isValidForm(form))) {
        return false;
      }
    } else if (!isValidForm(value)) {
      return false;
    }
  }
  return true;
}

type ToObjectOutput<T extends Form> = {
  [K in keyof T as T[K] extends PrivateField<any> | ((...args: any[]) => any)
    ? never
    : Exclude<K, "$key">]: T[K] extends Form
    ? ToObjectOutput<T[K]>
    : T[K] extends Field<any>
    ? T[K]["$value"]
    : T[K] extends FormsField<(arg: any) => Form>
    ? ToObjectOutput<T[K]["$forms"][number]>[]
    : never;
};

export function toObject<T extends Form>(
  form: T | (T & { $key: number })
): Expand<ToObjectOutput<T>> {
  const obj: any = {};

  for (const [key, value] of Object.entries(form)) {
    if (typeof value !== "object") {
      continue;
    }

    if (value instanceof Field) {
      if (!(value instanceof PrivateField)) {
        obj[key] = value.$value;
      }
    } else if ("$forms" in value) {
      obj[key] = value.$forms.map((form) => toObject(form));
    } else {
      obj[key] = toObject(value);
    }
  }

  return obj;
}
