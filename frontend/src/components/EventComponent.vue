<script setup lang="ts">
import type { PikminEvent } from '@/types/PikminEvent'

const props = defineProps<{
  pikminEvent: PikminEvent
}>()

function formatDate(date: Date) {
  return date
    .toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', '')
}
</script>

<template>
  <div class="event-container">
    <span class="flex items-center gap-2 mb-2">
      <img class="w-10 special-icon" src="/images/icons/special.png" />
      <h2 class="text-xl font-bold">{{ props.pikminEvent.name }}</h2>
    </span>
    <div class="text-sm">Until {{ formatDate(new Date(props.pikminEvent.endDate)) }}</div>
    <!-- <FlowerList
      v-if="props.pikminEvent.bigFlowers.length > 0"
      :flowers="props.pikminEvent.bigFlowers"
      :name="'Big Flower Forecast'"
    /> -->
  </div>
</template>

<style scoped>
.event-container {
  padding: 1rem;
  border-radius: 1rem;
  background-color: var(--primary-color);
  color: white;
}

.big-flower-forecast {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: white;
  color: var(--primary-color);
}

.special-icon {
  filter: invert(1);
}
</style>
