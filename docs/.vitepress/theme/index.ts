import DefaultTheme from "vitepress/theme";

import CodeSandbox from "../../components/CodeSandbox.vue";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("CodeSandbox", CodeSandbox);
  },
};
