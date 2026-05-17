<script setup lang="ts">

const commitHash = __COMMIT_HASH__
const commitUrl =
  `${import.meta.env.VITE_GITHUB_REPO_URL}/commit/${commitHash}`
</script>

<template>
  <footer class="text-center p-4 text-sm bg-gradient-to-b from-green-200 to-white text-gray-700">
    &copy; 2025-{{ new Date().getFullYear() }} BloomCalendar • by
    <a class="underline font-bold" href="https://www.teunjojo.com/">teunjojo</a><br >
    Not affiliated with Nintendo or Niantic.
    <a class="underline float-right" :href=commitUrl>{{ commitHash }}</a>
  </footer>
</template>

<style scoped></style>
