<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

import { getEvents } from '@/service/eventService'
import type { PikminEvent } from '@/types/PikminEvent'
import type { EventFilter } from '@/types/EventFilter'

import EventComponent from '@/components/EventComponent.vue'
import FlowerList from '@/components/FlowerList.vue'
import type { ForecastFilter } from '@/types/ForecastFilter'
import type { Forecast } from '@/types/Forecast'
import { getForecasts } from '@/service/forecastService'

const events: Ref<PikminEvent[]> = ref<PikminEvent[]>([])
const forecast: Ref<Forecast> = ref<Forecast>({} as Forecast)
const upcomingEvents: Ref<PikminEvent[]> = ref<PikminEvent[]>([])

async function fetchCurrentEvents() {
  const filters: EventFilter = {
    currentDate: new Date(),
    sortBy: 'endDate',
    sortOrder: 'ASC',
  }
  events.value = await getEvents(filters)
}

async function fetchCurrentForecast() {
  const filters: ForecastFilter = {
    currentDate: new Date(),
    sortBy: 'endDate',
    sortOrder: 'ASC',
  }
  forecast.value = (await getForecasts(filters))[0] || ({} as Forecast)
}

async function fetchUpcomingEvents() {
  const now = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(now.getDate() + 7)
  const filters: EventFilter = {
    currentDate: nextWeek,
    sortBy: 'endDate',
    sortOrder: 'ASC',
  }

  const nextWeekEvents = await getEvents(filters)
  const filteredEvents = nextWeekEvents.filter((event) => {
    const eventStartDate = new Date(event.startDate)
    return eventStartDate > now
  })
  upcomingEvents.value = filteredEvents
}

onMounted(() => {
  fetchCurrentEvents()
  fetchCurrentForecast()
  fetchUpcomingEvents()
})
</script>

<template>
  <div class="flex flex-wrap justify-center gap-4 p-4">
    <div class="event-list flex flex-col gap-2 p-4 w-96">
      <span class="text-xl font-bold">Current Events</span>
      <EventComponent v-for="event in events" :key="event.id" :pikminEvent="event" />
      <span class="text-xl font-bold">Upcoming Events</span>
      <EventComponent
        v-for="event in upcomingEvents"
        :key="event.id"
        :pikminEvent="event"
        :grayedOut="true"
      />
    </div>
    <div v-if="forecast.bigFlowers" class="forecast flex flex-col gap-2 p-4 w-96">
      <span class="flex items-center justify-between gap-2 mb-2">
        <h2 class="text-xl font-bold flex-grow">Forecast: {{ forecast.name }}</h2>
        <a
          class="blog-link aspect-square flex items-center justify-center"
          v-if="forecast.blogLink"
          :href="forecast.blogLink"
          target="_blank"
          rel="noopener noreferrer"
          ><span class="material-symbols-outlined"> arrow_forward_ios </span></a
        >
      </span>
      <FlowerList
        class="flower-of-the-month"
        :flowers="[forecast.flowerOfTheMonth]"
        name="Flower of the Month"
      />
      <FlowerList class="big-flower-forecast" :flowers="forecast.bigFlowers" name="Big Flowers" />
    </div>
  </div>
</template>

<style scoped>
.event-list,
.forecast {
  background-color: #f7f7f7;
  border-radius: 1rem;
}

.big-flower-forecast {
  background-color: #72bef7;
  color: white;
}

.flower-of-the-month {
  background-color: #ffa633;
  color: white;
}

.flower-container img {
  border-radius: 0.5rem;
  background: white;
}

.blog-link {
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 100vw;
  min-width: 2.5rem;
  font-size: 1rem;
}
</style>
