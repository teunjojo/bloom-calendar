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

const currentEventsFailed = ref<boolean>(false)
const currentForecastFailed = ref<boolean>(false)
const upcomingEventsFailed = ref<boolean>(false)

async function fetchCurrentEvents() {
  const filters: EventFilter = {
    currentDate: new Date(),
    sortBy: 'endDate',
    sortOrder: 'ASC',
  }
  try {
    events.value = await getEvents(filters)
  } catch {
    currentEventsFailed.value = true
  }
}

async function fetchCurrentForecast() {
  const filters: ForecastFilter = {
    currentDate: new Date(),
    sortBy: 'endDate',
    sortOrder: 'ASC',
  }
  try {
    forecast.value = (await getForecasts(filters))[0] || ({} as Forecast)
  } catch {
    currentForecastFailed.value = true
  }
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

  let nextWeekEvents: PikminEvent[] = []
  try {
    nextWeekEvents = await getEvents(filters)
  } catch {
    upcomingEventsFailed.value = true
  }

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
  <div class="dashboard flex flex-wrap justify-center gap-4 p-4">
    <div class="event-list flex flex-col gap-2 p-4 w-96">
      <img
        src="/images/icons/gift.png"
        alt="Flower Icon"
        class="w-10 h-10 absolute self-end"
        style="transform: translate(-1rem, calc(100% - 50%)) rotate(10deg)"
        v-if="events.length > 0"
      />
      <span class="text-xl font-bold flex items-center">
        <img class="w-10 special-icon" src="/images/icons/special.png" />
        Current Events
      </span>
      <div v-if="currentEventsFailed" class="error-message">
        <span class="attention-icon"></span>Failed to load current events
      </div>
      <div v-else-if="events.length === 0" class="text-center italic">No current events</div>
      <EventComponent v-for="event in events" :key="event.id" :pikminEvent="event" />
      <span class="text-xl font-bold flex items-center">
        <img class="w-10 special-icon" src="/images/icons/special.png" />
        Upcoming Events
      </span>
      <div v-if="upcomingEventsFailed" class="error-message">
        <span class="attention-icon"></span>Failed to load upcoming events
      </div>
      <div v-else-if="upcomingEvents.length === 0" class="text-center italic">
        No upcoming events
      </div>
      <EventComponent
        v-for="event in upcomingEvents"
        :key="event.id"
        :pikminEvent="event"
        :grayedOut="true"
      />
    </div>
    <div class="forecast flex flex-col gap-2 p-4 w-96">
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
      <div v-if="currentForecastFailed" class="error-message">
        <span class="attention-icon"></span>Failed to load current forecast
      </div>
      <div v-else-if="!forecast.name" class="text-center italic">No current forecast</div>
      <FlowerList
        v-if="forecast.flowerOfTheMonth"
        class="flower-of-the-month"
        :flowers="[forecast.flowerOfTheMonth]"
        name="Flower of the Month"
      />
      <FlowerList
        v-if="forecast.bigFlowers"
        class="big-flower-forecast"
        :flowers="forecast.bigFlowers"
        name="Big Flowers"
      />
    </div>
  </div>
</template>

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=arrow_forward_ios,close,warning';

.event-list,
.forecast {
  background-color: #fff;
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

.error-message {
  background-color: #ffe5e5;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: #b30000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.attention-icon {
  width: 1.5rem;
  height: 1.5rem;
  background-color: #b30000;
  mask: url('/images/icons/attention-stroke.png') no-repeat center / contain;
}
</style>
