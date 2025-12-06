<script setup lang="ts">
import { getEvents, type PikminEvent } from '@/service/eventService'
import { onMounted, ref } from 'vue'

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
