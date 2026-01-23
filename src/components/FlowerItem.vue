<script setup lang="ts">
import type { Flower } from '@/types/Flower'
import { ref } from 'vue'

const R2_BASE_URL = import.meta.env.VITE_R2_BASE_URL

const props = defineProps<{
  flower: Flower
}>()

const imageError = ref<boolean>(false)
</script>

<template>
  <div class="flex flex-col items-center">
    <img
      style="height: 5rem"
      :src="`${R2_BASE_URL}/images/flowers/${props.flower.slug}.png`"
      @error="imageError = true"
      v-if="!imageError"
    />
    <img
      v-if="imageError"
      style="height: 5rem; width: 5rem; object-fit: contain; padding: 1rem; box-sizing: border-box"
      class="bg-gray-300 rounded rounded-full"
      src="/images/icons/unknown.png"
    />
    <span class="text-md font-bold bg-white rounded-full px-1 shadow">{{ props.flower.name }}</span>
  </div>
</template>

<style scoped></style>
