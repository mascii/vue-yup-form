# yup.ValidationError
This is what `Field.$error` or `FormsField.$error` returns if there is an error.

## Details of `yup.ValidationError` object
The [README.md of yup](https://github.com/jquense/yup/blob/pre-v1/README.md) explains the same things.

### `message` property
- Error message (`string`).

```typescript
const firstName = field("", yup.string().required())
console.log(firstName.$error.message); // "this is a required field"

const lastName = field("", yup.string().required("REQUIRED!"));
console.log(lastName.$error.message); // "REQUIRED!"
```

### `errors` property
- Array of error messages (`string[]`).
  - `Field.$errorMessages` and `FormsField.$errorMessages` can be used instead. These properties return an empty array if there are no errors.

### `inner` property
- In the case of aggregate errors, inner is an array of `ValidationError` throw earlier in the validation chain.
- When the `abortEarly` option is `false` this is where you can inspect each error thrown, alternatively, `errors` will have all of the messages from each inner error.
