<script setup>
import { nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { contactOpen as open, contactOpener, openContact as show } from '../composables/contact'

// Persistent "Work with me" tab, the nav's mirror image: a white bar centred at the bottom of the
// window with its top corners rounded, styled like the nav items. It opens a contact form over a
// darkened page. Messages are emailed through FormSubmit (formsubmit.co), which needs no server;
// the first message ever sent triggers a one-time activation email to this address.
const EMAIL = 'andychengraphic@gmail.com'

const status = ref('idle') // idle | sending | sent | error
const form = reactive({ name: '', email: '', subject: '', message: '', honey: '' })
const first = ref(null)
let prevOverflow = ''

function close() {
  open.value = false
}

function onKey(e) {
  if (e.key === 'Escape') close()
}

// While open: the page behind can't scroll, Esc closes, focus moves into the form and back after.
watch(open, async (isOpen) => {
  if (isOpen) {
    prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    await nextTick()
    first.value?.focus()
  } else {
    document.documentElement.style.overflow = prevOverflow
    window.removeEventListener('keydown', onKey)
    contactOpener?.focus?.()
    if (status.value === 'sent') {
      Object.assign(form, { name: '', email: '', subject: '', message: '' })
      status.value = 'idle'
    }
  }
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

async function submit() {
  if (form.honey) return // filled in by a bot
  status.value = 'sending'
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `Work with me: ${form.subject}`,
        _template: 'table',
        _captcha: 'false',
        _replyto: form.email,
        Name: form.name,
        Email: form.email,
        Subject: form.subject,
        Project: form.message,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || 'failed')
    status.value = 'sent'
  } catch {
    status.value = 'error'
  }
}

const tabText = 'block rounded-md px-[clamp(10px,1.4vw,18px)] py-[clamp(8px,.75vw,11px)] font-display text-[clamp(11px,3.4vw,13px)] leading-none font-bold tracking-[.01em] whitespace-nowrap uppercase transition-colors duration-200 hover:text-[#8a8a8a] sm:text-[15px] md:text-[clamp(17px,1.6vw,21px)]'
const field = 'mt-1 block w-full border-b border-[#cfcfcf] bg-transparent py-2.5 text-[17px] text-black transition-colors placeholder:text-[#9a9a9a] focus:border-black focus:outline-none'
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-2">
    <button
      type="button"
      class="pointer-events-auto rounded-t-[12px] bg-paper p-1.5 text-black shadow-[0_-6px_24px_rgba(0,0,0,.35)]"
      aria-haspopup="dialog"
      @click="show"
    >
      <span :class="tabText">Work with me</span>
    </button>
  </div>

  <Teleport to="body">
    <Transition name="wwm">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wwm-title"
        @click.self="close"
      >
        <div class="panel relative max-h-[calc(100dvh-2rem)] w-full max-w-[480px] overflow-y-auto rounded-[12px] bg-paper p-[clamp(22px,4vw,36px)] text-black shadow-[0_20px_60px_rgba(0,0,0,.5)]">
          <button
            type="button"
            class="absolute top-3 right-3 grid size-10 place-items-center rounded-full text-[18px] transition-colors hover:text-[#8a8a8a]"
            aria-label="Close"
            @click="close"
          >&#x2715;</button>

          <h2 id="wwm-title" class="font-display text-[clamp(26px,3vw,34px)] leading-none font-bold tracking-[-.01em] uppercase">Work with me</h2>

          <div v-if="status === 'sent'" class="mt-6" role="status">
            <p class="text-[17px] leading-relaxed">Thanks, {{ form.name.split(' ')[0] }}. Your message is on its way and I'll get back to you at {{ form.email }}.</p>
            <button type="button" class="mt-8 min-h-12 rounded-full bg-black px-7 font-display text-[14px] font-bold tracking-[.06em] text-paper uppercase transition-opacity hover:opacity-80" @click="close">Close</button>
          </div>

          <form v-else class="mt-6 grid gap-5" @submit.prevent="submit">
            <label class="block">
              <span class="label text-[#6b6b6b]">Name</span>
              <input ref="first" v-model.trim="form.name" :class="field" autocomplete="name" required />
            </label>
            <label class="block">
              <span class="label text-[#6b6b6b]">Email</span>
              <input v-model.trim="form.email" type="email" :class="field" autocomplete="email" required />
            </label>
            <label class="block">
              <span class="label text-[#6b6b6b]">Subject</span>
              <input v-model.trim="form.subject" :class="field" placeholder="Brand identity, ads, merch, photography…" required />
            </label>
            <label class="block">
              <span class="label text-[#6b6b6b]">Your project</span>
              <textarea
                v-model.trim="form.message"
                rows="4"
                :class="field"
                class="resize-y leading-relaxed"
                placeholder="What you're making, who it's for, timeline and budget"
                required
              ></textarea>
            </label>
            <!-- Hidden from people; bots fill it in. -->
            <input v-model="form.honey" type="text" name="_honey" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />

            <div class="mt-2">
              <button
                type="submit"
                class="min-h-12 w-full rounded-full bg-black px-7 font-display text-[14px] font-bold tracking-[.06em] text-paper uppercase transition-opacity hover:opacity-80 disabled:opacity-40 sm:w-auto"
                :disabled="status === 'sending'"
              >{{ status === 'sending' ? 'Sending…' : 'Submit' }}</button>
              <p v-if="status === 'error'" class="mt-4 text-[15px] text-[#6b6b6b]" role="alert">
                That didn't go through. Please try again, or email
                <a :href="`mailto:${EMAIL}`" class="underline underline-offset-4">{{ EMAIL }}</a>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.wwm-enter-active, .wwm-leave-active { transition: opacity .25s ease; }
.wwm-enter-active .panel, .wwm-leave-active .panel { transition: transform .35s var(--ease-glide), opacity .25s ease; }
.wwm-enter-from, .wwm-leave-to { opacity: 0; }
.wwm-enter-from .panel, .wwm-leave-to .panel { opacity: 0; transform: translateY(14px) scale(.985); }
</style>
