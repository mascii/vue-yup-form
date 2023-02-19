<script setup lang="ts">
import { computed, ref } from "vue";

import { defineForm, field, isValidForm, toObject } from "vue-yup-form";
import * as yup from "yup";

const generateForm = () => {
  return defineForm({
    drink: field<string[]>([], yup.array().min(1, "You must choose a drink")),
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

const values = computed(() => toObject(form));
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <input
        name="drink"
        type="checkbox"
        v-model="form.drink.$value"
        value="Water"
      />
      Water
      <input
        name="drink"
        type="checkbox"
        v-model="form.drink.$value"
        value="Tea"
      />
      Tea
      <input
        name="drink"
        type="checkbox"
        v-model="form.drink.$value"
        value="Coffee"
      />
      Coffee

      <span v-if="submitted && form.drink.$error">{{
        form.drink.$error.message
      }}</span>

      <p>Values:</p>
      <pre>{{ values }}</pre>

      <button>Submit</button>
    </form>
  </div>
</template>

<style>
span {
  display: block;
  margin: 10px 0;
}
</style>
