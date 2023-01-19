import { defineConfig } from "vitepress";

export default defineConfig({
  title: "vue-yup-form",
  description: "Headless form validation with Vue and Yup",
  themeConfig: {
    logo: "/logo.svg",
    sidebar: sidebarGuide(),
    socialLinks: [
      { icon: "github", link: "https://github.com/mascii/vue-yup-form" },
    ],
  },
  head: [
    ["link", { rel: "icon", href: "/favicon-32x32.png", type: "image/png" }],
    ["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
  ]
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
