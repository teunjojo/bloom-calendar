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
      description: 'Do you want a white bloom?',
      next: [
        {
          condition: 'Yes',
          node: 'info_white_unforceable',
        },
        {
          condition: 'No',
          node: 'q_have_156_desired_colour',
        },
      ],
    },
    {
      id: 'info_white_unforceable',
      description:
        'There is no way to force white blooms. The color is picked based on odds unique to the species.',
      next: ['q_have_156_white_species'],
    },
    {
      id: 'q_have_156_white_species',
      description: 'Can you plant 156 of the desired white species?',
      next: [
        {
          condition: 'Yes',
          node: 'a_plant_156_white_species',
        },
        {
          condition: 'No',
          node: 'q_alt_no_white_limit',
        },
      ],
    },
    {
      id: 'a_plant_156_white_species',
      description: 'Plant at least 156 of the desired white species.',
      next: ['end_finish_white_limited'],
    },
    {
      id: 'end_finish_white_limited',
      description:
        'Finish blooming by using petals of any color or species, but without exceeding 100 of any other color.',
      next: [],
    },
    {
      id: 'q_have_156_desired_colour',
      description: 'Can you plant 156 petals of the desired color+species?',
      next: [
        {
          condition: 'Yes',
          node: 'a_plant_156_desired_colour',
        },
        {
          condition: 'No',
          node: 'q_have_partial_and_other_colour',
        },
      ],
    },
    {
      id: 'a_plant_156_desired_colour',
      description: 'Plant at least 156 petals of the desired color+species.',
      next: ['end_finish_any_petals'],
    },
    {
      id: 'end_finish_any_petals',
      description: 'Finish blooming by using petals of any color or species',
      next: [],
    },
    {
      id: 'q_have_partial_and_other_colour',
      description:
        'Can you plant some petals of the desired color+species and one other petal color of this species?',
      next: [
        {
          condition: 'Yes',
          node: 'a_plant_wrong_colour_limited',
        },
        {
          condition: 'No',
          node: 'q_have_two_other_colours',
        },
      ],
    },
    {
      id: 'a_plant_wrong_colour_limited',
      description: 'Plant 0-144 of the desired species but wrong color. Do not exceed 144.',
      next: ['a_plant_desired_until_156'],
    },
    {
      id: 'a_plant_desired_until_156',
      description:
        'Plant the desired color+species until the Big Flower has at least 156/300 flowers planted.',
      next: ['end_finish_with_desired_colour'],
    },
    {
      id: 'q_have_two_other_colours',
      description:
        'Can you plant between 78-99 petals of each of two other colors of this species?',
      next: [
        {
          condition: 'Yes',
          node: 'a_plant_two_colours_balanced',
        },
        {
          condition: 'No',
          node: 'q_have_156_white_petals',
        },
      ],
    },
    {
      id: 'a_plant_two_colours_balanced',
      description:
        'Plant between 78-99 of both, therefore planting 156-198 total of the species you want. All numbers must be in these ranges.',
      next: ['end_finish_with_desired_colour'],
    },
    {
      id: 'q_have_156_white_petals',
      description: 'Can you plant at least 156 white petals of the desired species?',
      next: [
        {
          condition: 'Yes',
          node: 'a_plant_156-199_white_species',
        },
        {
          condition: 'No',
          node: 'end_no_guarantee',
        },
      ],
    },
    {
      id: 'a_plant_156-199_white_species',
      description: 'Plant 156-199 white petals of the desired species. Do not exceed 199',
      next: ['end_finish_with_desired_colour'],
    },
    {
      id: 'end_finish_with_desired_colour',
      description: 'Finish blooming by using the desired color petals of any species',
      next: [],
    },
    {
      id: 'end_no_guarantee',
      description:
        'There is no way to force the bloom you want. More petals can be obtained by blooming Big Flowers with normal petals or destroying mushrooms. Events and planting challenges may also offer what you need as a reward.',
      next: [],
    },
    {
      id: 'q_alt_no_white_limit',
      description:
        'Can you plant 156 petals of the species without planting more than 100 of any color?',
      next: [
        {
          condition: 'Yes',
          node: 'a_plant_species_color_limited',
        },
        {
          condition: 'No',
          node: 'end_no_guarantee',
        },
      ],
    },
    {
      id: 'a_plant_species_color_limited',
      description: 'Plant 156 of the desired species, without planting more than 100 of any color.',
      next: ['end_finish_with_any_white'],
    },
    {
      id: 'end_finish_with_any_white',
      description: 'Finish blooming by using white petals of any species.',
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
        <button class="big-button button-green" @click="answer = 1">Yes</button>
        <button class="big-button button-red" @click="answer = 0">No</button>
      </div>
      <button class="big-button" v-else @click="traverse('start')">Start</button>
    </div>
    <button v-if="reachedEnd" class="big-button mt-4" @click="resetFlowchart()">Reset</button>
  </div>
</template>

<style scoped>
.question-section {
  background: linear-gradient(135deg, #956bff 0%, #8a3cd8 100%);
  border-radius: 1rem;
  padding: 1rem;
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
