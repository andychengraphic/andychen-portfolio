<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// A white tab hanging from the top centre of the window (bottom corners rounded) holding the
// name and the page links, all in black. The current page sits on a black rounded rectangle
// with white text; on navigation the rectangle slides, with a little bounce, to the new item.
// The slide is a white-on-black copy of the links clipped to the rectangle, so the text inverts
// exactly where the rectangle is, even mid-slide.
const route = useRoute()
const items = [
  { label: 'Andy Chen', to: '/', aria: 'Andy Chen, home' },
  { label: 'About', to: { path: '/', hash: '#about' } },
  { label: 'Work', to: '/work' },
  { label: 'Fun Stuff', to: '/fun-stuff' },
]
// Home doubles as About: the name is current at the top of it, About once its link is used.
const active = computed(() => {
  if (route.path === '/') return route.hash === '#about' ? 1 : 0
  if (route.path.startsWith('/work')) return 2
  if (route.path === '/fun-stuff') return 3
  return -1
})

const nav = ref(null)
const links = ref([])
const HIDDEN = 'inset(50% 50% 50% 50% round 6px)'
const clip = ref(HIDDEN)
const hovered = ref(-1)
const animate = ref(false) // off for the first placement so the rectangle doesn't fly in

function place() {
  const el = links.value[active.value]?.$el
  const box = nav.value
  if (!el || !box) { clip.value = HIDDEN; return }
  const t = el.offsetTop, l = el.offsetLeft
  const r = box.offsetWidth - l - el.offsetWidth, b = box.offsetHeight - t - el.offsetHeight
  clip.value = `inset(${t}px ${r}px ${b}px ${l}px round 6px)`
}

watch(active, () => nextTick(place))
onMounted(async () => {
  place()
  window.addEventListener('resize', place)
  await document.fonts?.ready // widths change once the webfont arrives
  place()
  requestAnimationFrame(() => requestAnimationFrame(() => (animate.value = true)))
})
onBeforeUnmount(() => window.removeEventListener('resize', place))

// Every item matches the name's size; phones step it down so the tab fits. Items are evenly
// spaced: on phones and tablets the tab spans 80% of the width and they spread across it.
const itemClass = 'block rounded-md px-[clamp(4px,1.6vw,14px)] py-[clamp(8px,.75vw,11px)] font-display text-[clamp(11px,3.4vw,13px)] leading-none font-bold tracking-[.01em] whitespace-nowrap uppercase sm:text-[15px] md:text-[clamp(17px,1.6vw,21px)]'
</script>

<template>
  <header class="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-2">
    <nav ref="nav" class="pointer-events-auto relative w-[80vw] rounded-b-[12px] bg-paper p-1.5 text-black shadow-[0_6px_24px_rgba(0,0,0,.35)] lg:w-auto" aria-label="Main">
      <ul class="flex items-center justify-evenly lg:gap-[clamp(6px,1vw,16px)]">
        <li v-for="(it, i) in items" :key="it.label">
          <RouterLink
            :ref="(c) => (links[i] = c)"
            :to="it.to"
            :class="itemClass"
            class="transition-colors duration-200 hover:text-[#8a8a8a]"
            :aria-label="it.aria"
            :aria-current="active === i ? 'page' : undefined"
            @mouseenter="hovered = i"
            @mouseleave="hovered = -1"
          >{{ it.label }}</RouterLink>
        </li>
      </ul>
      <!-- The sliding rectangle: the same links in white on black, clipped to the current item.
           Rounded like the tab so the bounce can't poke a square corner out past its edge. -->
      <ul
        class="pointer-events-none absolute inset-0 flex items-center justify-evenly rounded-b-[12px] bg-black p-1.5 text-paper lg:gap-[clamp(6px,1vw,16px)]"
        :class="{ slide: animate }"
        :style="{ clipPath: clip }"
        aria-hidden="true"
      >
        <li v-for="(it, i) in items" :key="it.label">
          <span :class="[itemClass, hovered === i ? 'text-[#8a8a8a]' : '']" class="transition-colors duration-200">{{ it.label }}</span>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
/* Overshoots a touch past the target and settles back: the bounce. */
.slide { transition: clip-path .55s cubic-bezier(.34, 1.45, .55, 1); }
@media (prefers-reduced-motion: reduce) {
  .slide { transition: none; }
}
</style>
