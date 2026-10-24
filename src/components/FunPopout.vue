<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { storyFor } from '../data/fun'

// Popout for a Fun Stuff collection: the page darkens behind it, the text (brief, process,
// outcome) sits on the left and the gallery on the right, with up to eight thumbnails in two
// rows of four that switch the big image. Esc, the close button or a click outside closes it;
// the arrow keys step through the images.
const props = defineProps({ collection: { type: Object, required: true } })
const emit = defineEmits(['close'])

const current = ref(props.collection.index)
const story = computed(() => storyFor(props.collection.key))
const sections = computed(() => [
  ['Brief', story.value.brief],
  ['Process', story.value.process],
  ['Outcome', story.value.outcome],
])

const closeBtn = ref(null)
const opener = document.activeElement

function onKey(e) {
  const n = props.collection.images.length
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowRight') current.value = (current.value + 1) % n
  else if (e.key === 'ArrowLeft') current.value = (current.value - 1 + n) % n
}
onMounted(() => {
  window.addEventListener('keydown', onKey)
  nextTick(() => closeBtn.value?.focus())
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  opener?.focus?.()
})
</script>

<template>
  <div
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-[clamp(12px,3vw,40px)] backdrop-blur-sm animate-[fun-fade_.25s_ease-out]"
    role="dialog"
    aria-modal="true"
    :aria-label="collection.title"
    @click.self="emit('close')"
  >
    <div class="relative grid max-h-full w-full max-w-[1320px] gap-[clamp(20px,3vw,48px)] overflow-y-auto rounded-md border border-line bg-black p-[clamp(18px,2.6vw,40px)] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:overflow-hidden animate-[fun-pop_.35s_var(--ease-glide)]">
      <button
        ref="closeBtn"
        type="button"
        class="label absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full bg-black/60 text-[18px] transition-opacity hover:opacity-70"
        aria-label="Close"
        @click="emit('close')"
      >&#x2715;</button>

      <!-- Text: on phones it follows the gallery. -->
      <div class="order-2 flex min-h-0 flex-col md:order-1 md:overflow-y-auto md:pr-2">
        <h2 class="text-[clamp(26px,2.6vw,40px)] leading-[1.02] tracking-[-.02em] uppercase">{{ collection.title }}</h2>
        <p class="mt-2 text-[14px] text-mute">{{ collection.meta }}</p>
        <section v-for="[label, text] in sections" :key="label" class="mt-6 border-t border-line pt-4 first-of-type:mt-8">
          <h3 class="label text-mute">{{ label }}</h3>
          <p class="mt-2 text-[15px] leading-relaxed text-[#cfcfcf]">{{ text }}</p>
        </section>
      </div>

      <!-- Gallery: big image, then up to eight thumbnails in two rows of four. -->
      <div class="order-1 flex min-h-0 flex-col md:order-2">
        <div class="grid min-h-0 flex-1 place-items-center rounded-md bg-tile">
          <img
            :key="current"
            :src="collection.images[current]"
            :alt="`${collection.title}, image ${current + 1} of ${collection.images.length}`"
            class="block max-h-[min(58vh,720px)] w-auto max-w-full rounded-md object-contain animate-[fun-fade_.3s_ease-out]"
          />
        </div>
        <ul v-if="collection.images.length > 1" class="mt-[clamp(8px,.8vw,12px)] grid grid-cols-4 gap-[clamp(6px,.7vw,10px)]">
          <li v-for="(src, i) in collection.images" :key="i">
            <button
              type="button"
              class="block w-full overflow-hidden rounded-md transition-opacity duration-200"
              :class="i === current ? 'opacity-100 outline outline-1 outline-offset-2 outline-paper' : 'opacity-45 hover:opacity-80'"
              :aria-label="`Show image ${i + 1}`"
              :aria-current="i === current ? 'true' : undefined"
              @click="current = i"
            >
              <img :src="src" alt="" class="block aspect-[4/3] w-full object-cover md:h-[min(7vh,76px)] md:aspect-auto" loading="lazy" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
/* Global (not scoped) so the Tailwind animate-[…] classes above can find them. */
@keyframes fun-fade { from { opacity: 0; } }
@keyframes fun-pop { from { opacity: 0; transform: translateY(14px) scale(.985); } }
</style>
