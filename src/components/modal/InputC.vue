<!-- InputC.vue -->
<template>
    <input
      class="form-control mb-2"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </template>
  
  <script>
  export default {
    props: {
      modelValue: String, // ini penting buat v-model
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: ''
      }
    }
  }
  </script>
  