<script setup lang="ts">
import { onMounted } from 'vue'
import { signOut } from '@/service/authService'

onMounted(async () => {
  await signOut()
  window.location.href = '/'
})
</script>

<template>
  <div></div>
</template>

<style scoped></style>
