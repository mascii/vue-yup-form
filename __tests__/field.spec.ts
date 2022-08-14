import { ref } from "vue-demi";
import { testReactivity } from "./testReactivity";

import { field } from "../src/index";
import * as yup from "yup";

describe("field", () => {
  test("no schema was given", () => {
    const fieldObject = field("");
    expect(fieldObject.$error).toBeUndefined();
  });

  test("given empty string when string $value is required", () => {
    const fieldObject = field("", yup.string().required());
    expect(fieldObject.$error).toBeInstanceOf(yup.ValidationError);
  });

  test("accept a Ref object other than shallowRef()", () => {
    const fieldObject = field(
      ref({ x: 0, y: 0, z: 0 }),
      yup.object().shape({
        x: yup.number().required().integer(),
        y: yup.number().required().integer(),
        z: yup.number().required().integer(),
      })
    );
    expect(fieldObject.$error).toBeUndefined();

    fieldObject.$value.x = 0.5;
    expect(fieldObject.$error).toBeInstanceOf(yup.ValidationError);
  });

  test("abortEarly and $errorMessages", () => {
    const fieldObject1 = field("", yup.string().required().min(1), {
      abortEarly: true,
    });
    expect(fieldObject1.$errorMessages).toHaveLength(1);

    const fieldObject2 = field("", yup.string().required().min(1), {
      abortEarly: false,
    });
    expect(fieldObject2.$errorMessages).toHaveLength(2);

    const fieldObject3 = field("", yup.string(), {
      abortEarly: false,
    });
    expect(fieldObject3.$errorMessages).toHaveLength(0);
  });

  test("set empty string when number $value is required", () => {
    const REQUIRED_MESSAGE = "Must be a number!";

    const fieldObject = field<number | null>(
      0,
      yup.number().required(REQUIRED_MESSAGE)
    );
    expect(fieldObject.$error).toBeUndefined();

    fieldObject.$value = null;
    expect(fieldObject.$error).toBeInstanceOf(yup.ValidationError);
    expect(fieldObject.$error?.message).toBe(REQUIRED_MESSAGE);

    // Changing `<input type="number" v-model.number="foo" />` to blank, `foo` is set to empty string.
    fieldObject.$value = "" as any;
    expect(fieldObject.$error).toBeInstanceOf(yup.ValidationError);
    expect(fieldObject.$error?.message).toBe(REQUIRED_MESSAGE);
  });

  test("string array field", () => {
    const fieldObject = field<string[]>([], yup.array().min(1));
    expect(fieldObject.$error).toBeInstanceOf(yup.ValidationError);

    fieldObject.$value = ["apple"];
    expect(fieldObject.$error).toBeUndefined();
  });

  test("$label", () => {
    const fieldObject1 = field("", yup.string().label("First Name"));
    expect(fieldObject1.$label).toBe("First Name");

    const fieldObject2 = field("", yup.string());
    expect(fieldObject2.$label).toBe("");
  });

  test("[reactivity] set $value", async () => {
    const fieldObject = field("foo", yup.string().required());

    await expect(
      testReactivity(() => fieldObject.$value).trigger(() => {
        fieldObject.$value = "bar";
      })
    ).resolves.toBe("bar");
  });

  test("[reactivity] set $value and Field's $error", async () => {
    const fieldObject = field("", yup.string().required());

    expect(fieldObject.$error).toBeInstanceOf(yup.ValidationError);

    await expect(
      testReactivity(() => fieldObject.$error).trigger(() => {
        fieldObject.$value = "foo";
      })
    ).resolves.toBeUndefined();
  });

  test("[reactivity] set $value and Field's $errorMessages", async () => {
    const fieldObject = field("", yup.string().required());

    expect(fieldObject.$errorMessages).toHaveLength(1);

    await expect(
      testReactivity(() => fieldObject.$errorMessages).trigger(() => {
        fieldObject.$value = "foo";
      })
    ).resolves.toHaveLength(0);
  });

  test("[reactivity] cross field validation", async () => {
    const fieldObject1 = field(false, yup.bool());
    const fieldObject2 = field("", () =>
      fieldObject1.$value ? yup.string().required() : yup.string()
    );

    expect(fieldObject2.$error).toBeUndefined();

    await expect(
      testReactivity(() => fieldObject2.$error).trigger(() => {
        fieldObject1.$value = true;
      })
    ).resolves.toBeInstanceOf(yup.ValidationError);
  });
});
