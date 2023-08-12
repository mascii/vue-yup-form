import {
  defineForm,
  field,
  privateField,
  formsField,
  toObject,
} from "../src/index";
import * as yup from "yup";

describe("toObject", () => {
  test("basic form", () => {
    const form = defineForm({
      a: field("A", yup.string().required()),
      b: field("", yup.string().required()),
      c: field("C", yup.string().required()),
      id: privateField<number | null>(null, yup.number().required()),
      memo: privateField("hello, world"),
      method() {},
    });
    expectTypeOf(toObject(form)).toEqualTypeOf<{
      a: string;
      b: string;
      c: string;
    }>();
  });

  test("form includes nested forms", () => {
    const form = defineForm({
      a: {
        a: field("A", yup.string().required()),
        b: {
          a: field("", yup.string().required()),
        },
        c: field("C", yup.string().required()),
      },
      b: field("B", yup.string().required()),
    });
    expectTypeOf(toObject(form)).toEqualTypeOf<{
      a: {
        a: string;
        b: {
          a: string;
        };
        c: string;
      };
      b: string;
    }>();
    expectTypeOf(toObject(form.a)).toEqualTypeOf<{
      a: string;
      b: {
        a: string;
      };
      c: string;
    }>();
    expectTypeOf(toObject(form.a.b)).toEqualTypeOf<{
      a: string;
    }>();
  });

  test("form includes FieldWithPreferredType<T, U>", () => {
    type Foo = "A" | "B" | "C";

    const form = defineForm({
      a: field("A", yup.string().required()),
      b: field<Foo | null>("A", yup.string().required()),
      c: field<Foo | null, Foo>("A", yup.string().required()),
    });
    expectTypeOf(toObject(form)).toEqualTypeOf<{
      a: string;
      b: Foo | null;
      c: Foo;
    }>();
  });

  test("form includes formsField", () => {
    const generateSubForm = (initialText = "") =>
      defineForm({
        text: field(initialText, yup.string().required()),
      });

    const form = defineForm({
      a: formsField(generateSubForm, 1, yup.array().min(1)),
      b: field("B", yup.string().required()),
    });
    expectTypeOf(toObject(form)).toEqualTypeOf<{
      a: { text: string }[];
      b: string;
    }>();
    expectTypeOf(toObject(form.a.$forms[0]!)).toEqualTypeOf<{
      text: string;
    }>();
  });
});
