import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const HomeView = () => import('../views/HomeView.vue')
const SavedView = () => import('../views/SavedView.vue')
const MyEpigramsView = () => import('../views/MyEpigramsView.vue')
const SettingsView = () => import('../views/SettingsView.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/saved', name: 'saved', component: SavedView },
  { path: '/my', name: 'my', component: MyEpigramsView },
  { path: '/settings', name: 'settings', component: SettingsView }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
