<script setup lang="ts">
import { ref, watch } from 'vue'

interface Node {
  id: string
  description: string
  next: Array<string | { condition: string; node: string }>
}

interface Flowchart {
  name: string
  nodes: Node[]
}

const flowchart: Flowchart = {
  name: 'BigFlowerBloomingFlow',
  nodes: [
    {
      id: 'start',
      description: 'Decide what colour+species of Big Flower you desire (e.g., a blue peony).',
      next: ['find_flower'],
    },
    {
      id: 'find_flower',
      description: 'Find a Big Flower that definitely has no flowers already planted around it.',
      next: ['check_radius'],
    },
    {
      id: 'check_radius',
      description:
        'Make certain that all flowers planted are within the Big Flower radius - check the big flower progress as you plant.',
      next: ['white_bloom_decision'],
    },
    {
      id: 'white_bloom_decision',
      description: 'Do you want a white bloom?',
      next: [
        {
          condition: 'Yes',
          node: 'white_chance',
        },
        {
          condition: 'No',
          node: 'plant_156_desired_colour',
        },
      ],
    },
    {
      id: 'white_chance',
      description:
        'You need to make a ??? bloom, which unfortunately can become any colour of the species. Multiple attempts increase chances of getting white.',
      next: ['plant_156_white_check'],
    },
    {
      id: 'plant_156_white_check',
      description: 'Can you plant 156 of the desired white species?',
      next: [
        {
          condition: 'Yes',
          node: 'plant_156_white',
        },
        {
          condition: 'No/Would prefer not to',
          node: 'alternative_no_white',
        },
      ],
    },
    {
      id: 'plant_156_white',
      description: 'Plant at least 156 of the desired white species.',
      next: ['finish_white_bloom'],
    },
    {
      id: 'finish_white_bloom',
      description:
        'Finish blooming the Big Flower using any petals you wish, but without exceeding 100 of any other colour.',
      next: [],
    },
    {
      id: 'plant_156_desired_colour',
      description: 'Can you plant 156 of the desired colour+species?',
      next: [
        {
          condition: 'Yes',
          node: 'plant_156_colour',
        },
        {
          condition: 'No/Would prefer not to',
          node: 'have_some_petals',
        },
      ],
    },
    {
      id: 'plant_156_colour',
      description: 'Plant at least 156 of the desired colour+species.',
      next: ['finish_any_petals'],
    },
    {
      id: 'finish_any_petals',
      description: 'Finish blooming the Big Flower using any other petals you wish to use.',
      next: [],
    },
    {
      id: 'have_some_petals',
      description:
        'Do you have some petals of the desired colour+species and one other petal colour of this species?',
      next: [
        {
          condition: 'Yes',
          node: 'plant_0_144_wrong_colour',
        },
        {
          condition: 'No',
          node: 'have_two_other_colours',
        },
      ],
    },
    {
      id: 'plant_0_144_wrong_colour',
      description: 'Plant 0-144 of the desired species but wrong colour. Do not exceed 144.',
      next: ['plant_desired_until_156'],
    },
    {
      id: 'plant_desired_until_156',
      description:
        'Plant the desired colour+species until at least 156/300 are planted around the Big Flower.',
      next: ['finish_with_desired_colour'],
    },
    {
      id: 'have_two_other_colours',
      description:
        'Do you have two other petal colours of this species, enough to plant 78 to 99 of both?',
      next: [
        {
          condition: 'Yes',
          node: 'plant_78_99_both',
        },
        {
          condition: 'No',
          node: 'plant_156_199_white',
        },
      ],
    },
    {
      id: 'plant_78_99_both',
      description:
        'Plant between 78 and 99 of both, therefore planting 156 to 198 of the variety you want. All numbers must be in these ranges.',
      next: ['finish_with_desired_colour'],
    },
    {
      id: 'plant_156_199_white',
      description: 'Can you plant 156 white petals of the desired species?',
      next: [
        {
          condition: 'Yes',
          node: 'finish_with_desired_colour',
        },
        {
          condition: 'No',
          node: 'no_guarantee',
        },
      ],
    },
    {
      id: 'finish_with_desired_colour',
      description:
        'Finish blooming with any petals that are the same colour that you desire the bloom to become.',
      next: [],
    },
    {
      id: 'no_guarantee',
      description:
        'No other way to guarantee the bloom you want. More petals can be obtained at random from mushrooms or blooming Big Flowers with normal nectar. Events and planting challenges may also offer what you need as a reward.',
      next: [],
    },
    {
      id: 'alternative_no_white',
      description: 'Can you plant 156 of the species without planting more than 100 of any colour?',
      next: [
        {
          condition: 'Yes',
          node: 'do_that',
        },
        {
          condition: 'No',
          node: 'no_guarantee',
        },
      ],
    },
    {
      id: 'do_that',
      description: 'Do that.',
      next: ['finish_with_any_white_petals'],
    },
    {
      id: 'finish_with_any_white_petals',
      description: 'Finish blooming the Big Flower using any white petals you wish to use.',
      next: [],
    },
  ],
}

