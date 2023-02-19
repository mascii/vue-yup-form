<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";

import { defineForm, field, isValidForm, toObject } from "vue-yup-form";
import * as yup from "yup";

const generateForm = () => {
  return defineForm({
    firstName: field("", yup.string().required()),
    lastName: field("", yup.string().required()),
    employed: field(false),
    favoriteColor: field<string | null>(null),
    toppings: field<string[]>([]),
    sauces: field<string[]>([]),
    stooge: field<string>("larry"),
    notes: field(""),
  });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// To use reset button, wrap with shallowRef()
const form = shallowRef(generateForm());

const submitted = ref(false);
const submitting = ref(false);

const onSubmit = async () => {
  submitted.value = true;
  submitting.value = true;

  try {
    if (!isValidForm(form.value)) {
      alert("Please check your entries.");
      window.scrollTo(0, 0);
      return;
    }

    await sleep(300);
    alert(JSON.stringify(toObject(form.value), null, 2));
  } finally {
    submitting.value = false;
  }
};
const onReset = () => {
  form.value = generateForm();
};

const values = computed(() => toObject(form.value));
</script>

<template>
  <div id="root">
    <h1>vue-yup-form - Simple Example</h1>

    <form @submit.prevent="onSubmit">
      <div>
        <label>First Name *</label>
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          v-model.trim="form.firstName.$value"
        />
        <span v-if="submitted && form.firstName.$error">{{
          form.firstName.$error.message
        }}</span>
      </div>
      <div>
        <label>Last Name *</label>
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          v-model.trim="form.lastName.$value"
        />
        <span v-if="submitted && form.lastName.$error">{{
          form.lastName.$error.message
        }}</span>
      </div>
      <div>
        <label>Employed</label>
        <input name="employed" type="checkbox" v-model="form.employed.$value" />
      </div>
      <div>
        <label>Favorite Color</label>
        <select name="favoriteColor" v-model="form.favoriteColor.$value">
          <option :value="null"></option>
          <option value="#ff0000">❤️ Red</option>
          <option value="#00ff00">💚 Green</option>
          <option value="#0000ff">💙 Blue</option>
        </select>
      </div>
      <div>
        <label>Toppings</label>
        <select multiple name="toppings" v-model="form.toppings.$value">
          <option value="chicken">🐓 Chicken</option>
          <option value="ham">🐷 Ham</option>
          <option value="mushrooms">🍄 Mushrooms</option>
          <option value="cheese">🧀 Cheese</option>
          <option value="tuna">🐟 Tuna</option>
          <option value="pineapple">🍍 Pineapple</option>
        </select>
      </div>
      <div>
        <label>Sauces</label>
        <div>
          <label>
            <input
              name="sauces"
              type="checkbox"
              value="ketchup"
              v-model="form.sauces.$value"
            />
            Ketchup
          </label>
          <label>
            <input
              name="sauces"
              type="checkbox"
              value="mustard"
              v-model="form.sauces.$value"
            />
            Mustard
          </label>
          <label>
            <input
              name="sauces"
              type="checkbox"
              value="mayonnaise"
              v-model="form.sauces.$value"
            />
            Mayonnaise
          </label>
          <label>
            <input
              name="sauces"
              type="checkbox"
              value="guacamole"
              v-model="form.sauces.$value"
            />
            Guacamole 🥑
          </label>
        </div>
      </div>
      <div>
        <label>Best Stooge</label>
        <div>
          <label>
            <input
              name="stooge"
              type="radio"
              value="larry"
              v-model="form.stooge.$value"
            />
            Larry
          </label>
          <label>
            <input
              name="stooge"
              type="radio"
              value="moe"
              v-model="form.stooge.$value"
            />
            Moe
          </label>
          <label>
            <input
              name="stooge"
              type="radio"
              value="curly"
              v-model="form.stooge.$value"
            />
            Curly
          </label>
        </div>
      </div>
      <div>
        <label>Notes</label>
        <textarea
          name="notes"
          placeholder="Notes"
          v-model.trim="form.notes.$value"
        />
      </div>
      <div class="buttons">
        <button type="submit" :disabled="submitting">Submit</button>
        <button type="button" @click="onReset" :disabled="submitting">
          Reset
        </button>
      </div>
      <pre>{{ values }}</pre>
    </form>
  </div>
</template>

<style lang="scss">
div#root {
  font-family: sans-serif;

  h1 {
    text-align: center;
    color: #222;
  }

  a {
    display: block;
    text-align: center;
    color: #222;
  }

  form {
    max-width: 500px;
    margin: 10px auto;
    border: 1px solid #ccc;
    padding: 20px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    border-radius: 3px;

    & > div {
      display: flex;
      flex-flow: row nowrap;
      line-height: 2em;
      margin: 5px;
      & > label {
        color: #333;
        width: 110px;
        font-size: 1em;
        line-height: 32px;
      }
      & > input,
      & > select,
      & > textarea {
        flex: 1;
        padding: 3px 5px;
        font-size: 1em;
        margin-left: 15px;
        border: 1px solid #ccc;
        border-radius: 3px;
      }
      & > input[type="checkbox"] {
        margin-top: 7px;
      }
      & > div {
        margin-left: 16px;
        & > label {
          display: block;
          & > input {
            margin-right: 3px;
          }
        }
      }
    }
    & > .buttons {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      margin-top: 15px;
    }
    pre {
      border: 1px solid #ccc;
      background: rgba(0, 0, 0, 0.1);
      box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.2);
      padding: 20px;
    }
  }
}
</style>
