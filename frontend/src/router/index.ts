import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/events',
    name: 'Events',
    component: () => import('@/views/EventsView.vue'),
  }],
})

export default router
