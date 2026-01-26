<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { useAuthStore } from '@/stores/authStore'
import { signOut } from '@/service/authService'
import { ref } from 'vue'

const authStore = useAuthStore()

const showFeedbackAlert = ref<boolean>(true)

async function openPikminBloomApp() {
  const deepLink =
    'pikminbloom://com.nianticlabs.pikmin/com.nianticproject.ichigo.IchigoUnityPlayerActivity'
  let appStoreLink
  switch (getOS()) {
    case 'Android':
      appStoreLink = 'https://play.google.com/store/apps/details?id=com.nianticlabs.pikmin'
      break
    case 'iOS':
      appStoreLink = 'https://apps.apple.com/app/id1556357398'
      break
    default:
      appStoreLink = 'https://pikminbloom.com/'
  }
  let fallbackTriggered = false

  // If the page is still visible after the timeout, assume the app did not open
  const fallbackTimeout = setTimeout(() => {
    if (!fallbackTriggered && document.visibilityState === 'visible') {
      fallbackTriggered = true
      window.open(appStoreLink, '_blank')
    }
  }, 1500)

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      fallbackTriggered = true
      clearTimeout(fallbackTimeout)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Attempt to open the app
  window.location.href = deepLink
}

function getOS() {
  const userAgent = navigator.userAgent

  if (/android/i.test(userAgent)) {
    return 'Android'
  }

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'iOS'
  }

  return 'unknown'
}
</script>

<template>
  <div>
    <nav class="flex p-2 justify-center items-center bg-white px-4">
      <ul
        class="flex justify-center items-center gap-4 flex-wrap"
        style="width: 100%; max-width: 720px"
      >
        <li>
          <RouterLink to="/" class="flex items-center gap-2">
            <img src="/images/icons/logo.png" style="height: 3rem" />
            <h1 class="text-2xl font-bold">BloomCalendar</h1>
          </RouterLink>
        </li>
        <li v-if="/^Android|^iOS/.test(getOS())">
          <button class="big-button button-primary button-outline" @click="openPikminBloomApp()">
            <img src="https://pikminbloom.com/images/favicon.png" style="height: 2rem" alt="" />
            <span>Open Pikmin Bloom</span>
          </button>
        </li>
        <li>
          <a class="big-button button-primary button-outline" href="https://www.pikminwiki.com/">
            <img src="https://pikmin.wiki.gallery/images/c/c1/Wiki-icon.svg" style="height: 2rem" />
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
