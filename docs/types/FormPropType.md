# FormPropType
This type is useful for dividing form components.
This type is used with functions that return a form.

```vue
<template>
  <div>
    Name: <input type="text" v-model="$props.userForm.name.$value" />
    Email: <input type="email" v-model="$props.userForm.email.$value" />
  </div>
  <div>
    <a :href="`mailto:${userForm.email.$value}`">{{ userForm.name.$value }}</a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { FormPropType } from "vue-yup-form";

import type { generateUserForm } from "../forms";
// const generateUserForm = () => {
//   return defineForm({
//     name: field("", yup.string().required().label("Name")),
//     email: field("", yup.string().email().required().label("Email"))
//   });
// };

export default defineComponent({
  name: "UserForm",
  props: {
    userForm: {
      type: Object as FormPropType<typeof generateUserForm>,
      required: true,
    },
  },
});
</script>
```

::: tip
If you want to use `<script setup lang="ts">` and define props with pure types via a generic type argument, use `ReturnType` as follows:

```vue
<script setup lang="ts">
defineProps<{
  userForm: ReturnType<typeof generateUserForm> & { $key: number };
}>();
</script>
```
:::

::: warning
Note that components using this type are in violation of [`vue/no-mutating-props`](https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/no-mutating-props.md).
To avoid `vue/no-mutating-props`, prepend `$props.` in `v-model`.

```vue
<template>
  <input type="text" v-model="$props.userForm.name.$value" />
</template>
```
:::
