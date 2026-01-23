<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'

import { createEvent, getEvents } from '@/service/eventService'
import type { PikminEvent } from '@/types/PikminEvent'
import type { EventFilter } from '@/types/EventFilter'

import EventComponent from '@/components/EventComponent.vue'
import BigFlowerFlowchart from '@/components/BigFlowerFlowchart.vue'

import type { ForecastFilter } from '@/types/ForecastFilter'
import type { Forecast } from '@/types/Forecast'
import { createForecast, getForecasts } from '@/service/forecastService'
import { useAuthStore } from '@/stores/authStore'
import ForecastComponent from '@/components/ForecastComponent.vue'

const authStore = useAuthStore()

const currentEvents: Ref<PikminEvent[]> = ref<PikminEvent[]>([])
const upcomingEvents: Ref<PikminEvent[]> = ref<PikminEvent[]>([])
const currentForecast: Ref<Forecast> = ref<Forecast>({} as Forecast)
const upcomingForecast: Ref<Forecast> = ref<Forecast>({} as Forecast)

const currentEventsFailed = ref<boolean>(false)
const upcomingEventsFailed = ref<boolean>(false)
const currentForecastFailed = ref<boolean>(false)
const upcomingForecastFailed = ref<boolean>(false)

const loadingCurrentEvents = ref<boolean>(false)
const loadingUpcomingEvents = ref<boolean>(false)
const loadingCurrentForecast = ref<boolean>(false)
const loadingUpcomingForecast = ref<boolean>(false)

async function fetchCurrentEvents() {
  loadingCurrentEvents.value = true

  const filters: EventFilter = {
    currentDate: getLocalTimeString(),
    sortBy: 'endDate',
    sortOrder: 'ASC',
  }
  try {
    currentEvents.value = await getEvents(filters)
  } catch {
    currentEventsFailed.value = true
  }
  loadingCurrentEvents.value = false
}

async function fetchCurrentForecast() {
  loadingCurrentForecast.value = true

  const filters: ForecastFilter = {
    currentDate: getLocalTimeString(),
    sortBy: 'date',
    sortOrder: 'ASC',
  }
  try {
    currentForecast.value = (await getForecasts(filters))[0] || ({} as Forecast)
  } catch {
    currentForecastFailed.value = true
  }
  loadingCurrentForecast.value = false
}

