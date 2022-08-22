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
    expect(toObject(form)).toEqual({
      a: "A",
      b: "",
      c: "C",
    });
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
    expect(toObject(form)).toEqual({
      a: {
        a: "A",
        b: {
          a: "",
        },
        c: "C",
      },
      b: "B",
    });
    expect(toObject(form.a)).toEqual({
      a: "A",
      b: {
        a: "",
      },
      c: "C",
    });
    expect(toObject(form.a.b)).toEqual({
      a: "",
    });
  });

  test("form includes formsField", () => {
    const generateSubForm = (initialText = "") =>
      defineForm({
        text: field(initialText, yup.string().required()),
      });

    const form = defineForm({
      a: formsField(generateSubForm, 0, yup.array().min(1)),
      b: field("B", yup.string().required()),
    });
    expect(toObject(form)).toEqual({
      a: [],
      b: "B",
    });

    form.a.$append("hello");
    expect(toObject(form)).toEqual({
      a: [{ text: "hello" }],
      b: "B",
    });

    form.a.$append();
    expect(toObject(form)).toEqual({
      a: [{ text: "hello" }, { text: "" }],
      b: "B",
    });

    form.a.$forms[1].text.$value = "world";
    expect(toObject(form)).toEqual({
      a: [{ text: "hello" }, { text: "world" }],
      b: "B",
    });
  });
});
