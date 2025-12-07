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
    <span class="flex items-center justify-between gap-2 mb-2">
      <img class="w-10 special-icon" src="/images/icons/special.png" />
      <h2 class="text-xl font-bold flex-grow">{{ props.pikminEvent.name }}</h2>
      <a
        class="blog-link aspect-square flex items-center justify-center"
        v-if="props.pikminEvent.blogLink"
        :href="props.pikminEvent.blogLink"
        target="_blank"
        rel="noopener noreferrer"
        ><span class="material-symbols-outlined"> arrow_forward_ios </span></a
      >
    </span>
    <div class="text-sm">Until {{ formatDate(new Date(props.pikminEvent.endDate)) }}</div>
    <img
      class="event-image mt-2 rounded-lg"
      v-if="props.pikminEvent.imageUrl"
      :src="props.pikminEvent.imageUrl"
      alt="Event image"
    />
  </div>
</template>

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=arrow_forward_ios';

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

.blog-link {
  color: white;
  border: 2px solid white;
  border-radius: 100vw;
  min-width: 2.5rem;
  font-size: 1rem;
}
</style>
