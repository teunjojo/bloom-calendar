<script setup lang="ts">
import type { Flower } from '@/types/Flower'
import FlowerItem from '@/components/FlowerItem.vue'

const props = defineProps<{
  flowers: Flower[]
  name: string
}>()
</script>

<template>
  <div class="flower-list-container">
    <span class="text-lg font-bold">{{ props.name }}</span>
    <div class="flower-list flex justify-center flex-wrap gap-2 mt-2">
      <FlowerItem v-for="flower in props.flowers" :key="flower.id" :flower="flower" />
    </div>
  </div>
</template>

<style scoped>
.flower-list-container {
  border-radius: 1rem;
  padding: 1rem;
}

.flower-list {
  background-color: #f7f7f7;
  color: black;
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>
