<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

import { checkAuth } from '@/service/authService'


onMounted(async () => {
  checkAuth().catch(() => {
    // Not authenticated
  })
})
</script>

<template>
  <NavBar />
  <RouterView />
  <FooterComponent />
</template>

<style scoped></style>
