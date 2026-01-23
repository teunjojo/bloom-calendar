<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Forecast } from '@/types/Forecast'
import FlowerList from '@/components/FlowerList.vue'
import { useAuthStore } from '@/stores/authStore'
import SwitchComponent from './SwitchComponent.vue'

const authStore = useAuthStore()

const props = defineProps<{
  forecast: Forecast
  loading: boolean
  editMode: boolean
}>()

const emit = defineEmits(['forecastUpdated', 'forecastRemoved'])

const forecastEditMode = ref<boolean>(props.editMode || false)
const forecastEdit = ref<Forecast>({} as Forecast)

const forecastDeleteDialog = ref<HTMLDialogElement | null>(null)

const forecastLoading = ref<boolean>(props.loading || false)
const forecastError = ref<boolean>(false)
const forecastErrorMessage = ref<string>('')

const forecast = ref<Forecast>(props.forecast)

const updatingPublicState = ref<boolean>(false)
const showPublicStateLoading = ref<boolean>(false)

const savingForecast = ref<boolean>(false)
const showSavingForecast = ref<boolean>(false)

async function handleEditForecastButton() {
  forecastEditMode.value = true
  forecastEdit.value = JSON.parse(JSON.stringify(forecast.value))
}

async function handleEditForecastCancelButton() {
  forecastEditMode.value = false
}

async function handleSaveForecastButton() {
  savingForecast.value = true
  try {
    //forecast.value = await updateEvent(forecastEdit.value)
  } catch {
    forecastError.value = true
    forecastErrorMessage.value = 'Failed to update event'
    savingForecast.value = false
    return
  }
  savingForecast.value = false
  if (forecast.value.date != props.forecast.date) {
    emit('forecastUpdated')
  }
  forecastEditMode.value = false
}

async function handlePublicSwitchUpdate(state: boolean) {
  forecastEdit.value.public = state
  updatingPublicState.value = true
  try {
    //forecast.value = await updateEventPublicState(forecast.value.id, state)
  } catch {
    forecastError.value = true
    forecastErrorMessage.value = 'Failed to change event public status'
    updatingPublicState.value = false
    return
  }
  updatingPublicState.value = false
}

function handleDeleteForecastButton() {
  forecastDeleteDialog.value?.showModal()
}

async function handleDeleteForecastConfirm() {
  forecastDeleteDialog.value?.close()
  forecastEditMode.value = false
  forecastLoading.value = true
  try {
    //await deleteEvent(forecast.value.id)
  } catch {
    forecastError.value = true
    forecastErrorMessage.value = 'Failed to delete event'
    forecastLoading.value = false
    return
  }
  emit('forecastRemoved')
}

let timer: number | undefined
watch(
  savingForecast,
  (saving) => {
    showSavingForecast.value = false
    if (!saving) return

    clearTimeout(timer)
    timer = window.setTimeout(() => {
      showSavingForecast.value = true
    }, 100)
  },
  { immediate: true },
)
</script>

<template>
  <div class="forecast">
    <span class="flex items-center justify-between gap-2 mb-2">
      <h2 class="text-xl font-bold flex-grow">
        {{ forecast.name }}
      </h2>
      <div
        class="flex gap-2 flex-col"
        v-if="authStore.isAuthenticated() && !forecastEditMode"
        @click="forecastEdit.public = !forecastEdit.public"
      >
        <SwitchComponent
          :switch-state="forecast.public"
          :states="['public', 'hidden']"
          @state-changed="handlePublicSwitchUpdate"
          :icon="
            (updatingPublicState && showPublicStateLoading) || forecastLoading
              ? 'flip-icon spinning-icon'
              : 'everyone-icon'
          "
        ></SwitchComponent>
      </div>
      <button
        class="button button-red"
        v-if="authStore.isAuthenticated() && forecastEditMode"
        @click="handleDeleteForecastButton()"
      >
        <span class="icon delete-icon"></span>
      </button>
      <button
        class="button"
        v-if="authStore.isAuthenticated() && !forecastEditMode"
        @click="handleEditForecastButton()"
      >
        <span class="icon edit-icon"></span>
      </button>
      <button
        class="button"
        v-if="authStore.isAuthenticated() && forecastEditMode"
        @click="handleEditForecastCancelButton()"
      >
        <span class="icon close-icon"></span>
      </button>
      <button class="button" v-if="forecastEditMode" @click="handleSaveForecastButton">
        <span
          class="icon"
          :class="
            (savingForecast && showSavingForecast) || forecastLoading
              ? 'flip-icon spinning-icon'
              : 'save-icon'
          "
        ></span>
      </button>
      <a
        class="button button-outline"
        v-if="forecast.blogLink"
        :href="forecast.blogLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="icon forward-icon"></span>
      </a>
    </span>

    <div class="flex flex-col items-stretch justify-between gap-2 mb-2">
      <FlowerList
        v-if="forecast.flowerOfTheMonth"
        class=""
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

  <!-- delete forecast dialog modal -->
  <dialog ref="forecastDeleteDialog" class="dialog" closedby="any">
    <div class="flex flex-col items-center">
      <span class="text-xl">Are you sure you want to:</span>
      <span class="font-bold">
        Delete <span class="code-block">{{ forecast.name }}</span>
      </span>
    </div>
    <div class="flex justify-around pt-3">
      <div class="flex flex-col items-center">
        <button class="button button-red" @click="handleDeleteForecastConfirm()">
          <span class="icon delete-icon"></span>
        </button>
        <span>Yes</span>
      </div>
      <div class="flex flex-col items-center">
        <button class="button" @click="forecastDeleteDialog?.close()">
          <span class="icon close-icon"></span>
        </button>
        <span>No</span>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.forecast {
  padding: 1rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, var(--tertiary-color), var(--tertiary-color-dark));
  color: white;
}

.flower-container img {
  border-radius: 0.5rem;
  background: white;
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
</style>
