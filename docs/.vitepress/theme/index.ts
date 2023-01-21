import DefaultTheme from "vitepress/theme";

import * as yup from "yup";
import { version as yupVersion } from "yup/package.json";
import * as vueYupForm from "../../../src/index";
import { version as vueYupFormVersion } from "../../../package.json";

import "./styles/vars.css";

import CodeSandbox from "../../components/CodeSandbox.vue";

Object.assign(globalThis, { yup }, vueYupForm);

console.info(
  "%cFeel free to try sample codes here",
  "background: #222; color: #EE6A55"
);
console.info(`yup version: ${yupVersion}`);
console.info(`vue-yup-form version: ${vueYupFormVersion}`);

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    DefaultTheme.enhanceApp.apply(this, arguments);
    app.component("CodeSandbox", CodeSandbox);
  },
};
