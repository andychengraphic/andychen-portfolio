import { ref } from 'vue'

// Shared open/closed state for the Work with me form, so any button on the site can open it.
export const contactOpen = ref(false)
export let contactOpener = null

export function openContact() {
  contactOpener = document.activeElement
  contactOpen.value = true
}
