<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { getEvents } from '@/service/eventService'
import { PikminEvent } from '@/models/PikminEvent'

const events = ref<PikminEvent[]>([])

async function fetchEvents() {
  const filters = {}
  events.value = await getEvents(filters)
}

onMounted(() => {
  fetchEvents().then(() => console.log(events.value))
})
</script>

<template>
  <h1>Events View</h1>
  <ul>
    <li v-for="event in events" :key="event.id">
      {{ event.name }}
    </li>
  </ul>
</template>

<style scoped></style>
