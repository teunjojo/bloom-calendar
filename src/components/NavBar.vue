<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { useAuthStore } from '@/stores/authStore'
import { signOut } from '@/service/authService'
import { ref } from 'vue'

const authStore = useAuthStore()

const showFeedbackAlert = ref<boolean>(true)
</script>

<template>
  <div>
    <nav class="flex p-2 justify-center items-center bg-white px-4">
      <ul class="flex justify-center items-center gap-4" style="width: 100%; max-width: 720px">
        <li>
          <RouterLink to="/" class="flex items-center gap-2">
            <img src="/images/icons/logo.png" style="height: 3rem" />
            <h1 class="text-2xl font-bold">BloomCalendar</h1>
          </RouterLink>
        </li>
        <li>
          <a class="big-button button-primary button-outline" href="https://www.pikminwiki.com/">
            <img
              src="https://pikmin.wiki.gallery/images/f/f0/Wiki.svg"
              style="height: 2rem"
              class="drop-shadow"
            />
            <span>Pikipedia</span>
          </a>
        </li>
        <li>
          <button v-if="authStore.isAuthenticated()" @click="signOut()" class="big-button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
    <div class="w-full bg-rose-400 justify-center flex text-white p-2" v-if="showFeedbackAlert">
      <div class="container flex justify-center items-center gap-2 px-2">
        <span>
          Suggestion? Create a
          <a
            class="underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/teunjojo/bloom-calendar/issues/new"
            >ticket</a
          >
          or message me on
          <a
            class="underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.com/users/306533562444939265"
            >discord</a
          >!
        </span>
        <button
          class="icon close-icon"
          style="--bg: white; height: 1rem; width: 1rem"
          @click="showFeedbackAlert = false"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
