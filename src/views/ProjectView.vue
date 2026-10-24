<script setup>
import { computed, watchEffect } from 'vue'
import { projects, findProject } from '../data/projects'

const props = defineProps({ slug: { type: String, required: true } })
const project = computed(() => findProject(props.slug))
const next = computed(() => {
  const i = projects.findIndex((p) => p.slug === props.slug)
  return projects[(i + 1) % projects.length]
})
watchEffect(() => { if (project.value) document.title = `${project.value.title}, Andy Chen` })

// Very wide images run full width, everyday shapes sit two to a row, and tall phone-shaped ones three
// (two on phones), so a page of app screens reads as a strip rather than a long scroll.
// A project with a single image shows it full width.
const span = (r) => {
  if (project.value.images.length === 1 || r >= 1.7) return 'col-span-12'
  return r >= 0.62 ? 'col-span-12 md:col-span-6' : 'col-span-6 md:col-span-4'
}
</script>

<template>
  <article v-if="project" class="wrap pt-16">
    <header class="grid gap-8 pt-[clamp(40px,7vw,104px)] pb-[clamp(32px,4.6vw,64px)] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end md:gap-12">
      <div>
        <RouterLink to="/work" class="label text-mute transition-colors hover:text-paper">&#8592; All work</RouterLink>
        <h1 class="mt-5 text-[clamp(40px,6.4vw,104px)] leading-[.92] tracking-[-.025em] uppercase animate-rise">{{ project.title }}</h1>
      </div>
      <div class="animate-rise [animation-delay:.1s]">
        <p class="max-w-[52ch] text-[17px] leading-relaxed">{{ project.description }}</p>
        <dl class="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-4 text-[14px]">
          <div><dt class="label text-[10px] text-mute">Client</dt><dd class="mt-1">{{ project.client }}</dd></div>
          <div v-if="project.year"><dt class="label text-[10px] text-mute">Year</dt><dd class="mt-1">{{ project.year }}</dd></div>
          <div><dt class="label text-[10px] text-mute">Discipline</dt><dd class="mt-1">{{ project.tags.join(', ') }}</dd></div>
        </dl>
      </div>
    </header>

    <ul class="grid grid-cols-12 gap-[clamp(8px,.7vw,10px)]" aria-label="Project images">
      <li v-for="(img, i) in project.images" :key="img.key" :class="span(img.ratio)">
        <img
          :src="img.src"
          :alt="`${project.title}, image ${i + 1}`"
          :loading="i < 2 ? 'eager' : 'lazy'"
          class="h-full w-full rounded-md bg-tile object-cover"
          :style="{ aspectRatio: img.ratio }"
        />
      </li>
    </ul>

    <RouterLink :to="`/work/${next.slug}`" class="group mt-[clamp(64px,8vw,120px)] mb-10 flex items-end justify-between gap-6 border-t border-line pt-6">
      <span>
        <span class="label block text-mute">Next project</span>
        <span class="mt-2 block font-display text-[clamp(28px,4vw,56px)] leading-none font-bold tracking-[-.02em] uppercase">{{ next.title }}</span>
      </span>
      <span class="text-[clamp(28px,4vw,56px)] leading-none transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true">&#8594;</span>
    </RouterLink>
  </article>

  <section v-else class="wrap pt-40 pb-24">
    <h1 class="text-[clamp(36px,5vw,64px)] uppercase">Project not found</h1>
    <RouterLink to="/work" class="label mt-6 inline-block underline underline-offset-4">Back to work</RouterLink>
  </section>
</template>