async function fetchUpcomingEvents() {
  loadingUpcomingEvents.value = true

  const now = new Date()
  const filters: EventFilter = {
    afterDate: getLocalTimeString(),
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

  loadingUpcomingEvents.value = false
}

async function fetchUpcomingForecast() {
  loadingUpcomingForecast.value = true

  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
  const filters: ForecastFilter = {
    currentDate: getLocalTimeString(nextMonth),
  }

  let upcomingForecasts: Forecast[] = []
  try {
    upcomingForecasts = await getForecasts(filters)
  } catch {
    upcomingForecastFailed.value = true
  }

  const filteredEvents = upcomingForecasts.filter((forecast) => {
    const eventStartDate = new Date(forecast.date)
    return eventStartDate > now
  })

  if (filteredEvents[0] != undefined) {
    upcomingForecast.value = filteredEvents[0]
  }

  loadingUpcomingForecast.value = false
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
      if (currentForecast.value.id) {
        const [year, month] = currentForecast.value.date.split('-').map(Number)

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

async function handleAddUpcomingEvent() {
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
    blogLink: '',
    newDecor: [],
    returningDecor: [],
  }
  const createdEvent = await createEvent(newEvent)
  upcomingEvents.value.push(createdEvent)
}

async function handleAddUpcomingForecast() {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
  const newForecast: Forecast = {
    id: 0,
    name: 'New Forecast',
    date: getLocalTimeString(nextMonth),
    bigFlowers: [],
    flowerOfTheMonth: {
      id: 0,
      name: 'New flower',
      slug: 'new-flower',
    },
    blogLink: '',
    public: false,
  }
  upcomingForecast.value = await createForecast(newForecast)
}

const showLoadingCurrentEvents = ref<boolean>(false)

let loadingCurrentEventsTimer: number | undefined
watch(
  loadingCurrentEvents,
  (loading) => {
    showLoadingCurrentEvents.value = false
    if (!loading) return

    clearTimeout(loadingCurrentEventsTimer)
    loadingCurrentEventsTimer = window.setTimeout(() => {
      showLoadingCurrentEvents.value = true
    }, 200)
  },
  { immediate: true },
)

const showLoadingUpcomingEvents = ref<boolean>(false)

let loadingUpcomingEventsTimer: number | undefined
watch(
  loadingCurrentEvents,
  (loading) => {
    showLoadingUpcomingEvents.value = false
    if (!loading) return

    clearTimeout(loadingUpcomingEventsTimer)
    loadingUpcomingEventsTimer = window.setTimeout(() => {
      showLoadingUpcomingEvents.value = true
    }, 200)
  },
  { immediate: true },
)

const showLoadingCurrentForecast = ref<boolean>(false)
const showLoadingUpcomingForecast = ref<boolean>(false)

onMounted(async () => {
  fetchCurrentEvents()
  fetchCurrentForecast()
  fetchUpcomingEvents()
  fetchUpcomingForecast()

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
        v-if="currentEvents.length > 0"
      />
      <span class="text-xl font-bold flex items-center gap-1">
        <img class="invert" style="height: 2rem" src="/images/icons/special.png" />
        Current Events
      </span>
      <div v-if="loadingCurrentEvents" class="flex justify-center">
        <div class="spinner">
          <span class="icon flip-icon spinning-icon"></span>
        </div>
      </div>
      <div v-else-if="currentEventsFailed" class="error-message">
        <span class="icon attention-icon"></span>Failed to load current events
      </div>
      <div v-else-if="currentEvents.length === 0" class="text-center italic">No current events</div>
      <div v-else class="flex flex-col gap-2">
        <EventComponent
          v-for="event in currentEvents"
          :key="event.id"
          :pikminEvent="event"
          :edit-mode="event.id === -1"
          :loading="loadingCurrentEvents && showLoadingCurrentEvents"
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
          @event-removed="
            () => {
              currentEvents.splice(currentEvents.indexOf(event), 1)
            }
          "
        />
      </div>
      <span class="text-xl font-bold flex items-center gap-1">
        <img class="invert" style="height: 2rem" src="/images/icons/special.png" />
        Upcoming Events
      </span>
      <div v-if="loadingUpcomingEvents" class="flex justify-center">
        <div class="spinner">
          <span class="icon flip-icon spinning-icon"></span>
        </div>
      </div>
      <div v-else-if="upcomingEventsFailed" class="error-message">
        <span class="icon attention-icon"></span>Failed to load upcoming events
      </div>
      <div v-else-if="upcomingEvents.length === 0" class="text-center italic">
        No upcoming events
      </div>
      <div v-else class="flex flex-col gap-2">
        <EventComponent
          v-for="event in upcomingEvents"
          :key="event.id"
          :pikminEvent="event"
          :loading="loadingUpcomingEvents && showLoadingUpcomingEvents"
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
          @event-removed="
            () => {
              upcomingEvents.splice(upcomingEvents.indexOf(event), 1)
            }
          "
        />
      </div>
      <div
        v-if="authStore.isAuthenticated()"
        class="flex justify-center"
        @click="handleAddUpcomingEvent()"
      >
        <button class="button button-primary">
          <span class="icon plus-icon"></span>
        </button>
      </div>
    </div>

    <div class="forecast-list flex flex-col gap-2 p-4 w-96">
      <span class="text-xl font-bold flex items-center gap-1">
        <img class="invert" style="height: 2rem; --bg: black" src="/images/icons/weather.png" />
        Current Forecast
      </span>
      <div v-if="loadingCurrentForecast" class="flex justify-center">
        <div class="spinner">
          <span class="icon flip-icon spinning-icon"></span>
        </div>
      </div>
      <div v-else-if="currentForecastFailed" class="error-message">
        <span class="icon attention-icon"></span>Failed to load current forecast
      </div>
      <div v-else-if="!currentForecast.id" class="text-center italic">No current forecasts</div>
      <div v-else class="flex flex-col gap-2">
        <ForecastComponent
          :forecast="currentForecast"
          :loading="loadingCurrentForecast && showLoadingCurrentForecast"
        />
      </div>
      <span class="text-xl font-bold flex items-center gap-1">
        <img class="invert" style="height: 2rem" src="/images/icons/weather.png" />
        Upcoming Forecast
      </span>
      <div v-if="loadingUpcomingForecast" class="flex justify-center">
        <div class="spinner">
          <span class="icon flip-icon spinning-icon"></span>
        </div>
      </div>
      <div v-else-if="upcomingForecastFailed" class="error-message">
        <span class="icon attention-icon"></span>Failed to load upcoming forecast
      </div>
      <div v-else-if="!upcomingForecast.id" class="text-center italic">No upcoming forecast</div>
      <div v-else class="flex flex-col gap-2">
        <ForecastComponent
          :forecast="upcomingForecast"
          :loading="loadingUpcomingForecast && showLoadingUpcomingForecast"
        />
      </div>
      <div
        v-if="authStore.isAuthenticated()"
        class="flex justify-center"
        @click="handleAddUpcomingForecast()"
      >
        <button class="button button-primary">
          <span class="icon plus-icon"></span>
        </button>
      </div>
    </div>

    <div class="flowchart flex flex-col gap-2 p-4 w-96">
      <span class="text-xl font-bold flex items-center gap-1">
        <img class="invert" style="height: 2rem" src="/images/icons/flower.png" />
        Big Flower Blooming Guide
      </span>
      <BigFlowerFlowchart />
    </div>
  </div>
</template>

<style scoped>
.event-list,
.forecast-list,
.flowchart {
  background-color: #fff;
  border-radius: 1rem;
}

.forward-icon.primary {
  background-color: var(--primary-color);
}
</style>
