<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import FunPopout from '../components/FunPopout.vue'
import { collectionFor } from '../data/fun'

// Fun Stuff: the window is filled by three rows of images, all drifting left at slightly
// different speeds. The page never scrolls (App.vue locks it on this route). Each row's
// images are repeated once, and its position wraps by one copy's length, so it loops seamlessly.
// Rows can be dragged with the mouse or swiped on touch screens; letting go carries some
// momentum, then the row eases back into its drift. Hovering an image with the mouse freezes its
// row and magnifies the image, with its title over a dark gradient at the top. With reduced motion the rows only move when dragged. A click (or tap) that doesn't drag opens
// the tile's collection in a popout, and the rows stop drifting while it's open.
const files = import.meta.glob('../assets/fun/*/*.jpg', { eager: true, import: 'default' })
const rowOf = (r) => Object.entries(files).filter(([p]) => p.includes(`/fun/${r}/`)).sort(([a], [b]) => a.localeCompare(b))
  .map(([p, src]) => {
    const key = p.match(/fun\/(\w\/\d+)\.jpg$/)[1]
    return { src, key, title: collectionFor(key).title }
  })

const rows = [
  { images: rowOf('a'), dir: -1, speed: 90 },
  { images: rowOf('b'), dir: -1, speed: 110 },
  { images: rowOf('c'), dir: -1, speed: 100 },
]

const tracks = ref([])
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Per row: position, current velocity (px/s), loop length, and pointer state.
const state = rows.map(() => ({ x: 0, v: 0, loop: 0, drift: 0, dragging: false, hover: false, lastX: 0, lastT: 0, pointer: null, moved: 0, tile: null, releasedAt: -1e9 }))
const hovered = ref(null) // "row-index" of the image under the mouse
const open = ref(null) // the collection shown in the popout

// Loop length is the distance from the first image to its repeat, so it includes the gap.
function measure() {
  rows.forEach((row, i) => {
    const items = tracks.value[i]?.children
    if (!items?.length) return
    const s = state[i]
    s.loop = items[row.images.length].offsetLeft - items[0].offsetLeft
    s.drift = reduced ? 0 : (row.dir * s.loop) / row.speed
    if (!s.v && !s.dragging) s.v = s.drift
  })
}

const wrap = (x, loop) => (loop ? (((x % loop) - loop) % loop) : 0)

let frame, last
function tick(t) {
  const dt = Math.min((t - (last ?? t)) / 1000, 0.05)
  last = t
  state.forEach((s, i) => {
    if (!s.dragging) {
      // Hovering an image stops its row dead, unless the row was just flung and is still gliding.
      if (s.hover && t - s.releasedAt > 700) s.v = 0
      else {
        // Ease the velocity toward the drift (or to rest); this is the momentum decay.
        const target = s.hover || open.value ? 0 : s.drift
        s.v += (target - s.v) * (1 - Math.exp(-dt * 2.2))
      }
      s.x += s.v * dt
    }
    s.x = wrap(s.x, s.loop)
    const el = tracks.value[i]
    if (el) el.style.transform = `translate3d(${s.x}px,0,0)`
  })
  frame = requestAnimationFrame(tick)
}

function down(i, e) {
  if (e.button > 0) return
  const s = state[i]
  s.dragging = true
  s.pointer = e.pointerId
  s.lastX = e.clientX
  s.lastT = e.timeStamp
  s.v = 0
  s.moved = 0
  s.tile = e.target.closest('li')?.dataset.key ?? null
  e.currentTarget.setPointerCapture(e.pointerId)
}
function move(i, e) {
  const s = state[i]
  if (!s.dragging || e.pointerId !== s.pointer) return
  const dx = e.clientX - s.lastX
  const dt = Math.max((e.timeStamp - s.lastT) / 1000, 0.001)
  s.x += dx
  s.moved += Math.abs(dx)
  s.v = s.v * 0.6 + (dx / dt) * 0.4 // smoothed, so a release carries the flick's speed
  s.lastX = e.clientX
  s.lastT = e.timeStamp
}
function up(i, e) {
  const s = state[i]
  if (e.pointerId !== s.pointer) return
  s.dragging = false
  s.pointer = null
  s.releasedAt = performance.now()
  if (e.timeStamp - s.lastT > 80) s.v = 0 // held still before letting go: no fling
  s.v = Math.max(-3000, Math.min(3000, s.v))
  // Barely moved: treat it as a click on the tile under the pointer.
  if (e.type === 'pointerup' && s.moved < 6 && s.tile) { s.v = 0; show(s.tile) }
}
const show = (key) => { open.value = collectionFor(key) }
function hover(r, i, on, e) {
  if (e.pointerType !== 'mouse') return
  state[r].hover = on
  hovered.value = on ? `${r}-${i}` : null
}

onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
  frame = requestAnimationFrame(tick)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', measure)
})
</script>

<template>
  <h1 class="sr-only">Fun Stuff</h1>
  <div class="flex h-dvh animate-page-in flex-col gap-[clamp(6px,.7vw,10px)] overflow-hidden pt-16 pb-[calc(var(--tab-h)+clamp(6px,.7vw,10px))]">
    <!-- Drag hint under the nav: "click n' drag" with a mouse, "swipe" on phones. -->
    <p class="label flex shrink-0 items-center justify-center gap-3 pt-1 pb-1.5 text-[17px] leading-none md:text-[clamp(17px,1.6vw,21px)]">
      <span aria-hidden="true">&larr;</span><span class="md:hidden">Swipe</span><span class="hidden md:inline">Click n' drag</span><span aria-hidden="true">&rarr;</span>
    </p>
    <div
      v-for="(row, r) in rows"
      :key="r"
      class="row relative min-h-0 flex-1 cursor-grab select-none hover:z-10 active:cursor-grabbing"
      @pointerdown="down(r, $event)"
      @pointermove="move(r, $event)"
      @pointerup="up(r, $event)"
      @pointercancel="up(r, $event)"
    >
      <ul :ref="(el) => (tracks[r] = el)" class="flex h-full w-max gap-[clamp(6px,.7vw,10px)] will-change-transform">
        <li
          v-for="(img, i) in [...row.images, ...row.images]"
          :key="i"
          :data-key="img.key"
          class="tile relative h-full shrink-0 overflow-hidden rounded-md"
          :class="[['origin-top', 'origin-center', 'origin-bottom'][r], { 'is-hovered': hovered === `${r}-${i}` }]"
          :role="i < row.images.length ? 'button' : undefined"
          :tabindex="i < row.images.length ? 0 : -1"
          :aria-hidden="i >= row.images.length ? 'true' : undefined"
          :aria-label="i < row.images.length ? 'Open project gallery' : undefined"
          @keydown.enter.prevent="show(img.key)"
          @keydown.space.prevent="show(img.key)"
          @pointerenter="hover(r, i, true, $event)"
          @pointerleave="hover(r, i, false, $event)"
        >
          <img
            :src="img.src"
            alt=""
            class="pointer-events-none h-full w-auto"
            draggable="false"
            @load="measure"
          />
          <!-- While hovered: the title over a gradient at the top, and a prompt over one at the bottom. -->
          <div class="caption pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/75 via-black/30 to-transparent px-[clamp(10px,1vw,16px)] pt-[clamp(8px,.9vw,14px)] pb-10">
            <p class="label text-center text-paper">{{ img.title }}</p>
          </div>
          <div class="caption pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-[clamp(10px,1vw,16px)] pt-10 pb-[clamp(8px,.9vw,14px)]">
            <p class="label text-center text-paper">Click for more</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <FunPopout v-if="open" :collection="open" @close="open = null" />
</template>

<style scoped>
/* The rows handle horizontal swipes themselves; the page itself never scrolls here. */
.row { touch-action: none; -webkit-user-select: none; -webkit-touch-callout: none; }
/* Rows aren't clipped, so a magnified image can spill over its neighbours; the top row grows
   downward and the bottom row upward so nothing slips under the nav or off the screen. */
.tile { transition: transform .35s var(--ease-glide); }
.tile.is-hovered { transform: scale(1.15); z-index: 1; }
.caption { opacity: 0; transition: opacity .25s ease; }
.tile.is-hovered .caption { opacity: 1; }
</style>
