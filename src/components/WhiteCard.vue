<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  cardText: String,
  cardIndex: Number,
  selectedCards: Array
})

const card = computed(() => {
  return {
    text: props.cardText,
    index: props.cardIndex,
    selected: props.isSelected,
  }
})

const isSelected = computed(() => {
  if (props.selectedCards) {
    return (props.selectedCards.indexOf(props.cardText) !== -1)
  }
  return false
})
</script>

<template>
  <article @click="$emit('select-card', card)"
    class="flex flex-col justify-between rounded-md border-2 border-solid min-w-[250px] h-80 p-4 bg-white transition-transform border-black"
    :class="{'scale-90':isSelected}">
    <p class="text-2xl font-bold">
      {{ cardText  }}
    </p>
    <footer class="flex justify-between items-center">
      <p class="font-bold">#{{ cardIndex + 1 }}</p>
      <p class="text-xs">Cards Against Vue</p>
    </footer>
  </article>
</template>