# field()
This function takes an initial value and a yup schema.
This function returns `Field` object.

## Parameters
The `field()` takes 3 parameters and some generic type parameters:

```typescript
declare function field<T>(
  value: T | Ref<T>,
  schema?: FieldSchema,
  validateOptions?: ValidateOptions
): Field<T>;
declare function field<T, U extends T>(
  value: T | Ref<T>,
  schema?: FieldSchema,
  validateOptions?: ValidateOptions
): FieldWithPreferredType<T, U>;
```

### 1. `value` <Badge type="danger" text="Required" />
- Pass an initial value like such as `string`, `number`, `boolean`, and `string[]` types.

::: tip
Internally the `value` is made reactive by `shallowRef()`.
To use a Ref other than `shallowRef()`, pass a Ref object instead.

```typescript
import { ref } from "vue";

const point = field(
  ref({ x: 0, y: 0, z: 0 }),
  yup
    .object()
    .shape({ x: yup.number().required(),  y: yup.number().required(), z: yup.number().required() })
    .test({
      test: ({ x, y, z }) => x ** 2 + y ** 2 + z ** 2 <= 1,
      message: "Specify the inside of the unit ball.",
    })
);
```
:::

### 2. `schema` <Badge type="info" text="Optional" />
- Pass a yup schema or a function that returns a yup schema.
  - If you pass a function, you can refer to `$value` of other fields.

::: tip
Even when using `v-model.number`, changing the input box to empty may set `""` (an empty string).
This causes the validation with `yup.NumberSchema` to output an undesirable error message:

```typescript
try {
  yup.number().required().validateSync("");
} catch (e) {
  console.log(e.message); // this must be a `number` type, but the final value was: `NaN` (cast from the value `""`).
}
```

To avoid the above, empty strings are validated as `undefined` if `yup.NumberSchema` is specified.

```typescript
const age = field(20, yup.number().required());

// Equivalent to changing <input type="number" v-model.number="age.$value"> to empty
age.$value = "";

console.log(age.$error.message); // this is a required field
```
:::

::: warning
Since `validateSync()` is used internally, Async tests are not available.
:::

### 3. `validateOptions` <Badge type="info" text="Optional" />
- Pass `{ abortEarly: false }` if all validation errors by the yup schema are required.

### `T` <Badge type="info" text="Optional" />
- Pass the type of `$value` explicitly like `ref<T>()`.

### `U` <Badge type="info" text="Optional" />
- Pass the preferred type to be the result of [`toObject()`](/api/toObject).

## Details of `Field` object
### `$value` property
- The field value that can be set to `v-model`.

### `$error` property <Badge type="info" text="Readonly" />
- Returns a result of validating `$value` reactively with the yup schema.
  - If `$value` is invalid, `yup.ValidationError` is returned.
  - If `$value` is valid, `undefined` is returned.

### `$errorMessages` property <Badge type="info" text="Readonly" />
- Returns an error messages array (`string[]`) reactively as well as `$error` property.
  - If `abortEarly` is false, it can return more than one element.

### `$label` property <Badge type="info" text="Readonly" />
- Returns the label of the yup schema.
  - For example, if you pass `yup.number().label("Age")`, you will obtain `"Age"`.
  - If the `schema` you passed is a function, the function is evaluated once when the object is created.
