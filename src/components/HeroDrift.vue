<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Floating work samples for the home hero: three layers of rounded squares drifting left at
// different speeds. The nearest layer is large, fast and in focus; farther layers are smaller,
// slower, dimmer and increasingly out of focus, so the strip reads as depth.
// Positions are scattered at random on each visit, kept sparse by giving every image its own
// slot along the strip. Each layer is two identical copies of a strip one "tile" wide, and its
// position wraps by one tile, so the motion never jumps.
// The whole band can be dragged (mouse) or swiped sideways (touch). Each layer follows the
// pointer in proportion to its speed, so dragging keeps the parallax; letting go carries some
// momentum before the layers ease back into their drift. Vertical swipes still scroll the page.
const files = Object.values(import.meta.glob('../assets/hero/*.jpg', { eager: true, import: 'default' }))

const LAYERS = [
  { count: 10, size: 'clamp(46px,5.2vw,84px)', blur: 1.5, opacity: 0.6, seconds: 210 },
  { count: 7, size: 'clamp(70px,8.4vw,136px)', blur: 0.5, opacity: 0.8, seconds: 140 },
  { count: 4, size: 'clamp(104px,13vw,212px)', blur: 0, opacity: 0.95, seconds: 85 },
]
const FRONT = LAYERS[LAYERS.length - 1].seconds

const shuffled = [...files].sort(() => Math.random() - 0.5)
let next = 0
const rand = (a, b) => a + Math.random() * (b - a)

const layers = LAYERS.map((l) => {
  const slot = 100 / l.count
  const items = Array.from({ length: l.count }, (_, i) => ({
    src: shuffled[next++ % shuffled.length],
    x: (i + rand(0.15, 0.85)) * slot, // % across the tile, one image per slot
    y: rand(14, 86), // % down the band (image centre)
    float: rand(7, 12), // seconds per bob
    delay: -rand(0, 12),
    tilt: rand(-4, 4),
  }))
  // depth: how far this layer moves per pixel dragged (the front layer follows the pointer 1:1).
  return { ...l, items, depth: FRONT / l.seconds }
})

const tracks = ref([])
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const state = layers.map(() => ({ x: 0, loop: 0 }))
// Shared motion, in front-layer pixels per second; each layer scales it by its depth.
let v = 0, drift = 0, dragging = false, pointer = null, lastX = 0, lastT = 0, releasedAt = 0

function measure() {
  state.forEach((s, i) => { s.loop = tracks.value[i]?.firstElementChild?.offsetWidth || 0 })
  const front = state[state.length - 1].loop
  drift = reduced ? 0 : -front / FRONT
  if (!dragging && !releasedAt) v = drift
}

const wrap = (x, loop) => (loop ? (((x % loop) - loop) % loop) : 0)

let frame, last
function tick(t) {
  const dt = Math.min((t - (last ?? t)) / 1000, 0.05)
  last = t
  if (!dragging) v += (drift - v) * (1 - Math.exp(-dt * 2.2)) // momentum easing back to the drift
  layers.forEach((l, i) => {
    const s = state[i]
    if (!dragging) s.x += v * l.depth * dt
    s.x = wrap(s.x, s.loop)
    const el = tracks.value[i]
    if (el) el.style.transform = `translate3d(${s.x}px,0,0)`
  })
  frame = requestAnimationFrame(tick)
}

function down(e) {
  if (e.button > 0) return
  dragging = true
  pointer = e.pointerId
  lastX = e.clientX
  lastT = e.timeStamp
  v = 0
  e.currentTarget.setPointerCapture(e.pointerId)
}
function move(e) {
  if (!dragging || e.pointerId !== pointer) return
  const dx = e.clientX - lastX
  const dt = Math.max((e.timeStamp - lastT) / 1000, 0.001)
  layers.forEach((l, i) => { state[i].x += dx * l.depth })
  v = v * 0.6 + (dx / dt) * 0.4
  lastX = e.clientX
  lastT = e.timeStamp
}
function up(e) {
  if (e.pointerId !== pointer) return
  dragging = false
  pointer = null
  releasedAt = e.timeStamp
  if (e.timeStamp - lastT > 80) v = 0 // held still before letting go: no fling
  v = Math.max(-3000, Math.min(3000, v))
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
  <div
    class="drift absolute inset-0 cursor-grab overflow-hidden select-none active:cursor-grabbing"
    aria-hidden="true"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="up"
  >
    <div v-for="(layer, li) in layers" :key="li" class="pointer-events-none absolute inset-0" :style="{ zIndex: li }">
      <div :ref="(el) => (tracks[li] = el)" class="absolute inset-y-0 left-0 flex will-change-transform">
        <div v-for="copy in 2" :key="copy" class="tile relative h-full shrink-0">
          <div
            v-for="(it, i) in layer.items"
            :key="i"
            class="absolute"
            :style="{ left: `${it.x}%`, top: `${it.y}%`, width: layer.size, transform: 'translate(-50%, -50%)' }"
          >
            <div class="bob" :style="{ animationDuration: `${it.float}s`, animationDelay: `${it.delay}s`, '--tilt': `${it.tilt}deg` }">
              <img
                :src="it.src"
                alt=""
                class="block aspect-square w-full rounded-md object-cover"
                :style="{ opacity: layer.opacity, filter: layer.blur ? `blur(${layer.blur}px)` : undefined }"
                draggable="false"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* One tile is wider than the screen so repeats are never side by side; the edges fade out. */
.tile { width: max(170vw, 1400px); }
.drift {
  /* Horizontal swipes drag the band; vertical ones still scroll the page. */
  touch-action: pan-y;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, #000 72%, transparent);
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, #000 72%, transparent);
  mask-composite: intersect;
}
.bob { animation: bob ease-in-out infinite alternate; }
@keyframes bob {
  from { transform: translateY(-7px) rotate(var(--tilt)); }
  to { transform: translateY(7px) rotate(calc(var(--tilt) * -0.6)); }
}
@media (prefers-reduced-motion: reduce) {
  .bob { animation: none; }
}
</style>
