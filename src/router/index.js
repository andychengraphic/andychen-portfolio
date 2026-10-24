import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Andy Chen, Graphic Designer' } },
  { path: '/work', name: 'work', component: () => import('../views/WorkView.vue'), meta: { title: 'Work, Andy Chen' } },
  { path: '/work/:slug', name: 'project', component: () => import('../views/ProjectView.vue'), props: true },
  { path: '/fun-stuff', name: 'fun', component: () => import('../views/FunView.vue'), meta: { title: 'Fun Stuff, Andy Chen', locked: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // "About" is a section of the home page, so /#about scrolls to it; everything else starts at the top.
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 72 }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  if (to.meta.title) document.title = to.meta.title
})

export default router
