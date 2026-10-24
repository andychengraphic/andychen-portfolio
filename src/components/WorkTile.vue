<script setup>
import { computed } from 'vue'

// One project tile, after koto.com/work: the cover keeps (roughly) its own shape, and on hover
// the image lifts off the bottom edge to reveal the title and one-line summary underneath.
// On touch screens the text simply sits below the image.
const props = defineProps({
  project: { type: Object, required: true },
  eager: { type: Boolean, default: false },
})
const ratio = computed(() => Math.min(1.6, Math.max(0.75, props.project.cover?.ratio || 1)))
</script>

<template>
  <RouterLink :to="`/work/${project.slug}`" class="group block">
    <div class="relative" :style="{ aspectRatio: ratio }">
      <div class="absolute inset-x-0 top-0 z-[1] h-full overflow-hidden rounded-md bg-tile transition-[height] duration-200 ease-linear md:group-hover:h-[calc(100%-34px)] md:group-focus-visible:h-[calc(100%-34px)]">
        <img
          v-if="project.cover"
          :src="project.cover.src"
          :alt="`${project.title}: ${project.summary}`"
          :loading="eager ? 'eager' : 'lazy'"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-glide md:group-hover:scale-[1.02]"
        />
      </div>
      <div class="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[26px] items-end justify-between gap-4 md:flex" aria-hidden="true">
        <p class="truncate text-[14px] leading-none"><span class="font-display font-bold">{{ project.title }}</span><span class="text-mute"> &nbsp;{{ project.summary }}</span></p>
        <span class="text-[14px] leading-none">&#8599;</span>
      </div>
    </div>
    <div class="mt-3 flex items-start justify-between gap-4 md:hidden">
      <p class="text-[15px] leading-snug"><span class="block font-display font-bold">{{ project.title }}</span><span class="text-mute">{{ project.summary }}</span></p>
      <span aria-hidden="true">&#8599;</span>
    </div>
  </RouterLink>
</template>
