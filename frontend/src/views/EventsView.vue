<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

import { getEvents } from '@/service/eventService'
import type { PikminEvent } from '@/types/PikminEvent'
import type { EventFilter } from '@/types/EventFilter'

import EventComponent from '@/components/EventComponent.vue'

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
  fetchCurrentEvents()
})
</script>

<template>
  <div class="event-list flex flex-col m-auto gap-2 w-96">
    <span class="text-xl font-bold">Current Events</span>
    <EventComponent v-for="event in events" :key="event.id" :pikminEvent="event" />
  </div>
</template>

<style scoped>
.event-list {
  padding: 1rem;
}
</style>
