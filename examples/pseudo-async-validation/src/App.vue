<script setup lang="ts">
import { ref } from "vue";
import { generateForm } from "./form";

const form = generateForm();
const submitted = ref(false);

const onSubmit = async () => {
  submitted.value = true;
  const isValid = await form.asyncValidate();

  if (!isValid) {
    alert("NG");
    return;
  }

  alert("OK");
};
</script>

<template>
  <div>
    <h1>vue-yup-form Pseudo async validation</h1>
    <p>
      This form requests the server to confirm that the email address is not
      registered.<br />
      In this example, <strong>alice@example.com</strong> and
      <strong>bob@example.com</strong> are already registered
    </p>

    <form @submit.prevent="onSubmit">
      <div>
        <label for="firstName">{{ form.firstName.$label }}</label>
        <input
          id="firstName"
          name="firstName"
          v-model="form.firstName.$value"
        />
        <span v-if="submitted && form.firstName.$error">{{
          form.firstName.$error.message
        }}</span>
      </div>

      <div>
        <label for="lastName">{{ form.lastName.$label }}</label>
        <input id="lastName" name="lastName" v-model="form.lastName.$value" />
        <span v-if="submitted && form.lastName.$error">{{
          form.lastName.$error.message
        }}</span>
      </div>

      <div>
        <label for="email">{{ form.email.$label }}</label>
        <input
          id="email"
          name="email"
          type="email"
          v-model="form.email.$value"
        />
        <span v-if="submitted && form.email.$error">{{
          form.email.$error.message
        }}</span>
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style>
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
</style>
