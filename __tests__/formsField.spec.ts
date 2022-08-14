import { testReactivity } from "./testReactivity";

import { defineForm, field, formsField } from "../src/index";
import * as yup from "yup";

const generateFormWithNoParameter = () =>
  defineForm({
    text: field(""),
  });

const generateFormWithRequiredParameter = (initialText: string) =>
  defineForm({
    text: field(initialText),
  });

const generateFormWithOptionalParameter = (initialText = "default") =>
  defineForm({
    text: field(initialText),
  });

describe("formsField", () => {
  test("initialize formsField with generateForm function", () => {
    const formsFieldObject1 = formsField(generateFormWithNoParameter, 3);
    expect(formsFieldObject1.$forms[0].text.$value).toBe("");
    expect(formsFieldObject1.$forms[1].text.$value).toBe("");
    expect(formsFieldObject1.$forms[2].text.$value).toBe("");

    const formsFieldObject2 = formsField(generateFormWithRequiredParameter, [
      "A",
      "B",
      "C",
    ]);
    expect(formsFieldObject2.$forms[0].text.$value).toBe("A");
    expect(formsFieldObject2.$forms[1].text.$value).toBe("B");
    expect(formsFieldObject2.$forms[2].text.$value).toBe("C");

    const formsFieldObject3 = formsField(generateFormWithOptionalParameter, 3);
    expect(formsFieldObject3.$forms[0].text.$value).toBe("default");
    expect(formsFieldObject3.$forms[1].text.$value).toBe("default");
    expect(formsFieldObject3.$forms[2].text.$value).toBe("default");

    const formsFieldObject4 = formsField(generateFormWithOptionalParameter, [
      "A",
      undefined,
      "C",
    ]);
    expect(formsFieldObject4.$forms[0].text.$value).toBe("A");
    expect(formsFieldObject4.$forms[1].text.$value).toBe("default");
    expect(formsFieldObject4.$forms[2].text.$value).toBe("C");
  });

  test("no schema was given", () => {
    const formsFieldObject = formsField(generateFormWithNoParameter);
    expect(formsFieldObject.$error).toBeUndefined();
  });

  test("static schema was given", () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      0,
      yup.array().min(1)
    );
    expect(formsFieldObject.$error).toBeInstanceOf(yup.ValidationError);

    formsFieldObject.$append();
    expect(formsFieldObject.$error).toBeUndefined();
  });

  test("functional schema was given", () => {
    const formsFieldObject = formsField(
      generateFormWithRequiredParameter,
      ["abcd", "efgh", "ij"],
      (arraySchema) =>
        arraySchema.test({
          test: (forms) =>
            !!forms &&
            forms.reduce(
              (prev, currentForm) => prev + currentForm.text.$value.length,
              0
            ) <= 10,
        })
    );
    expect(formsFieldObject.$error).toBeUndefined();

    formsFieldObject.$forms[2].text.$value += "k";
    expect(formsFieldObject.$error).toBeInstanceOf(yup.ValidationError);
  });

  test("$label", () => {
    const formsFieldObject1 = formsField(
      generateFormWithNoParameter,
      0,
      yup.array().label("Questions")
    );
    expect(formsFieldObject1.$label).toBe("Questions");

    const formsFieldObject2 = formsField(
      generateFormWithNoParameter,
      0,
      yup.array()
    );
    expect(formsFieldObject2.$label).toBe("");

    const formsFieldObject3 = formsField(
      generateFormWithNoParameter,
      0,
      (arraySchema) => arraySchema.label("Questions")
    );
    expect(formsFieldObject3.$label).toBe("Questions");

    const formsFieldObject4 = formsField(
      generateFormWithNoParameter,
      0,
      (arraySchema) => arraySchema
    );
    expect(formsFieldObject4.$label).toBe("");

    const formsFieldObject5 = formsField(generateFormWithNoParameter, 0);
    expect(formsFieldObject5.$label).toBe("");
  });

  test("abortEarly and $errorMessages", () => {
    const formsFieldObject1 = formsField(
      generateFormWithOptionalParameter,
      2,
      yup.array().min(3).max(0),
      {
        abortEarly: true,
      }
    );
    expect(formsFieldObject1.$errorMessages).toHaveLength(1);

    const formsFieldObject2 = formsField(
      generateFormWithOptionalParameter,
      2,
      yup.array().min(3).max(0),
      {
        abortEarly: false,
      }
    );
    expect(formsFieldObject2.$errorMessages).toHaveLength(2);

    const formsFieldObject3 = formsField(
      generateFormWithOptionalParameter,
      0,
      yup.array(),
      {
        abortEarly: false,
      }
    );
    expect(formsFieldObject3.$errorMessages).toHaveLength(0);
  });

  test("form.$key properties are unique", () => {
    const formsFieldObject = formsField(generateFormWithNoParameter, 5);
    expect(formsFieldObject.$forms.map((form) => form.$key)).toEqual([
      1, 2, 3, 4, 5,
    ]);

    formsFieldObject.$prepend();
    formsFieldObject.$append();
    formsFieldObject.$append();
    expect(formsFieldObject.$forms.map((form) => form.$key)).toEqual([
      6, 1, 2, 3, 4, 5, 7, 8,
    ]);
  });

  test("[reactivity] set $writableForms", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      3,
      yup.array().min(1)
    );

    expect(formsFieldObject.$forms.map((form) => form.$key)).toEqual([1, 2, 3]);

    await expect(
      testReactivity(() =>
        formsFieldObject.$forms.map((form) => form.$key)
      ).trigger(() => {
        formsFieldObject.$writableForms = formsFieldObject.$writableForms
          .slice()
          .reverse();
      })
    ).resolves.toEqual([3, 2, 1]);
  });

  test("parameter of $initialize()", async () => {
    const formsFieldObject = formsField(generateFormWithOptionalParameter);
    expect(formsFieldObject.$forms).toHaveLength(0);

    formsFieldObject.$initialize(["A", "B", "C"]);
    expect(formsFieldObject.$forms).toHaveLength(3);
    expect(formsFieldObject.$forms[0].text.$value).toBe("A");
    expect(formsFieldObject.$forms[1].text.$value).toBe("B");
    expect(formsFieldObject.$forms[2].text.$value).toBe("C");

    formsFieldObject.$initialize();
    expect(formsFieldObject.$forms).toHaveLength(0);

    formsFieldObject.$initialize(3);
    expect(formsFieldObject.$forms).toHaveLength(3);
    expect(formsFieldObject.$forms[0].text.$value).toBe("default");
    expect(formsFieldObject.$forms[1].text.$value).toBe("default");
    expect(formsFieldObject.$forms[2].text.$value).toBe("default");
  });
  test("parameter of $append()", async () => {
    const formsFieldObject = formsField(generateFormWithOptionalParameter);

    formsFieldObject.$append();
    expect(formsFieldObject.$forms[0].text.$value).toBe("default");

    formsFieldObject.$append("hello");
    expect(formsFieldObject.$forms[1].text.$value).toBe("hello");
  });
  test("parameter of $prepend()", async () => {
    const formsFieldObject = formsField(generateFormWithOptionalParameter);

    formsFieldObject.$prepend();
    expect(formsFieldObject.$forms[0].text.$value).toBe("default");

    formsFieldObject.$prepend("hello");
    expect(formsFieldObject.$forms[0].text.$value).toBe("hello");
  });
  test("parameter of $remove()", async () => {
    const formsFieldObject = formsField(generateFormWithOptionalParameter, 5);

    formsFieldObject.$remove(1);
    expect(formsFieldObject.$forms.map((form) => form.$key)).toEqual([
      1, 3, 4, 5,
    ]);

    formsFieldObject.$remove(-1);
    expect(formsFieldObject.$forms.map((form) => form.$key)).toEqual([1, 3, 4]);
  });

  test("[reactivity] $initialize() and FormField's $forms", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      0,
      yup.array().min(1)
    );

    expect(formsFieldObject.$forms).toHaveLength(0);

    await expect(
      testReactivity(() => formsFieldObject.$forms).trigger(() => {
        formsFieldObject.$initialize(1);
      })
    ).resolves.toHaveLength(1);
  });
  test("[reactivity] $append() and FormField's $forms", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      0,
      yup.array().min(1)
    );

    expect(formsFieldObject.$forms).toHaveLength(0);

    await expect(
      testReactivity(() => formsFieldObject.$forms).trigger(() => {
        formsFieldObject.$append();
      })
    ).resolves.toHaveLength(1);
  });
  test("[reactivity] $prepend() and FormField's $forms", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      0,
      yup.array().min(1)
    );

    expect(formsFieldObject.$forms).toHaveLength(0);

    await expect(
      testReactivity(() => formsFieldObject.$forms).trigger(() => {
        formsFieldObject.$prepend();
      })
    ).resolves.toHaveLength(1);
  });
  test("[reactivity] $remove(index) and FormField's $forms", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      2,
      yup.array().min(1)
    );

    expect(formsFieldObject.$forms).toHaveLength(2);

    await expect(
      testReactivity(() => formsFieldObject.$forms).trigger(() => {
        formsFieldObject.$remove(0);
      })
    ).resolves.toHaveLength(1);
  });

  test("[reactivity] $initialize() and FormField's $error", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      0,
      yup.array().min(1)
    );

    expect(formsFieldObject.$error).toBeInstanceOf(yup.ValidationError);

    await expect(
      testReactivity(() => formsFieldObject.$error).trigger(() => {
        formsFieldObject.$initialize(1);
      })
    ).resolves.toBeUndefined();
  });
  test("[reactivity] $append() and FormField's $error", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      0,
      yup.array().min(1)
    );

    expect(formsFieldObject.$error).toBeInstanceOf(yup.ValidationError);

    await expect(
      testReactivity(() => formsFieldObject.$error).trigger(() => {
        formsFieldObject.$append();
      })
    ).resolves.toBeUndefined();
  });
  test("[reactivity] $prepend() and FormField's $error", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      0,
      yup.array().min(1)
    );

    expect(formsFieldObject.$error).toBeInstanceOf(yup.ValidationError);

    await expect(
      testReactivity(() => formsFieldObject.$error).trigger(() => {
        formsFieldObject.$prepend();
      })
    ).resolves.toBeUndefined();
  });
  test("[reactivity] $remove(index) and FormField's $error", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      1,
      yup.array().min(1)
    );

    expect(formsFieldObject.$error).toBeUndefined();

    await expect(
      testReactivity(() => formsFieldObject.$error).trigger(() => {
        formsFieldObject.$remove(0);
      })
    ).resolves.toBeInstanceOf(yup.ValidationError);
  });

  test("[reactivity] $initialize() and FormField's $errorMessages", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      0,
      yup.array().min(1)
    );

    expect(formsFieldObject.$errorMessages).toHaveLength(1);

    await expect(
      testReactivity(() => formsFieldObject.$errorMessages).trigger(() => {
        formsFieldObject.$initialize(1);
      })
    ).resolves.toHaveLength(0);
  });
  test("[reactivity] $append() and FormField's $errorMessages", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      0,
      yup.array().min(1)
    );

    expect(formsFieldObject.$errorMessages).toHaveLength(1);

    await expect(
      testReactivity(() => formsFieldObject.$errorMessages).trigger(() => {
        formsFieldObject.$append();
      })
    ).resolves.toHaveLength(0);
  });
  test("[reactivity] $prepend() and FormField's $errorMessages", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      0,
      yup.array().min(1)
    );

    expect(formsFieldObject.$errorMessages).toHaveLength(1);

    await expect(
      testReactivity(() => formsFieldObject.$errorMessages).trigger(() => {
        formsFieldObject.$prepend();
      })
    ).resolves.toHaveLength(0);
  });
  test("[reactivity] $remove(index) and FormField's $errorMessages", async () => {
    const formsFieldObject = formsField(
      generateFormWithNoParameter,
      1,
      yup.array().min(1)
    );

    expect(formsFieldObject.$errorMessages).toHaveLength(0);

    await expect(
      testReactivity(() => formsFieldObject.$errorMessages).trigger(() => {
        formsFieldObject.$remove(0);
      })
    ).resolves.toHaveLength(1);
  });

  test("[reactivity] cross field validation", async () => {
    const fieldObject = field(false, yup.bool());
    const formsFieldObject = formsField(generateFormWithNoParameter, 0, () =>
      fieldObject.$value ? yup.array().min(1) : yup.array()
    );
    expect(formsFieldObject.$error).toBeUndefined();

    fieldObject.$value = true;
    expect(formsFieldObject.$error).toBeInstanceOf(yup.ValidationError);
  });
});
