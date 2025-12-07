<script setup lang="ts">
import type { PikminEvent } from '@/types/PikminEvent'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  pikminEvent: PikminEvent
  grayedOut?: boolean
}>()

const dateNow = ref<Date>(new Date())
const startDate = ref<Date>(new Date(props.pikminEvent.startDate))
const endDate = ref<Date>(new Date(props.pikminEvent.endDate))

const remainingTime = ref<string>('')
const isFullscreen = ref<boolean>(false)
const fullscreenImageUrl = ref<string>('')

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
  const now = new Date()
  let diff = Math.max(0, date.getTime() - now.getTime()) / 1000 // difference in seconds

  const days = Math.floor(diff / 86400)
  diff -= days * 86400
  const hours = Math.floor(diff / 3600)
  diff -= hours * 3600
  const minutes = Math.floor(diff / 60)
  diff -= minutes * 60
  const seconds = Math.floor(diff)

  function pad(num: number): string {
    return num.toString().padStart(2, '0')
  }

  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

function updateRemainingTime() {
  if (startDate.value > dateNow.value) {
    remainingTime.value = calculateRemainingTime(startDate.value)
  } else if (endDate.value > dateNow.value) {
    remainingTime.value = calculateRemainingTime(endDate.value)
  } else {
    remainingTime.value = '00:00:00:00'
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

onMounted(() => {
  updateRemainingTime()
  startPreciseInterval()
})
</script>

<template>
  <div class="event-container" :class="{ 'grayed-out': props.grayedOut }">
    <span class="flex items-center justify-between gap-2 mb-2">
      <h2 class="text-xl font-bold flex-grow">{{ props.pikminEvent.name }}</h2>
      <a
        class="blog-link aspect-square flex items-center justify-center"
        v-if="props.pikminEvent.blogLink"
        :href="props.pikminEvent.blogLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="forward-icon primary"></span>
      </a>
    </span>
    <div class="flex justify-between">
      <div v-if="startDate < dateNow && endDate > dateNow" class="text-sm">
        Until {{ formatDate(endDate) }}
      </div>
      <div v-else-if="startDate > dateNow" class="text-sm">From {{ formatDate(startDate) }}</div>
      <div class="countdown text-xs rounded rounded-full">{{ remainingTime }}</div>
    </div>
    <img
      class="event-image mt-2 rounded-lg cursor-zoom-in"
      v-for="image in props.pikminEvent.images"
      :key="image.id"
      :src="image.imageUrl"
      @click="isFullscreen = true; fullscreenImageUrl = image.imageUrl"
      alt="Event image"
    />
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
</template>

<style scoped>
.event-container {
  padding: 1rem;
  border-radius: 1rem;
  background-color: var(--primary-color);
  color: white;
}

.grayed-out {
  --primary-color: #ababab;
}

.blog-link {
  color: white;
  border: 2px solid white;
  border-radius: 100vw;
  min-width: 2.5rem;
  font-size: 1rem;
}

.forward-icon {
  width: 1.5rem;
  height: 1.5rem;
  background-color: white;
  mask: url('/images/icons/drillin.png') no-repeat center / contain;
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
