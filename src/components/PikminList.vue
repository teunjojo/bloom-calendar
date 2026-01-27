<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  type: { type: String, required: true },
  overview: { type: String, required: false },
})

const pikminOverviewShow = ref(false)

const baseHeight = ref(32)
const canvasWidth = ref(32)

const coinCanvas = ref<HTMLCanvasElement>()

const baseImg = new Image()
const overlayImg = new Image()

const setupCoin = () => {
  if (!coinCanvas.value) return

  const ctx = coinCanvas.value.getContext('2d')

  if (!ctx) return

  baseImg.crossOrigin = 'anonymous'
  baseImg.src = `${import.meta.env.VITE_R2_BASE_URL}/images/coins/base.png`
  overlayImg.src = `${import.meta.env.VITE_R2_BASE_URL}/images/coins/${props.type}.png`

  let baseLoaded = false

  baseImg.onload = () => {
    baseLoaded = true
    drawCoin(ctx)
  }
  overlayImg.onload = () => {
    drawCoin(ctx)
    if (baseLoaded) drawCoin(ctx)
  }
}

const drawCoin = (ctx: CanvasRenderingContext2D) => {
  if (!coinCanvas.value) return
  const scale = baseHeight.value / baseImg.height
  const baseWidth = baseImg.width * scale

  const dpr = window.devicePixelRatio || 1
  canvasWidth.value = baseWidth

  coinCanvas.value.width = baseWidth * dpr
  coinCanvas.value.height = baseHeight.value * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  // draw base
  ctx.clearRect(0, 0, coinCanvas.value.width, coinCanvas.value.height)
  ctx.drawImage(baseImg, 0, 0, baseWidth, baseHeight.value)

  // scale overlay proportionally
  const overlayWidth = overlayImg.width * scale
  const overlayHeight = overlayImg.height * scale

  // center overlay
  const overlayX = (baseWidth - overlayWidth) / 2
  const overlayY = (baseHeight.value - overlayHeight) / 2

  ctx.drawImage(overlayImg, overlayX, overlayY, overlayWidth, overlayHeight)
}

onMounted(() => {
  setupCoin()
})
</script>

<template>
  <div class="bg-white rounded-lg p-2">
    <div class="flex items-center gap-2">
      <canvas
        ref="coinCanvas"
        :style="{ height: baseHeight + 'px', width: canvasWidth + 'px' }"
      ></canvas>
      <span class="font-bold text-amber-900">{{ props.name }}</span>
      <button
        v-if="overview && overview.length > 0"
        class="button button-pikmin-list"
        style="height: 1rem; width: 1rem"
        :class="pikminOverviewShow ? 'rotate-90' : 'rotate-0'"
        @click="pikminOverviewShow = !pikminOverviewShow"
      >
        <span class="icon forward-icon" style="height: 0.75rem; width: 0.75rem"></span>
      </button>
    </div>
    <span v-if="pikminOverviewShow" class="text-amber-950">{{ overview }}</span>
  </div>
</template>

<style scoped>
.button-pikmin-list {
  --bg: transparent;
  --color: theme(colors.amber.950);
  transition: 0.25s ease-out;
}
</style>
