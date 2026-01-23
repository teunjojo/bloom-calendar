<script setup lang="ts">
import { ref } from 'vue'
import type { Forecast } from '@/types/Forecast'
import FlowerList from '@/components/FlowerList.vue'

const props = defineProps<{
  forecast: Forecast
}>()

const forecast = ref<Forecast>(props.forecast)
</script>

<template>
  <div class="forecast">
    <span class="flex items-center justify-between gap-2 mb-2">
      <h2 class="text-xl font-bold flex items-center gap-1">
        {{ forecast.name }}
      </h2>
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
</style>
