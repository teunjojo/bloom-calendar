<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

import { getEvents } from '@/service/eventService'
import type { PikminEvent } from '@/types/PikminEvent'
import type { EventFilter } from '@/types/EventFilter'

import EventComponent from '@/components/EventComponent.vue'
import BigFlowerFlowchart from '@/components/BigFlowerFlowchart.vue'

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
    currentDate: getLocalTimeString(),
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
    currentDate: getLocalTimeString(),
    sortBy: 'date',
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
  const filters: EventFilter = {
    afterDate: getLocalTimeString(),
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

function getLocalTimeString(date?: Date) {
  if (!date) {
    date = new Date()
  }
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  )
}

function startPreciseInterval() {
  function scheduleNextTick() {
    const now = Date.now()
    const next = Math.ceil(now / 1000) * 1000 // next whole second
    const delay = next - now

    setTimeout(() => {
      if (forecast.value.id) {
        const [year, month] = forecast.value.date.split('-').map(Number)

        if (year && month) {
          const endDate = new Date(year, month, 0, 23, 59, 59)
          const now = new Date()

          if (endDate < now) {
            fetchCurrentForecast()
          }
        }
      }
      scheduleNextTick()
    }, delay)
  }

  scheduleNextTick()
}

function handleAddUpcomingEvent() {
  const now = new Date()
  const startDate = new Date(0)
  startDate.setFullYear(now.getFullYear())
  startDate.setMonth(now.getMonth() + 1)
  startDate.setDate(1)
  const endDate = new Date(startDate)
  endDate.setMonth(now.getMonth() + 2)
  endDate.setMinutes(-1)
  const newEvent: PikminEvent = {
    id: 0,
    name: 'New Event',
    startDate: getLocalTimeString(startDate),
    endDate: getLocalTimeString(endDate),
    images: [],
    public: false,
    blogLink: 'd',
  }
  console.log(getLocalTimeString(startDate))
  console.log(getLocalTimeString(endDate))

  upcomingEvents.value.push(newEvent)
  console.log(events)
}

onMounted(async () => {
  fetchCurrentEvents()
  fetchCurrentForecast()
  fetchUpcomingEvents()

  startPreciseInterval()
})
</script>

<template>
  <div class="dashboard flex flex-wrap justify-center items-start gap-4 p-4">
    <div class="event-list flex flex-col gap-2 p-4 w-96">
      <img
        src="/images/icons/gift.png"
        alt="Flower Icon"
        class="w-10 h-10 absolute self-end"
        style="transform: translate(-1rem, 25%) rotate(10deg)"
        v-if="events.length > 0"
      />
      <span class="text-xl font-bold flex items-center gap-1">
        <img class="special-icon" style="height: 2rem" src="/images/icons/special.png" />
        Current Events
      </span>
      <div v-if="currentEventsFailed" class="error-message">
        <span class="attention-icon"></span>Failed to load current events
      </div>
      <div v-else-if="events.length === 0" class="text-center italic">No current events</div>
      <EventComponent
        v-for="event in events"
        :key="event.id"
        :pikminEvent="event"
        :edit-mode="event.id === -1"
        @event-ended="
          () => {
            fetchCurrentEvents()
          }
        "
        @event-updated="
          () => {
            fetchCurrentEvents()
            fetchUpcomingEvents()
          }
        "
      />
      <span class="text-xl font-bold flex items-center gap-1">
        <img class="special-icon" style="height: 2rem" src="/images/icons/special.png" />
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
        @event-started="
          () => {
            fetchCurrentEvents()
            fetchUpcomingEvents()
          }
        "
        @event-updated="
          () => {
            fetchCurrentEvents()
            fetchUpcomingEvents()
          }
        "
      />
      <div class="flex justify-center" @click="handleAddUpcomingEvent()">
        <button class="button button-primary">
          <span class="icon plus-icon"></span>
        </button>
      </div>
    </div>
    <div class="forecast flex flex-col gap-2 p-4 w-96">
      <span class="flex items-center justify-between gap-2 mb-2">
        <h2 class="text-xl font-bold flex items-center gap-1">
          <img class="weather-icon" style="height: 2rem" src="/images/icons/weather.png" />
          Forecast: {{ forecast.name }}
        </h2>
        <a
          class="blog-link"
          v-if="forecast.blogLink"
          :href="forecast.blogLink"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="icon forward-icon"></span>
        </a>
      </span>
      <div v-if="currentForecastFailed" class="error-message">
        <span class="attention-icon"></span>Failed to load current forecast
      </div>
      <div v-else-if="!forecast.id" class="text-center italic">No current forecast</div>
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
    <div class="flowchart flex flex-col gap-2 p-4 w-96">
      <span class="text-xl font-bold flex items-center gap-1">
        <img class="special-icon" style="height: 2rem" src="/images/icons/flower.png" />
        Big Flower Blooming Guide
      </span>
      <BigFlowerFlowchart />
    </div>
  </div>
</template>

<style scoped>
.event-list,
.forecast,
.flowchart {
  background-color: #fff;
  border-radius: 1rem;
}

.special-icon,
.weather-icon {
  filter: invert(1);
}

.big-flower-forecast {
  background: linear-gradient(135deg, var(--tertiary-color), var(--tertiary-color-dark));
  color: white;
}

.flower-of-the-month {
  background: linear-gradient(135deg, var(--secondary-color), var(--secondary-color-dark));
  color: white;
}

.flower-container img {
  border-radius: 0.5rem;
  background: white;
}

.forward-icon.primary {
  background-color: var(--primary-color);
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
