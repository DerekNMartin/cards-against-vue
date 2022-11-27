<template>
  <div class="flex rounded-md border-2 border-solid w-[250px] h-[350px] p-4 bg-gray-900 transition-transform text-white flex-col justify-between">
    <p class="text-2xl font-bold">{{ cardText }}</p>
    <footer>
      <p class="card__footer">Cards Against Vue</p>
    </footer>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  cardText: String
})
</script>