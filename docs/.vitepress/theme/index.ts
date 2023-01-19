import DefaultTheme from "vitepress/theme";

import "./styles/vars.css";

import CodeSandbox from "../../components/CodeSandbox.vue";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("CodeSandbox", CodeSandbox);
  },
};
