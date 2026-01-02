<script setup lang="ts">

const props = defineProps<{
  switchState: boolean
  states: string[]
  icon: string
}>()

const emit = defineEmits(['stateChanged'])

</script>

<template>
  <div
    class="switch"
    :class="props.switchState ? 'checked' : 'unchecked'"
    @click="emit('stateChanged', !props.switchState)"
  >
    <div class="button">
      <span class="icon" :class="props.icon"></span>
    </div>
    <div class="button button-label">
      <span class="icon-text">{{ props.switchState ? props.states[0] : props.states[1] }}</span>
    </div>
  </div>
</template>

<style scoped>
.switch {
  --border-size: 2px;
  --bg: white;
  --bg-base: var(--bg);
  color: var(--bg);
  border: 2px solid var(--bg);
  border-radius: 100vw;
  height: 2.5rem;
  font-size: 1rem;
  display: inline-block;
  aspect-ratio: 2/1;
  position: relative;
  background: #00000030;
}

.switch.checked {
  --bg: #ffc04b;
}

.switch .button {
  height: 100%;
  position: absolute;
  transition: all 0.125s ease-in-out;
  translate: (0%);
  inset: 0 auto 0 0;
  --bg: var(--bg-base);
  z-index: 1;
}

.switch.checked .button {
  inset: 0 0 0 40px;
}

.switch .button-label {
  aspect-ratio: unset;
  background-color: transparent;
  pointer-events: none;
  color: var(--bg);
  z-index: 0;
}

.switch.checked .button-label {
  inset: 0 calc(100% - 40px) 0 0;
}

.switch.unchecked .button-label {
  inset: 0 0 0 calc(100% - 40px);
}

.switch .icon-text {
  font-size: 10px;
}
</style>
