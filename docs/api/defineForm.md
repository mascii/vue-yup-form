# defineForm()
An identity function whose argument type extends the `Form` type. This function is used for type checking.

```typescript
function defineForm<T extends Form>(form: T): T {
  return form;
}
```

## Details of `Form` type
An object that satisfies the following:

- Key
  - Starting with `$` are not available.
- Value is one of the following
  - `Field` object ([`field()`](/api/field) returns)
  - `PrivateField` object ([`privateField()`](/api/privateField) returns)
  - `FormsField` object ([`formsField()`](/api/formsField) returns)
  - `Form` object recursively

```typescript
type Form = {
  [key: `$${string}`]: never;
  [key: string]: Form | Field | PrivateField | FormsField;
};
```