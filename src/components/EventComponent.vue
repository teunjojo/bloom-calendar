<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { PikminEvent } from '@/types/PikminEvent'
import { onMounted, ref, watch } from 'vue'
import SwitchComponent from './SwitchComponent.vue'
import { deleteEvent, updateEvent, updateEventPublicState } from '@/service/eventService'
import PikminList from './PikminList.vue'
import type { Decor } from '@/types/Decor'
import { getDecors } from '@/service/decorService'

const authStore = useAuthStore()

const props = defineProps<{
  pikminEvent: PikminEvent
  editMode?: boolean
  loading?: boolean
}>()

const emit = defineEmits(['eventEnded', 'eventStarted', 'eventUpdated', 'eventRemoved'])

const event = ref<PikminEvent>(props.pikminEvent)

const dateNow = ref<Date>(new Date())

const remainingTime = ref<string>('')
const isFullscreen = ref<boolean>(false)
const fullscreenImageUrl = ref<string>('')

const eventLoading = ref<boolean>(props.loading || false)
const eventError = ref<boolean>(false)
const eventErrorMessage = ref<string>('')

const eventEnded = ref<boolean>(false)
const eventStarted = ref<boolean>(false)

const eventEditMode = ref<boolean>(props.editMode || false)
const eventEdit = ref<PikminEvent>({} as PikminEvent)

const eventDeleteDialog = ref<HTMLDialogElement | null>(null)

const updatingPublicState = ref<boolean>(false)
const showPublicStateLoading = ref<boolean>(false)

const savingEvent = ref<boolean>(false)
const showSavingEvent = ref<boolean>(false)

const allDecor = ref<Decor[]>([])

const selectedReturningDecor = ref<Decor | undefined>()

