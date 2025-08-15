import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import DashboardView from '../views/DashboardView.vue'
import RequestFormView from '../views/RequestFormView.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'about',
    component: AboutView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:username',
    name: 'requestForm',
    component: RequestFormView
  },
  {
    path: '/dashboard/profile',
    name: 'profile',
    component: DashboardView,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      store.commit('dashboard/SET_ACTIVE_TAB', 'profile')
      next()
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    store.commit('auth/SET_SHOW_LOGIN_MODAL', true)
    next('/')
  } else {
    next()
  }
})

export default router
