<script setup lang="ts">
import type { Flower } from '@/types/Flower'

const props = defineProps<{
  flowers: Flower[],
  name: string,
}>()
</script>

<template>
  <div class="big-flower-forecast">
    <span class="text-md font-bold">{{ props.name }}</span>
    <div class="flower-list flex justify-center flex-wrap gap-2 mt-2">
      <div
        v-for="flower in props.flowers"
        :key="flower.id"
        class="flower-container flex flex-col items-center"
      >
        <img class="w-20" :src="`/images/flowers/${flower.slug}.png`" />
        <span class="text-md">{{ flower.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
