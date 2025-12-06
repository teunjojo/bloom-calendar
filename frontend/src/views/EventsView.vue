<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

import { getEvents } from '@/service/eventService'
import type { PikminEvent } from '@/types/PikminEvent'
import type { EventFilter } from '@/types/EventFilter'

const events: Ref<PikminEvent[]> = ref<PikminEvent[]>([])

async function fetchCurrentEvents() {
  const filters: EventFilter = {
    currentDate: new Date(),
    sortBy: 'endDate',
    sortOrder: 'ASC',
  }
  events.value = await getEvents(filters)
}

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

onMounted(() => {
  fetchCurrentEvents().then(() => console.log(events.value))
})
</script>

<template>
  <div class="flex flex-col event-list gap-2 w-96">
    <span class="text-xl font-bold">Current Events</span>
    <div v-for="event in events" :key="event.id" class="event-container">
      <h2 class="text-xl font-bold">{{ event.name }}</h2>
      <div class="text-sm">Until {{ formatDate(new Date(event.endDate)) }}</div>
    </div>
  </div>
</template>

<style scoped>
.event-list {
  padding: 1rem;
}

.event-container {
  padding: 1rem;
  border-radius: 1rem;
  background-color: var(--primary-color);
  color: white;
}
</style>
