import { defineConfig } from "vitepress";

import { version } from "../../package.json";

export default defineConfig({
  title: "vue-yup-form",
  description: "Headless form validation with Vue and Yup",
  themeConfig: {
    logo: "/logo.svg",
    sidebar: sidebarGuide(),
    search: { provider: "local" },
    nav: [
      {
        text: `v${version}`,
        items: [
          {
            text: "Release Notes",
            link: "https://github.com/mascii/vue-yup-form/releases",
          },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/mascii/vue-yup-form" },
    ],
    editLink: {
      pattern: "https://github.com/mascii/vue-yup-form/tree/main/docs/:path",
      text: "Suggest changes to this page",
    },
  },
  head: [
    ["link", { rel: "icon", href: "/favicon-32x32.png", type: "image/png" }],
    ["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
    ["meta", { name: "author", content: "mascii" }],
    ["meta", { property: "og:title", content: "vue-yup-form" }],
    [
      "meta",
      {
        property: "og:image",
        content: "https://vue-yup-form.pages.dev/og.png",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content: "Headless form validation with Vue and Yup",
      },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:creator", content: "@mascii_k" }],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://vue-yup-form.pages.dev/og.png",
      },
    ],
  ],
});

function sidebarGuide() {
  return [
    {
      text: "Guide",
      collapsible: true,
      items: [{ text: "Getting Started", link: "/guide/getting-started" }],
    },
    {
      text: "Examples",
      collapsible: true,
      items: [
        { text: "Simple Example", link: "/examples/simple-example" },
        {
          text: "Checkbox and Radio Inputs",
          link: "/examples/checkboxes-and-radio",
        },
        {
          text: "Cross-Field Validation",
          link: "/examples/cross-field-validation",
        },
        { text: "Array of forms", link: "/examples/array-of-forms" },
        {
          text: "Array of forms with Vue.Draggable",
          link: "/examples/array-of-forms-with-vue-draggable",
        },
        {
          text: "Dividing form components",
          link: "/examples/dividing-form-components",
        },
        {
          text: "Multi-step form wizard",
          link: "/examples/multi-step-form-wizard",
        },
        {
          text: "Pseudo async validation",
          link: "/examples/pseudo-async-validation",
        },
      ],
    },
    {
      text: "APIs",
      collapsible: true,
      items: [
        { text: "defineForm()", link: "/api/defineForm" },
        { text: "field()", link: "/api/field" },
        { text: "privateField()", link: "/api/privateField" },
        { text: "formsField()", link: "/api/formsField" },
        { text: "isValidForm()", link: "/api/isValidForm" },
        { text: "toObject()", link: "/api/toObject" },
      ],
    },
    {
      text: "Types",
      collapsible: true,
      items: [
        { text: "yup.ValidationError", link: "/types/YupValidationError" },
        { text: "FormPropType", link: "/types/FormPropType" },
      ],
    },
  ];
}
