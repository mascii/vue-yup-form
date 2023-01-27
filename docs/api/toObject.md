# toObject()
This function takes a form and returns unwrapped `Field` and `FormsField` contained in the form.
This function does not check if the form is valid.

## Parameters
The `toObject()` takes 1 parameter:

```typescript
function toObject<T extends Form>(
  form: T | (T & { $key: number })
): Expand<ToObjectOutput<T>>;
```

### 1. `forms` <Badge type="danger" text="Required" />
- A form should be defined using [`defineForm()`](/api/defineForm).

## Example
```typescript
test("toObject()", () => {
  const generateSubForm = (initialText = "") =>
    defineForm({
      text: field(initialText, yup.string().required()),
    });

  const form = defineForm({
    a: {
      a: field("A", yup.string().required()),
      b: {
        a: field("", yup.string().required()),
      },
      c: field("C", yup.string().required()),
    },
    b: field("B", yup.string().required()),
    c: privateField("C", yup.string().required()),
    d: formsField(generateSubForm, ["x", "y", ""], yup.array().min(1)),
    e: () => {},
  });

  expect(toObject(form)).toEqual({
    a: {
      a: "A",
      b: {
        a: "",
      },
      c: "C",
    },
    b: "B",
    d: [{ text: "x" }, { text: "y" }, { text: "" }],
  });
});
```