<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type { PikminEvent } from '@/types/PikminEvent'
import { onMounted, ref, watch } from 'vue'
import SwitchComponent from './SwitchComponent.vue'
import { updateEventPublicState } from '@/service/eventService'

const authStore = useAuthStore()

const props = defineProps<{
  pikminEvent: PikminEvent
  grayedOut?: boolean
  editMode?: boolean
}>()

const emit = defineEmits(['eventEnded', 'eventStarted', 'eventUpdated'])

const dateNow = ref<Date>(new Date())
const startDate = ref<Date>(new Date(props.pikminEvent.startDate))
const endDate = ref<Date>(new Date(props.pikminEvent.endDate))

const remainingTime = ref<string>('')
const isFullscreen = ref<boolean>(false)
const fullscreenImageUrl = ref<string>('')

const eventEnded = ref<boolean>(false)
const eventStarted = ref<boolean>(false)

const eventEditMode = ref<boolean>(props.editMode || false)
const eventEdit = ref<PikminEvent>({} as PikminEvent)

const eventDeleteDialog = ref<HTMLDialogElement | null>(null)

function formatDate(date: Date): string {
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
  if (new Date(startDate.value) <= new Date(dateNow.value)) {
    if (!eventStarted.value) {
      eventStarted.value = true
      console.log(
        `Event: '${props.pikminEvent.name}':${props.pikminEvent.id} started at ${new Date()}`,
      )
      emit('eventStarted')
    }
    remainingTime.value = calculateRemainingTime(endDate.value)
  } else {
    remainingTime.value = calculateRemainingTime(startDate.value)
  }

  if (new Date(endDate.value) <= new Date(dateNow.value)) {
    if (!eventEnded.value) {
      eventEnded.value = true
      console.log(
        `Event: '${props.pikminEvent.name}':${props.pikminEvent.id} ended started at ${new Date()}`,
      )
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

function handleEditEventButton() {
  eventEditMode.value = true
  eventEdit.value = Object.assign({}, props.pikminEvent)
}

function handleEditEventCancelButton() {
  eventEditMode.value = false
  emit('eventUpdated')
}

function handleSaveEventButton() {
  eventEditMode.value = false
  emit('eventUpdated')
}

function handleDeleteEventButton() {
  eventDeleteDialog.value?.showModal()
}

function handleDeleteEventConfirm() {
  eventDeleteDialog.value?.close()
  eventEditMode.value = false
  emit('eventUpdated')
}

function handlePublicSwitchUpdate(state: boolean) {
  eventEdit.value.public = state
  updateEventPublicState(props.pikminEvent.id, state)
  emit('eventUpdated')
}

onMounted(() => {
  updateRemainingTime()
  startPreciseInterval()
})
</script>

<template>
  <div class="event-container" :class="{ 'grayed-out': props.grayedOut }">
    <span class="flex items-center justify-between gap-2 mb-2">
      <h2 v-if="!eventEditMode" class="text-xl font-bold flex-grow">
        {{ props.pikminEvent.name }}
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
          :switch-state="props.pikminEvent.public"
          :states="['public', 'hidden']"
          @state-changed="handlePublicSwitchUpdate"
          :icon="'everyone-icon'"
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
        <span class="icon save-icon"></span>
      </button>
      <a
        class="button button-outline"
        v-if="props.pikminEvent.blogLink && !eventEditMode"
        :href="props.pikminEvent.blogLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="icon forward-icon"></span>
      </a>
    </span>
    <div class="flex justify-between" v-if="!eventEditMode">
      <div v-if="startDate < dateNow && endDate > dateNow" class="text-sm">
        Until {{ formatDate(endDate) }}
      </div>
      <div v-else-if="startDate > dateNow" class="text-sm">From {{ formatDate(startDate) }}</div>
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
      <img
        class="event-image mt-2 rounded-lg cursor-zoom-in"
        v-for="image in props.pikminEvent.images"
        :key="image.id"
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
    <div v-else class="flex flex-col items-center">
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
          class="event-image mt-2 cursor-zoom-in"
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
      <button class="button" @click="eventEdit.images.push({ id: -1, imageUrl: '' })">
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
        Delete <span class="code-block">{{ props.pikminEvent.name }}</span
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

input {
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