const question = ref<string>('')
const answer = ref<number | null>(null)
const reachedEnd = ref(false)
const path = ref<string[]>([])

function resetFlowchart() {
  question.value = ''
  answer.value = null
  reachedEnd.value = false
  path.value = []
}

function askQuestion(_question: string) {
  answer.value = null
  question.value = _question

  return new Promise((resolve) => {
    const stop = watch(answer, (val) => {
      if (val !== null) {
        stop()
        resolve(val)
      }
    })
  })
}

function getNode(id: string): Node | undefined {
  return flowchart.nodes.find((n) => n.id === id)
}

async function traverse(nodeId: string) {
  const node = getNode(nodeId)
  if (!node) return

  // If reached end of flowchart
  if (!node.next || node.next.length === 0) {
    path.value.push(node.description)
    reachedEnd.value = true
    return
  }

  // If node has no choices
  if (node.next.length === 1 && typeof node.next[0] === 'string') {
    path.value.push(node.description)
    await traverse(node.next[0] as string)
    return
  }

  // If node has choices
  const choices = node.next as { condition: string; node: string }[]

  const result = await askQuestion(node.description)
  const index = result ? 0 : 1 // or however you map Yes/No

  await traverse(choices[index]!.node)
}
</script>

<template>
  <div class="question-section flex flex-col items-center">
    <div v-if="reachedEnd">
      <span class="text-white font-bold text-lg">Steps</span>
      <div class="flex flex-col bg-white rounded-lg p-4">
        <div v-for="(step, index) in path" :key="index">
          <div class="step bg-gray-200" :class="{ 'bg-blue-200': index === path.length - 1 }">
            {{ step }}
          </div>
          <div class="arrow" v-if="index < path.length - 1"></div>
        </div>
      </div>
    </div>
    <div v-else>
      <span class="text-white font-bold">{{ question }}</span>
      <div class="flex justify-center gap-4 p-4" v-if="question">
        <button class="button bg-green-500 text-white font-bold" @click="answer = 1">Yes</button>
        <button class="button bg-red-500 text-white font-bold" @click="answer = 0">No</button>
      </div>
      <button class="button bg-gray-100 text-black" v-else @click="traverse('start')">Start</button>
    </div>
    <button v-if="reachedEnd" class="button bg-gray-400 text-white mt-4" @click="resetFlowchart()">
      Reset
    </button>
  </div>
</template>

<style scoped>
.question-section {
  background: linear-gradient(135deg, #956bff 0%, #8a3cd8 100%);
  border-radius: 1rem;
  padding: 1rem;
}

.button {
  @apply rounded-full;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}

.step {
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.arrow {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 15px solid #000000;
  margin: 0 auto;
}
</style>
