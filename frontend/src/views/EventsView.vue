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

onMounted(() => {
  fetchCurrentEvents().then(() => console.log(events.value))
})
</script>

<template>
  <div class="flex flex-col event-list gap-2">
    <span class="text-xl font-bold">Current Events</span>
    <div v-for="event in events" :key="event.id" class="event-container">
      <h2 class="text-xl">{{ event.name }}</h2>
    </div>
  </div>
</template>

<style scoped>
.event-list {
  padding: 1rem;
}

.event-container {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}
</style>
