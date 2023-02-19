<script setup lang="ts">
import { defineForm, field, isValidForm, toObject } from "vue-yup-form";
import * as yup from "yup";
import { ref, computed } from "vue";

import ErrorMessage from "./components/ErrorMessage.vue";

const generateForm = () => {
  const fullName = field("", yup.string().required().label("Full Name"));
  const email = field(
    "",
    yup.string().required().email().label("Email Address")
  );

  const password = field("", yup.string().min(8).required());
  const confirmPass = field("", () =>
    yup.string().required().oneOf([password.$value], "Passwords must match")
  );

  const favoriteDrink = field(
    "",
    yup.string().required().oneOf(["coffee", "tea", "soda"], "Choose a drink")
  );

  return defineForm({
    fullName,
    email,
    password,
    confirmPass,
    favoriteDrink,

    useFormSteps() {
      const steps = [
        {
          fullName,
          email,
        },
        {
          password,
          confirmPass,
        },
        {
          favoriteDrink,
        },
      ] as const;

      const currentStepIdx = ref(0);
      const hasPrevious = computed(() => {
        return currentStepIdx.value > 0;
      });
      const isLastStep = computed(
        () => currentStepIdx.value === steps.length - 1
      );
      const getCurrentStep = () => steps[currentStepIdx.value];

      return {
        steps,
        currentStepIdx,
        hasPrevious,
        isLastStep,
        getCurrentStep,
      };
    },
  });
};

const form = generateForm();
const { steps, currentStepIdx, hasPrevious, isLastStep, getCurrentStep } =
  form.useFormSteps();
const submitted = ref(false);

const onSubmit = () => {
  submitted.value = true;

  if (!isValidForm(getCurrentStep())) {
    return;
  }

  if (!isLastStep.value) {
    submitted.value = false;
    currentStepIdx.value++;
    return;
  }

  console.log("Done: ", JSON.stringify(toObject(form), null, 2));
};

const goToPrev = () => {
  if (!hasPrevious.value) {
    return;
  }

  submitted.value = false;
  currentStepIdx.value--;
};

const values = computed(() => toObject(form));
</script>

<template>
  <div>
    <h1>vue-yup-form Multi-step form wizard</h1>

    <form @submit.prevent="onSubmit">
      <template v-if="currentStepIdx === 0">
        <input
          name="name"
          v-model.trim="steps[0].fullName.$value"
          placeholder="Type your Full name"
        />
        <ErrorMessage v-if="submitted" :error="steps[0].fullName.$error" />

        <input
          name="email"
          type="email"
          v-model.trim="steps[0].email.$value"
          placeholder="Type your email"
        />
        <ErrorMessage v-if="submitted" :error="steps[0].email.$error" />
      </template>

      <template v-if="currentStepIdx === 1">
        <input
          name="password"
          type="password"
          v-model.trim="steps[1].password.$value"
          placeholder="Type a strong one"
        />
        <ErrorMessage v-if="submitted" :error="steps[1].password.$error" />

        <input
          name="confirmPass"
          type="password"
          v-model.trim="steps[1].confirmPass.$value"
          placeholder="Confirm your password"
        />
        <ErrorMessage v-if="submitted" :error="steps[1].confirmPass.$error" />
      </template>

      <template v-if="currentStepIdx === 2">
        <select v-model="steps[2].favoriteDrink.$value">
          <option value="">Select a drink</option>
          <option value="coffee">Coffee</option>
          <option value="tea">Tea</option>
          <option value="soda">Soda</option>
        </select>
        <ErrorMessage v-if="submitted" :error="steps[2].favoriteDrink.$error" />
      </template>

      <div>
        <button v-if="hasPrevious" type="button" @click="goToPrev">
          Previous
        </button>

        <button type="submit">{{ isLastStep ? "Submit" : "Next" }}</button>
      </div>

      <pre>{{ values }}</pre>
    </form>
  </div>
</template>

<style>
input,
select {
  margin: 10px 0;
  display: block;
}
</style>
