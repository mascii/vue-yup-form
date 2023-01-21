# isValidForm()
This function takes a form and checks that all `$error` properties in the form are `undefined`.
This function returns boolean.

## Parameters
The `isValidForm()` takes 1 parameter:

```typescript
function isValidForm<T extends Form>(form: T | (T & { $key: number; })): boolean
```

### `forms` <Badge type="danger" text="Required" />
- A form should be defined using [`defineForm()`](/api/defineForm).
