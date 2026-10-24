<script setup>
import { findProject } from '../data/projects'
import WorkTile from '../components/WorkTile.vue'
import HeroDrift from '../components/HeroDrift.vue'
import { openContact } from '../composables/contact'
import portrait from '../assets/andy.jpg'

// The home page doubles as the about page: intro, a few projects, then the about section
// (which the nav's "About" link scrolls to) and contact details.
const selected = ['meal-prep-sunday-ads', 'be-human', 'viewarea'].map(findProject)

const experience = [
  { role: 'Graphic Designer & Photographer', org: 'Meal Prep Sunday', when: '2025–now' },
  { role: 'Graphic Designer', org: 'Be Human Counseling', when: '2023–now' },
  { role: 'Graphic Designer', org: 'Golden Spoon Rancho Bernardo', when: '2020–now' },
  { role: 'In-House Graphic Designer', org: 'ViewArea', when: '2023–24' },
]
const capabilities = ['Brand identity', 'Advertising', 'Merch & print', 'Typography', 'Motion graphics', '3D design', 'Product photography', 'Lifestyle photography']
const clients = ['NFL', 'Microsoft', 'Google', 'Walmart', 'Chase', 'DHL', 'Pepsi Frito-Lay', 'Northrop Grumman', 'Volkswagen', 'Cummins']
const email = 'andychengraphic@gmail.com'
const phone = '1-224-678-6881'
</script>

