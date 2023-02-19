<script setup lang="ts">
import { ref } from "vue";
import { isValidForm, toObject } from "vue-yup-form";

import { generateForm } from "./forms";
import UserForm from "./components/UserForm.vue";

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
    <h1>vue-yup-form Dividing form components</h1>

    <form @submit.prevent="onSubmit">
      <UserForm
        v-for="(userForm, i) in form.users.$forms"
        :key="userForm.$key"
        :user-form="userForm"
        :caption="`User ${i}`"
        :submitted="submitted"
        @remove="form.users.$remove(i)"
      />

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
</style>
