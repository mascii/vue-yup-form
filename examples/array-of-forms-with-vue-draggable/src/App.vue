<script setup lang="ts">
import { ref } from "vue";

import Draggable from "vuedraggable";

import {
  defineForm,
  field,
  formsField,
  isValidForm,
  toObject,
} from "vue-yup-form";
import * as yup from "yup";

const generateUserForm = ({ initialName = "", initialEmail = "" } = {}) => {
  return defineForm({
    name: field(initialName, yup.string().required().label("Name")),
    email: field(initialEmail, yup.string().email().required().label("Email")),
  });
};

const form = defineForm({
  users: formsField(generateUserForm, [
    { initialName: "Alice", initialEmail: "alice@example.com" },
    { initialName: "Bob", initialEmail: "bob@example.com" },
  ]),
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
    <h1>vue-yup-form Array of forms with Vue.Draggable</h1>

    <form @submit.prevent="onSubmit">
      <Draggable
        v-model="form.users.$writableForms"
        :animation="200"
        item-key="$key"
      >
        <template #item="{ element, index }">
          <fieldset class="InputGroup">
            <legend>User #{{ index }}</legend>
            <label :for="`name_${element.$key}`">{{
              element.name.$label
            }}</label>
            <input
              :id="`name_${element.$key}`"
              :name="`name_${element.$key}`"
              v-model="element.name.$value"
            />
            <span v-if="submitted && element.name.$error">{{
              element.name.$error.message
            }}</span>

            <label :for="`email_${element.$key}`">{{
              element.email.$label
            }}</label>
            <input
              :id="`email_${element.$key}`"
              :name="`email_${element.$key}`"
              type="email"
              v-model="element.email.$value"
            />
            <span v-if="submitted && element.email.$error">{{
              element.email.$error.message
            }}</span>
            <button type="button" @click="form.users.$remove(index)">X</button>
          </fieldset>
        </template>
      </Draggable>

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
  background: white;
}

.InputGroup button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
