<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projects, categories } from '../data/projects'
import WorkTile from '../components/WorkTile.vue'

// Laid out like koto.com/work: a sticky column on the left (title, filters, a featured project)
// and a two-column masonry grid of tiles on the right. Phones get one column.
const route = useRoute()
const router = useRouter()
const filter = computed(() => (categories.includes(route.query.filter) ? route.query.filter : null))
const setFilter = (c) => router.replace({ query: c ? { filter: c } : {} })
const count = (c) => projects.filter((p) => p.tags.includes(c)).length
const shown = computed(() => (filter.value ? projects.filter((p) => p.tags.includes(filter.value)) : projects))

// Each tile goes into whichever column is currently shorter, so the two columns end close together.
const columns = computed(() => {
  const cols = [[], []]
  const heights = [0, 0]
  for (const p of shown.value) {
    const r = Math.min(1.6, Math.max(0.75, p.cover?.ratio || 1))
    const i = heights[0] <= heights[1] ? 0 : 1
    cols[i].push(p)
    heights[i] += 1 / r
  }
  return cols
})

const featured = projects[0]
</script>

<template>
  <div class="wrap animate-page-in pt-16 md:grid md:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] md:gap-[clamp(16px,1.6vw,24px)]">
    <aside class="md:sticky md:top-16 md:flex md:h-[calc(100dvh-64px)] md:flex-col md:pb-4">
      <div class="pt-[clamp(40px,6vw,72px)] pb-8 md:pt-[clamp(40px,5vh,72px)]">
        <h1 class="text-[clamp(40px,4.4vw,64px)] leading-[.95] tracking-[-.02em] uppercase">Work</h1>
        <p class="mt-3 max-w-[30ch] text-[17px] leading-snug text-mute">Brand identity, advertising, merch and photography, for clients and for fun.</p>
      </div>

      <nav aria-label="Filter projects">
        <ul class="flex flex-wrap gap-x-5 gap-y-1 md:flex-col md:gap-0">
          <li>
            <button type="button" class="filter" :aria-pressed="!filter" @click="setFilter(null)">
              <span class="dot" aria-hidden="true"></span>All <span class="ct">{{ projects.length }}</span>
            </button>
          </li>
          <li v-for="c in categories" :key="c">
            <button type="button" class="filter" :aria-pressed="filter === c" @click="setFilter(c)">
              <span class="dot" aria-hidden="true"></span>{{ c }} <span class="ct">{{ count(c) }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- Featured project card, pinned to the bottom of the column on desktop. -->
      <RouterLink
        :to="`/work/${featured.slug}`"
        class="group mt-auto hidden items-stretch gap-3 rounded-md bg-tile p-2 transition-colors duration-200 hover:bg-[#1c1c1c] md:flex"
      >
        <img :src="featured.cover.src" alt="" class="size-[76px] shrink-0 rounded-[3px] object-cover" />
        <div class="flex min-w-0 flex-1 flex-col py-0.5">
          <p class="flex items-start justify-between gap-2 text-[15px] leading-tight">
            <span class="truncate font-display font-bold">{{ featured.title }}</span>
            <span class="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">&#8599;</span>
          </p>
          <p class="truncate text-[14px] leading-tight text-mute">{{ featured.summary }}</p>
          <p class="label mt-auto text-[10px]">Latest</p>
        </div>
      </RouterLink>
    </aside>

    <section class="pt-6 pb-16 md:pt-4 md:pb-4" aria-label="Projects">
      <h2 class="sr-only">{{ filter || 'All projects' }}</h2>
      <!-- Phones: one column in list order. -->
      <ul class="grid gap-8 md:hidden">
        <li v-for="(p, i) in shown" :key="p.slug"><WorkTile :project="p" :eager="i < 2" /></li>
      </ul>
      <!-- Tablet and up: two balanced columns. -->
      <div class="hidden grid-cols-2 items-start gap-[clamp(8px,.7vw,10px)] md:grid">
        <ul v-for="(col, c) in columns" :key="c" class="grid gap-[clamp(8px,.7vw,10px)]">
          <li v-for="(p, i) in col" :key="p.slug"><WorkTile :project="p" :eager="i < 2" /></li>
        </ul>
      </div>
      <p v-if="!shown.length" class="py-20 text-mute">Nothing here yet.</p>
    </section>
  </div>
</template>

<style scoped>
.filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-block: 0.3rem;
  font-size: 17px;
  line-height: 1.3;
  color: var(--color-mute);
  cursor: pointer;
  transition: color 0.2s;
}
.filter:hover, .filter[aria-pressed='true'] { color: var(--color-paper); }
.dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0;
  margin-left: -12px;
  transition: opacity 0.2s;
}
.filter[aria-pressed='true'] .dot { opacity: 1; }
.ct { font-size: 12px; color: var(--color-mute); }
@media (max-width: 47.999rem) {
  .dot { display: none; }
  .filter[aria-pressed='true'] { text-decoration: underline; text-underline-offset: 5px; }
}
</style>
