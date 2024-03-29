# formsField()
This function is used to create an array of forms.
This function returns `FormsField` object.

## Parameters
The `formsField()` takes 4 parameters:

```typescript
declare function formsField<T extends (arg: any) => Form>(
  generateForm: T,
  initialValueListOrLength: InitialValueListOrLength<T> = [],
  schema?: FormsFieldSchema<ReturnType<T>>,
  validateOptions?: ValidateOptions
): FormsField<T>;
```

### 1. `generateForm` <Badge type="danger" text="Required" />
- Pass a function that returns a form with 0 or 1 parameter.
  - A form should be defined using [`defineForm()`](/api/defineForm).

### 2. `initialValueListOrLength` <Badge type="info" text="Optional / Default: []" />
- Pass an array to initialize forms using `generateForm`.
  - Each element of the passed array is used as the parameter of `generateForm`.
- If the parameter of `generateForm` is optional, you can also pass an integer greater than or equal to 0 instead of an array.
- `[]` and `0` have equivalent meaning.

### 3. `schema` <Badge type="info" text="Optional" />
- Pass a yup *array* schema or a function that returns a yup *array* schema.
  - If you pass a function, the first argument is a *type bound* `yup.ArraySchema` object.
    - The same type as `$forms` is available in the `test()` method of `yup.ArraySchema`.
  - If you pass a function, you can refer to `$value` of other fields.
- For example, use to check that the length of `$forms` is greater than 0.

### 4. `validateOptions` <Badge type="info" text="Optional" />
- Pass `{ abortEarly: false }` if all validation errors by the yup array schema are required.

## Details of `FormsField` object
### `$forms` property <Badge type="info" text="Readonly" />
- Returns the array of forms generated by `generateForm`.
  - For use with `v-for`, each generated form is given a unique key named `$key`.

### `$error` property <Badge type="info" text="Readonly" />
- Returns a result of validating `$forms` reactively with the yup schema.
  - If `$forms` is invalid, `yup.ValidationError` is returned.
  - If `$forms` is valid, `undefined` is returned.

### `$errorMessages` property <Badge type="info" text="Readonly" />
- Returns an error messages array (`string[]`) reactively as well as `$error` property.
  - If `abortEarly` is false, it can return more than one element.

### `$label` property <Badge type="info" text="Readonly" />
- Returns the label of the yup schema.
  - For example, if you pass `yup.array().label("Questions")`, you will obtain `"Questions"`.
  - If the `schema` you passed is a function, the function is evaluated once when the object is created.

### `$initialize()` method
- Pass an array to initialize forms using `generateForm`.
  - The parameter of this method is the same as the second parameter of `formsField()`.
- If the argument is omitted, all array elements will be removed.

### `$append()` method
- Pass a parameter to initialize a form using `generateForm`, and the result is appended to `$forms`.
- If the parameter of `generateForm` is optional, you can omit the argument.

### `$prepend()` method
- Pass a parameter to initialize a form using `generateForm`, and the result is prepended to `$forms`.
- If the parameter of `generateForm` is optional, you can omit the argument.

### `$remove()` method
- Pass the index of the array element to be removed.
  - Negative integers count back from the last item in the array, like [`Array.prototype.at`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).

### `$writableForms` property
- :warning: **Usually should not be used.**
  - Even if you use the [`Array.prototype.push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) method etc, `$error` property cannot detect the change by reactively.
- Returns the same reference as `$forms` property, and settable.
- For example, using with [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable)'s draggable component.
  - `<draggable v-model="formsFieldObject.$writableForm">`
