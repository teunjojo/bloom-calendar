<script setup lang="ts"></script>

<template>
  <nav class="flex p-2 justify-center items-center bg-white px-4">
    <ul class="flex justify-between items-center gap-4" style="width: 100%; max-width: 720px">
      <li>
        <RouterLink to="/" class="flex items-center gap-2">
          <img src="/images/icons/logo.png" style="height: 3rem" />
          <h1 class="text-2xl font-bold">BloomCalendar</h1>
        </RouterLink>
      </li>
      <li><RouterLink to="/login" class="button">Login</RouterLink></li>
    </ul>
  </nav>
</template>

<style scoped>
.button {
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 100vw;
  text-decoration: none;
}

</style>
