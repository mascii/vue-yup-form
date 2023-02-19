<script setup lang="ts">
import { ref } from "vue";

import {
  defineForm,
  field,
  formsField,
  isValidForm,
  toObject,
} from "vue-yup-form";
import * as yup from "yup";

const generateUserForm = () => {
  return defineForm({
    name: field("", yup.string().required().label("Name")),
    email: field("", yup.string().email().required().label("Email")),
  });
};

const form = defineForm({
  users: formsField(generateUserForm, 1),
});
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
    <h1>vue-yup-form Array of forms</h1>

    <form @submit.prevent="onSubmit">
      <fieldset
        class="InputGroup"
        v-for="(userForm, i) in form.users.$forms"
        :key="userForm.$key"
      >
        <legend>User #{{ i }}</legend>
        <label :for="`name_${userForm.$key}`">{{ userForm.name.$label }}</label>
        <input
          :id="`name_${userForm.$key}`"
          :name="`name_${userForm.$key}`"
          v-model="userForm.name.$value"
        />
        <span v-if="submitted && userForm.name.$error">{{
          userForm.name.$error.message
        }}</span>

        <label :for="`email_${userForm.$key}`">{{
          userForm.email.$label
        }}</label>
        <input
          :id="`email_${userForm.$key}`"
          :name="`email_${userForm.$key}`"
          type="email"
          v-model="userForm.email.$value"
        />
        <span v-if="submitted && userForm.email.$error">{{
          userForm.email.$error.message
        }}</span>
        <button type="button" @click="form.users.$remove(i)">X</button>
      </fieldset>

      <button type="button" @click="form.users.$append()">Add User +</button>

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

button[type="submit"] {
  margin-top: 10px;
}

form {
  padding: 20px;
  border: 1px solid black;
}

.InputGroup {
  padding: 10px;
  border: 2px dotted black;
  margin-bottom: 30px;
  position: relative;
}

.InputGroup button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
