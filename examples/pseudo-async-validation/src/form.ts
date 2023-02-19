import { ref } from "vue";

import { defineForm, field, isValidForm } from "vue-yup-form";
import * as yup from "yup";

const validateEmail = async (email: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return email !== "alice@example.com" && email !== "bob@example.com";
};

export const generateForm = () => {
  const invalidEmail = ref<string | null>(null);

  return defineForm({
    firstName: field("", yup.string().required().label("First name")),
    lastName: field("", yup.string().required().label("Last name")),
    email: field("", () =>
      yup
        .string()
        .required()
        .email()
        .notOneOf(
          [invalidEmail.value],
          "This email address is already registered."
        )
        .label("E-mail")
    ),

    async asyncValidate(): Promise<boolean> {
      if (!isValidForm(this)) {
        return false;
      }

      const email = this.email.$value;
      const isValidEmail = await validateEmail(email);
      invalidEmail.value = !isValidEmail ? email : "";

      return isValidEmail;
    },
  });
};
