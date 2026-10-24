<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteNav from './components/SiteNav.vue'
import WorkWithMe from './components/WorkWithMe.vue'

// Fun Stuff fills the window exactly and never scrolls, so the page itself is locked there.
const route = useRoute()
watch(() => route.meta.locked, (locked) => {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}, { immediate: true })
</script>

<template>
  <a href="#main" class="label sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-3 focus:py-2 focus:text-black">Skip to content</a>
  <SiteNav />
  <!-- Bottom padding keeps the end of each page clear of the Work with me tab. -->
  <main id="main" :class="route.meta.locked ? '' : 'pb-16'">
    <RouterView />
  </main>
  <WorkWithMe />
</template>
