<script setup lang="ts">
import { ref } from "vue";

import { defineForm, field, isValidForm, toObject } from "vue-yup-form";
import * as yup from "yup";

const generateForm = () => {
  const password = field("", yup.string().label("Password").min(5).required());
  const passwordConfirmation = field("", () =>
    yup
      .string()
      .label("Confirm Password")
      .required()
      .oneOf([password.$value], ({ label }) => `${label} does not match`)
  );

  return defineForm({
    password,
    passwordConfirmation,
  });
};

const form = generateForm();
const submitted = ref(false);
const onSubmit = () => {
  submitted.value = true;
  if (!isValidForm(form)) {
    return;
  }
  alert(JSON.stringify(toObject(form), null, 2));
};
</script>

<template>
  <div>
    <h1>vue-yup-form Cross-Field Validation</h1>

    <form @submit.prevent="onSubmit">
      <div>
        <label for="password">{{ form.password.$label }}</label>
        <input
          id="password"
          name="password"
          type="password"
          v-model="form.password.$value"
        />
        <span v-if="submitted && form.password.$error">{{
          form.password.$error.message
        }}</span>
      </div>

      <div>
        <label for="passwordConfirmation">{{
          form.passwordConfirmation.$label
        }}</label>
        <input
          id="passwordConfirmation"
          name="passwordConfirmation"
          type="password"
          v-model="form.passwordConfirmation.$value"
        />
        <span v-if="submitted && form.passwordConfirmation.$error">{{
          form.passwordConfirmation.$error.message
        }}</span>
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  max-width: 500px;
}

input {
  display: block;
}

span {
  display: block;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-top: 20px;
}

button {
  display: block;
}

form {
  padding: 20px;
  border: 1px solid black;
}

form + form {
  margin-top: 20px;
}
</style>
