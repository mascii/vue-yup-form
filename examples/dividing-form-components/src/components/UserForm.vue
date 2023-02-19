<script setup lang="ts">
import { FormPropType } from "vue-yup-form";
import { generateUserForm } from "../forms";

defineProps({
  userForm: {
    type: Object as FormPropType<typeof generateUserForm>,
    required: true,
  },
  caption: {
    type: String,
    default: "",
  },
  submitted: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <fieldset class="InputGroup">
    <legend># {{ caption }}</legend>
    <label :for="`name_${userForm.$key}`">{{ userForm.name.$label }}</label>
    <input
      :id="`name_${userForm.$key}`"
      :name="`name_${userForm.$key}`"
      v-model="$props.userForm.name.$value"
    />
    <span v-if="submitted && userForm.name.$error">{{
      userForm.name.$error.message
    }}</span>

    <label :for="`email_${userForm.$key}`">{{ userForm.email.$label }}</label>
    <input
      :id="`email_${userForm.$key}`"
      :name="`email_${userForm.$key}`"
      type="email"
      v-model="$props.userForm.email.$value"
    />
    <span v-if="submitted && userForm.email.$error">{{
      userForm.email.$error.message
    }}</span>
    <button type="button" @click="$emit('remove')">X</button>
  </fieldset>
</template>

<style>
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