function formatDate(date: Date, endDate?: boolean): string {
  if (endDate) {
    date.setTime(date.getTime() - 1)
  }
  const datePart = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const timePart = date.toLocaleTimeString(navigator.languages, {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${datePart} ${timePart}`
}

function calculateRemainingTime(date: Date): string {
  const maxParts = 3

  const now = new Date()
  let diff = Math.max(0, date.getTime() - now.getTime()) / 1000 // difference in seconds

  const units = new Map<string, number>([
    ['d', 86400],
    ['h', 3600],
    ['m', 60],
    ['s', 1],
  ])

  // units to array for indexing
  const entries = Array.from(units.entries())
  const parts: string[] = []

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    if (!entry) continue
    const [label, value] = entry

    const amount = Math.floor(diff / value)
    diff %= value

    if (amount > 0 || parts.length > 0 || i == entries.length - 1) {
      parts.push(`${amount}${label}`)
    }

    if (parts.length >= maxParts) break
  }
  return parts.join(' ')
}

function updateRemainingTime() {
  if (new Date(event.value.startDate) <= new Date(dateNow.value)) {
    if (!eventStarted.value) {
      eventStarted.value = true
      console.log(`Event: '${event.value.name}':${event.value.id} started at ${new Date()}`)
      emit('eventStarted')
    }
    remainingTime.value = calculateRemainingTime(new Date(event.value.endDate))
  } else {
    remainingTime.value = calculateRemainingTime(new Date(event.value.startDate))
  }

  if (new Date(event.value.endDate) <= new Date(dateNow.value)) {
    if (!eventEnded.value) {
      eventEnded.value = true
      console.log(`Event: '${event.value.name}':${event.value.id} ended started at ${new Date()}`)
      emit('eventEnded')
    }
  }
}

function startPreciseInterval() {
  function scheduleNextTick() {
    const now = Date.now()
    const next = Math.ceil(now / 1000) * 1000 // next whole second
    const delay = next - now

    setTimeout(() => {
      dateNow.value = new Date()
      updateRemainingTime()
      scheduleNextTick()
    }, delay)
  }

  scheduleNextTick()
}

async function handleEditEventButton() {
  eventEditMode.value = true
  eventEdit.value = JSON.parse(JSON.stringify(event.value))
  allDecor.value = await getDecors()
}

function handleEditEventCancelButton() {
  eventEditMode.value = false
}

async function handleSaveEventButton() {
  savingEvent.value = true
  try {
    event.value = await updateEvent(eventEdit.value)
  } catch {
    eventError.value = true
    eventErrorMessage.value = 'Failed to update event'
    savingEvent.value = false
    return
  }
  savingEvent.value = false
  if (
    event.value.startDate != props.pikminEvent.startDate ||
    event.value.endDate != props.pikminEvent.endDate
  ) {
    emit('eventUpdated')
  }
  eventEditMode.value = false
}

function handleDeleteEventButton() {
  eventDeleteDialog.value?.showModal()
}

async function handleDeleteEventConfirm() {
  eventDeleteDialog.value?.close()
  eventEditMode.value = false
  eventLoading.value = true
  try {
    await deleteEvent(event.value.id)
  } catch {
    eventError.value = true
    eventErrorMessage.value = 'Failed to delete event'
    eventLoading.value = false
    return
  }
  emit('eventRemoved')
}

async function handlePublicSwitchUpdate(state: boolean) {
  eventEdit.value.public = state
  updatingPublicState.value = true
  try {
    event.value = await updateEventPublicState(event.value.id, state)
  } catch {
    eventError.value = true
    eventErrorMessage.value = 'Failed to change event public status'
    updatingPublicState.value = false
    return
  }
  updatingPublicState.value = false
}

let timer: number | undefined
watch(
  updatingPublicState,
  (loading) => {
    showPublicStateLoading.value = false
    if (!loading) return

    clearTimeout(timer)
    timer = window.setTimeout(() => {
      showPublicStateLoading.value = true
    }, 50)
  },
  { immediate: true },
)

watch(
  savingEvent,
  (saving) => {
    showSavingEvent.value = false
    if (!saving) return

    clearTimeout(timer)
    timer = window.setTimeout(() => {
      showSavingEvent.value = true
    }, 100)
  },
  { immediate: true },
)

watch(props.pikminEvent, (_event) => {
  event.value = _event
})

onMounted(() => {
  updateRemainingTime()
  startPreciseInterval()
})
</script>

<template>
  <div
    v-if="eventLoading"
    class="event-container"
    :class="{ 'grayed-out': dateNow < new Date(event.startDate) }"
  >
    <span class="flex items-center justify-between gap-2 mb-2">
      <h2 class="text-xl font-bold flex-grow text-transparent">Loading Event</h2>
      <div class="button">
        <span class="icon flip-icon spinning-icon"></span>
      </div>
    </span>

    <div class="flex justify-between">
      <div class="text-sm text-transparent">Loading Event Start/End Date</div>
      <div class="countdown text-xs rounded rounded-full text-transparent">??d ??h ??m</div>
    </div>
  </div>
  <div
    v-else
    class="event-container"
    :class="{ 'grayed-out': dateNow < new Date(event.startDate) }"
  >
    <div v-if="eventError" class="error-message mb-3">
      <span class="icon attention-icon"></span>An error occurred: {{ eventErrorMessage }}
    </div>
    <span class="flex items-center justify-between gap-2 mb-2">
      <h2 v-if="!eventEditMode" class="text-xl font-bold flex-grow">
        {{ event.name }}
      </h2>
      <h2 v-else class="text-xl font-bold flex-grow">
        <input type="text" class="w-full" v-model="eventEdit.name" />
      </h2>
      <div
        class="flex gap-2 flex-col"
        v-if="authStore.isAuthenticated() && !eventEditMode"
        @click="eventEdit.public = !eventEdit.public"
      >
        <SwitchComponent
          :switch-state="event.public"
          :states="['public', 'hidden']"
          @state-changed="handlePublicSwitchUpdate"
          :icon="
            (updatingPublicState && showPublicStateLoading) || eventLoading
              ? 'flip-icon spinning-icon'
              : 'everyone-icon'
          "
        ></SwitchComponent>
      </div>
      <button
        class="button button-red"
        v-if="authStore.isAuthenticated() && eventEditMode"
        @click="handleDeleteEventButton()"
      >
        <span class="icon delete-icon"></span>
      </button>
      <button
        class="button"
        v-if="authStore.isAuthenticated() && !eventEditMode"
        @click="handleEditEventButton()"
      >
        <span class="icon edit-icon"></span>
      </button>
      <button
        class="button"
        v-if="authStore.isAuthenticated() && eventEditMode"
        @click="handleEditEventCancelButton()"
      >
        <span class="icon close-icon"></span>
      </button>
      <button class="button" v-if="eventEditMode" @click="handleSaveEventButton">
        <span
          class="icon"
          :class="
            (savingEvent && showSavingEvent) || eventLoading
              ? 'flip-icon spinning-icon'
              : 'save-icon'
          "
        ></span>
      </button>
      <a
        class="button button-outline button-white"
        v-if="event.blogLink && !eventEditMode"
        :href="event.blogLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="icon forward-icon"></span>
      </a>
    </span>
    <div class="flex justify-between" v-if="!eventEditMode">
      <div
        v-if="new Date(event.startDate) < dateNow && new Date(event.endDate) > dateNow"
        class="text-sm"
      >
        Until {{ formatDate(new Date(event.endDate), true) }}
      </div>
      <div v-else-if="new Date(event.startDate) > dateNow" class="text-sm">
        From {{ formatDate(new Date(event.startDate)) }}
      </div>
      <div class="countdown text-xs rounded rounded-full">{{ remainingTime }}</div>
    </div>
    <div v-else>
      <label for="start-date" class="whitespace-nowrap">From:</label>
      <input type="datetime-local" class="w-full" name="start-date" v-model="eventEdit.startDate" />
      <label for="end-date" class="whitespace-nowrap">Until:</label>
      <input type="datetime-local" class="w-full" name="end-date" v-model="eventEdit.endDate" />
    </div>
    <div v-if="eventEditMode">
      <label for="blog-link" class="whitespace-nowrap">Link:</label>
      <input type="text" name="blog-link" class="w-full" v-model="eventEdit.blogLink" />
    </div>
    <div v-if="!eventEditMode">
      <div
        v-if="event.images.length > 0"
        class="rounded-xl bg-indigo-300 mt-5 p-2 flex flex-col items-center gap-1"
      >
        <span
          class="font-bold rounded-full border border-2 border-indigo-500 text-indigo-600 px-3 mb-2 shadow-inward"
          >Event Images</span
        >
        <div class="flex flex-wrap items-center justify-around gap-2">
          <div v-for="image in event.images" :key="image.id" class="event-image w-32">
            <img
              class="cursor-zoom-in rounded-xl max-w-full max-h-full shadow-xl"
              :src="image.imageUrl"
              @click="
                (() => {
                  fullscreenImageUrl = image.imageUrl
                  isFullscreen = true
                })()
              "
              alt="Event image"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col gap-1 items-center">
      <span class="text-lg align-center">Images</span>
      <div
        class="flex gap-2 items-center justify-start w-full"
        v-for="image in eventEdit.images"
        :key="image.id"
      >
        <button
          class="button button-red"
          @click="eventEdit.images.splice(eventEdit.images.indexOf(image), 1)"
        >
          <span class="icon delete-icon"></span>
        </button>
        <input class="w-full" type="text" v-model="image.imageUrl" />
        <img
          class="event-image cursor-zoom-in"
          style="height: 2rem"
          :src="image.imageUrl"
          @click="
            (() => {
              fullscreenImageUrl = image.imageUrl
              isFullscreen = true
            })()
          "
        />
      </div>
      <button
        class="button"
        @click="
          () => {
            eventEdit.images.push({ id: -1, imageUrl: '' })
          }
        "
      >
        <span class="icon plus-icon"></span>
      </button>
    </div>
    <div v-if="!eventEditMode">
      <div
        class="mt-5 rounded-xl p-2 flex flex-col items-center gap-1 bg-amber-100"
        v-if="event.newDecor.length > 0"
      >
        <span
          class="font-bold px-3 rounded-full border border-2 border-amber-500 text-amber-600 mb-2"
          >New Decor Pikmin</span
        >
        <div class="flex flex-wrap gap-2 justify-around">
          <PikminList
            v-for="decor in event.newDecor"
            :key="decor.id"
            :name="decor.name"
            :type="decor.type"
            class="shadow-xl"
          ></PikminList>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col gap-1 items-center">
      <span class="text-lg align-center">New Decor</span>
      <div
        class="flex gap-2 items-center justify-start w-full"
        v-for="decor in eventEdit.newDecor"
        :key="decor.id"
      >
        <button
          class="button button-red"
          @click="eventEdit.newDecor.splice(eventEdit.newDecor.indexOf(decor), 1)"
        >
          <span class="icon delete-icon"></span>
        </button>
        <input class="w-full" type="text" v-model="decor.name" />
        <input class="w-full" type="text" v-model="decor.type" />
      </div>
      <button
        class="button"
        @click="
          () => {
            eventEdit.newDecor.push({ id: -1, name: '', type: '', newDecorEventId: event.id })
          }
        "
      >
        <span class="icon plus-icon"></span>
      </button>
    </div>
    <div v-if="!eventEditMode">
      <div
        class="mt-5 rounded-xl p-2 flex flex-col items-center gap-1 bg-amber-100"
        v-if="event.returningDecor.length > 0"
      >
        <span
          class="font-bold px-3 rounded-full border border-2 border-amber-500 text-amber-600 mb-2"
          >Returning Decor Pikmin</span
        >
        <div class="flex flex-wrap gap-2 justify-around">
          <PikminList
            v-for="decor in event.returningDecor"
            :key="decor.id"
            :name="decor.name"
            :type="decor.type"
            class="shadow-xl"
          ></PikminList>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col gap-1 items-center">
      <span class="text-lg align-center">Returning Decor</span>
      <div
        class="flex gap-2 items-center justify-start w-full"
        v-for="decor in eventEdit.returningDecor"
        :key="decor.id"
      >
        <button
          class="button button-red"
          @click="eventEdit.returningDecor.splice(eventEdit.returningDecor.indexOf(decor), 1)"
        >
          <span class="icon delete-icon"></span>
        </button>
        <span>{{ decor.name }}</span>
      </div>
      <select class="w-full" name="selectedDecor" v-model="selectedReturningDecor">
        <option :value="undefined" disabled></option>
        <option
          v-for="selectDecor in allDecor"
          :key="selectDecor.id"
          :value="selectDecor"
          :disabled="eventEdit.returningDecor.some((decor) => decor.id === selectDecor.id)"
        >
          {{ selectDecor.name }}
        </option>
      </select>
      <button
        class="button"
        @click="
          () => {
            if (!selectedReturningDecor) {
              eventError = true
              eventErrorMessage = 'No returning decor selected'
              return
            }
            if (eventEdit.returningDecor.some((decor) => decor.id === selectedReturningDecor!.id)) {
              eventError = true
              eventErrorMessage = 'Returning decor already added'
              return
            }

            eventEdit.returningDecor.push(selectedReturningDecor)
            eventError = false
            selectedReturningDecor = undefined
          }
        "
      >
        <span class="icon plus-icon"></span>
      </button>
    </div>
  </div>
  <!-- fullscreen popup modal-->
  <div
    class="fullscreen-popup cursor-zoom-out"
    :style="{
      opacity: isFullscreen ? '1' : '0',
      pointerEvents: isFullscreen ? 'auto' : 'none',
    }"
    @click="isFullscreen = false"
  >
    <img
      class="fullscreen-image"
      :class="isFullscreen ? 'popin' : 'popout'"
      :src="fullscreenImageUrl"
    />
  </div>

  <!-- delete event dialog modal -->
  <dialog ref="eventDeleteDialog" class="dialog" closedby="any">
    <div class="flex flex-col items-center">
      <span class="text-xl">Are you sure you want to:</span>
      <span class="font-bold">
        Delete <span class="code-block">{{ event.name }}</span
        >?
      </span>
    </div>
    <div class="flex justify-around pt-3">
      <div class="flex flex-col items-center">
        <button class="button button-red" @click="handleDeleteEventConfirm()">
          <span class="icon delete-icon"></span>
        </button>
        <span>Yes</span>
      </div>
      <div class="flex flex-col items-center">
        <button class="button" @click="eventDeleteDialog?.close()">
          <span class="icon close-icon"></span>
        </button>
        <span>No</span>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.event-container {
  padding: 1rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-dark));
  color: white;
}

input,
select {
  background: #ffffff40;
  border: solid 2px white;
  border-radius: 12px;
  padding: 0;
}

.grayed-out {
  --primary-color: var(--gray-500);
  --primary-color-dark: var(--gray-550);
}

.countdown {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  background-color: white;
  color: var(--primary-color);
  padding: 0 0.4rem;
  height: 1.4em;
}

.fullscreen-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s;
  z-index: 1000;
}

.fullscreen-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 1rem;
}

.dialog {
  background: var(--primary-color);
  box-shadow: 0px 0px 12px black;
  border-radius: 12px;
  padding: 1rem;
  color: white;
}

.code-block {
  background: #00000040;
  padding: 3px;
  border-radius: 3px;
}

.popin {
  animation: popIn 0.3s;
}

.popout {
  animation: popOut 0.3s;
}

@keyframes popIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@keyframes popOut {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
}
</style>
