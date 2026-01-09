<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import { onMounted, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import { checkAuth } from '@/service/authService'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()

const tryingAuth = ref<boolean>(true)

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
  { immediate: true },
)

onMounted(async () => {
  await checkAuth().catch(() => {
    authStore.setToken('')
  })
  tryingAuth.value = false
})
</script>

<template>
  <div class="flex flex-col justify-between min-h-screen">
    <NavBar />
    <div v-if="tryingAuth" class="flex justify-center">
      <div class="spinner bg-white rounded-full p-2 shadow-xl">
        <span class="icon flip-icon spinning-icon"></span>
      </div>
    </div>
    <RouterView v-else />
    <FooterComponent />
  </div>
</template>

<style scoped></style>