<template>
  <!-- Intro -->
  <section class="wrap flex min-h-[78svh] flex-col md:min-h-[min(100svh,980px)] justify-end pt-16 pb-[clamp(40px,6vw,88px)]" aria-labelledby="h-intro">
    <!-- Drifting work samples fill the space above the headline, edge to edge. -->
    <div class="relative -mx-[clamp(16px,2.2vw,32px)] mb-[clamp(12px,2vw,28px)] min-h-[200px] flex-1 animate-[rise_1.6s_var(--ease-glide)_both]">
      <HeroDrift />
    </div>
    <p class="label animate-rise text-mute">Freelance graphic designer &amp; photographer</p>
    <h1 id="h-intro" class="mt-5 max-w-[15ch] animate-rise text-[clamp(44px,8.6vw,148px)] leading-[.9] tracking-[-.03em] uppercase [animation-delay:.08s]">
      Brands, ads &amp; merch people keep.
    </h1>
    <div class="mt-[clamp(28px,4vw,56px)] flex animate-rise flex-wrap items-center gap-x-8 gap-y-3 [animation-delay:.16s]">
      <RouterLink to="/work" class="label inline-flex min-h-12 items-center rounded-full bg-paper px-7 text-[13px] text-black transition-transform duration-200 hover:scale-[1.03]">See the work</RouterLink>
      <button type="button" class="label text-[13px] underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-70" aria-haspopup="dialog" @click="openContact">Start a project</button>
    </div>
  </section>

  <!-- Selected work -->
  <section class="wrap pb-[clamp(72px,10vw,160px)]" aria-labelledby="h-selected">
    <div class="mb-5 flex items-end justify-between gap-6 border-t border-line pt-5">
      <h2 id="h-selected" class="label">Selected work</h2>
      <RouterLink to="/work" class="label text-mute transition-colors hover:text-paper">All work &#8594;</RouterLink>
    </div>
    <ul class="grid gap-8 md:grid-cols-3 md:gap-[clamp(8px,.7vw,10px)]">
      <li v-for="p in selected" :key="p.slug"><WorkTile :project="{ ...p, cover: { ...p.cover, ratio: 0.8 } }" /></li>
    </ul>
  </section>

  <!-- About -->
  <section id="about" class="wrap pb-[clamp(72px,10vw,160px)]" aria-labelledby="h-about">
    <div class="border-t border-line pt-5">
      <h2 id="h-about" class="label">About</h2>
    </div>
    <div class="mt-[clamp(28px,4vw,56px)] grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-[clamp(32px,5vw,96px)]">
      <img :src="portrait" alt="Portrait of Andy Chen" class="aspect-square w-full max-w-[380px] rounded-md object-cover" loading="lazy" />
      <div>
        <p class="font-display text-[clamp(26px,3.2vw,48px)] leading-[1.08] font-bold tracking-[-.02em]">
          I’m Andy Chen.
        </p>
        <div class="mt-8 grid max-w-[70ch] gap-4 text-[17px] leading-relaxed text-[#cfcfcf] md:columns-2 md:gap-10">
          <p>I studied Art &amp; Design with a minor in Marketing at Utah Valley University. Since then I’ve rebranded a counseling practice, kept a frozen yogurt shop in fresh merch for six years, and designed more than a thousand custom products for companies like the NFL, Microsoft and Google.</p>
          <p class="mt-4 md:mt-0">Today I design and shoot for Meal Prep Sunday, and take on freelance identity, advertising, merch and photography projects on the side. I also speak Mandarin. Off the clock I’m working through a daily design challenge, a new piece every day for a year.</p>
        </div>
      </div>
    </div>

    <div class="mt-[clamp(48px,6vw,96px)] grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <h3 class="label text-mute">Experience</h3>
        <ul class="mt-4 divide-y divide-line border-y border-line">
          <li v-for="e in experience" :key="e.org" class="flex items-baseline justify-between gap-4 py-3 text-[15px] leading-snug">
            <span><span class="block font-display font-bold">{{ e.org }}</span><span class="text-mute">{{ e.role }}</span></span>
            <span class="shrink-0 text-mute tabular-nums">{{ e.when }}</span>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="label text-mute">Capabilities</h3>
        <ul class="mt-4 divide-y divide-line border-y border-line">
          <li v-for="c in capabilities" :key="c" class="py-2 text-[15px]">{{ c }}</li>
        </ul>
      </div>
      <div class="sm:col-span-2 lg:col-span-1">
        <h3 class="label text-mute">Brands I’ve designed for</h3>
        <ul class="mt-4 flex flex-wrap gap-2">
          <li v-for="c in clients" :key="c" class="rounded-full border border-line px-3.5 py-1.5 text-[14px]">{{ c }}</li>
        </ul>
        <h3 class="label mt-10 text-mute">Education</h3>
        <p class="mt-3 text-[15px] leading-snug">BA, Art &amp; Design, minor in Marketing<br /><span class="text-mute">Utah Valley University, 2024</span></p>
        <h3 class="label mt-8 text-mute">Certifications</h3>
        <ul class="mt-3 grid gap-3 text-[15px] leading-snug">
          <li>
            <a href="https://coursera.org/verify/professional-cert/2TCVEXRSVGU8" target="_blank" rel="noopener" class="underline decoration-line decoration-1 underline-offset-4 transition-colors hover:decoration-paper">Google IT Support Professional Certificate</a>
            <br /><span class="text-mute">Google, via Coursera, 2026</span>
          </li>
          <li>SEO and Inbound Marketing<br /><span class="text-mute">HubSpot Academy</span></li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <footer class="wrap pb-8" aria-labelledby="h-contact">
    <div class="border-t border-line pt-5">
      <h2 id="h-contact" class="label">Contact me directly</h2>
    </div>
    <a
      :href="`tel:+${phone.replace(/\D/g, '')}`"
      class="mt-[clamp(20px,3vw,40px)] block font-display text-[clamp(26px,6.2vw,104px)] leading-none font-bold tracking-[-.03em] break-words transition-opacity hover:opacity-70"
    >{{ phone }}</a>
    <a
      :href="`mailto:${email}`"
      class="mt-[clamp(12px,1.5vw,24px)] block font-display text-[clamp(26px,6.2vw,104px)] leading-none font-bold tracking-[-.03em] break-words transition-opacity hover:opacity-70"
    >{{ email }}</a>
    <div class="mt-[clamp(56px,8vw,120px)] flex flex-wrap items-center justify-between gap-4 text-[13px] text-mute">
      <p>&copy; {{ new Date().getFullYear() }} Andy Chen</p>
      <a href="#main" class="label hover:text-paper">Back to top &#8593;</a>
    </div>
  </footer>
</template>
