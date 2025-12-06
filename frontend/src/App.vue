<script setup lang="ts">
import { onMounted } from 'vue';
import { getEvents } from './service/eventService';


onMounted(() => {
  getEvents().then(events => {
    console.log('Fetched events:', events);
  });
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
