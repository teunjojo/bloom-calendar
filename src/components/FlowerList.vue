<script setup lang="ts">
import type { Flower } from '@/types/Flower'
import FlowerItem from '@/components/FlowerItem.vue'

const props = defineProps<{
  flowers: Flower[]
  name: string
}>()
</script>

<template>
  <div class="rounded-xl flex flex-col items-center gap-1 bg-sky-100 p-2">
    <span class="font-bold px-3 rounded-full border border-2 border-sky-500 text-sky-600 mb-2">{{
      props.name
    }}</span>
    <div class="text-sky-900 flex justify-center flex-wrap gap-2 mt-2">
      <FlowerItem v-for="flower in props.flowers" :key="flower.id" :flower="flower" />
    </div>
  </div>
</template>

<style scoped>
</style>
