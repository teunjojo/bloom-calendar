<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { useAuthStore } from '@/stores/authStore'
import { signOut } from '@/service/authService';

const authStore = useAuthStore()

</script>

<template>
  <nav class="flex p-2 justify-center items-center bg-white px-4">
    <ul class="flex justify-center items-center gap-4" style="width: 100%; max-width: 720px">
      <li>
        <RouterLink to="/" class="flex items-center gap-2">
          <img src="/images/icons/logo.png" style="height: 3rem" />
          <h1 class="text-2xl font-bold">BloomCalendar</h1>
        </RouterLink>
      </li>
      <li>
        <a v-if="authStore.isAuthenticated()" @click="signOut()" class="big-button">Logout</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>

</style>
