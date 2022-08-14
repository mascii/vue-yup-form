import {
  defineForm,
  field,
  privateField,
  formsField,
  isValidForm,
} from "../src/index";
import * as yup from "yup";

describe("isValidForm", () => {
  test("basic form", () => {
    const form = defineForm({
      a: field("A", yup.string().required()),
      b: field("", yup.string().required()),
      c: field("C", yup.string().required()),
      id: privateField<number | null>(null, yup.number().required()),
      memo: privateField("hello, world"),
    });
    expect(isValidForm(form)).toBe(false);

    form.b.$value = "B";
    expect(isValidForm(form)).toBe(false);

    form.id.$value = 1;
    expect(isValidForm(form)).toBe(true);
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
    expect(isValidForm(form)).toBe(false);
    expect(isValidForm(form.a)).toBe(false);
    expect(isValidForm(form.a.b)).toBe(false);

    form.a.b.a.$value = "A";
    expect(isValidForm(form)).toBe(true);
    expect(isValidForm(form.a)).toBe(true);
    expect(isValidForm(form.a.b)).toBe(true);

    form.a.c.$value = "";
    expect(isValidForm(form)).toBe(false);
    expect(isValidForm(form.a)).toBe(false);
    expect(isValidForm(form.a.b)).toBe(true);
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
    expect(isValidForm(form)).toBe(false);

    form.a.$append("hello");
    expect(isValidForm(form)).toBe(true);

    form.a.$append();
    expect(isValidForm(form)).toBe(false);

    form.a.$forms[1].text.$value = "world";
    expect(isValidForm(form)).toBe(true);
  });
});
