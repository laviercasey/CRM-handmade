import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import AboutView from '@/pages/about/'
import DashboardView from '@/pages/dashboard/'
import RequestFormView from '@/pages/request-form/'
import store from '@/shared/store'

const routes: RouteRecordRaw[] = [
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
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      store.commit('dashboard/SET_ACTIVE_TAB', 'profile')
      next()
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  
  if (to.matched.some(record => record.meta?.requiresAuth) && !isAuthenticated) {
    store.commit('auth/SET_SHOW_LOGIN_MODAL', true)
    next('/')
  } else {
    next()
  }
})

export default router