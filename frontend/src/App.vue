<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import { onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import { checkAuth } from '@/service/authService'

const route = useRoute()
watch(
  () => route.name?.toString(),
  (newName) => {
    if (!newName) {
      document.title = 'BloomCalendar'
      return
    }
    document.title = `BloomCalendar - ${newName}`
  },
  { immediate: true }
)

onMounted(async () => {
  checkAuth().catch(() => {
    // Not authenticated
  })
})
</script>

<template>
  <div class="flex flex-col justify-between min-h-screen">
  <NavBar />
  <RouterView />
  <FooterComponent />
  </div>
</template>

<style scoped></style>
