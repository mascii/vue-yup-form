import { defineForm, field, formsField } from "vue-yup-form";
import * as yup from "yup";

export const generateUserForm = () => {
  return defineForm({
    name: field("", yup.string().required().label("Name")),
    email: field("", yup.string().email().required().label("Email")),
  });
};

export const generateForm = () => {
  return defineForm({
    users: formsField(generateUserForm, 1),
  });
};
