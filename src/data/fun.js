import { findProject } from './projects'

// Popout collections for the Fun Stuff page. Clicking a tile opens the collection it belongs to:
// a Work project when the tile is one of that project's images, otherwise the Daily Design
// Challenge set (pieces that aren't part of a project).
const funFiles = import.meta.glob('../assets/fun/*/*.jpg', { eager: true, import: 'default' })
const funSrc = (key) => funFiles[`../assets/fun/${key}.jpg`]

// Fun tile ("row/number") → [project slug, image number] for tiles taken from a project.
const fromProject = {
  'a/01': ['poster-series', '03'], 'a/03': ['poster-series', '06'], 'a/05': ['poster-series', '05'],
  'a/07': ['poster-series', '07'], 'a/08': ['poster-series', '02'], 'a/09': ['poster-series', '04'],
  'b/06': ['suburbs', '03'], 'b/09': ['suburbs', '04'],
  'c/02': ['no-internet-cafe', '02'], 'c/03': ['nissan', '02'], 'c/04': ['apres-shred', '02'],
  'c/05': ['drop-water', '01'], 'c/06': ['no-internet-cafe', '05'], 'c/07': ['poster-series', '01'],
  'c/08': ['nissan', '01'], 'c/09': ['apres-shred', '01'],
}
// Every other tile, in the order they appear in the Daily Design Challenge collection.
const daily = ['a/04', 'a/06', 'b/07', 'b/05', 'b/03', 'a/02', 'b/01', 'b/02', 'b/04', 'b/08', 'c/01']

// Text beside the gallery. Replace the placeholders per collection (keyed by project slug, or 'daily').
const PLACEHOLDER = {
  brief: 'Placeholder. Who the project was for, what they needed and what success looked like.',
  process: 'Placeholder. How the idea developed: research, sketches, directions explored and the choices that shaped the final piece.',
  outcome: 'Placeholder. What was delivered, where it lives now and how it was received.',
}
const stories = {}
export const storyFor = (key) => ({ ...PLACEHOLDER, ...stories[key] })

const MAX = 8
// Up to eight images, always including the clicked one, keeping the collection's own order.
function windowAround(list, index) {
  const start = Math.max(0, Math.min(index - 3, list.length - MAX))
  const images = list.slice(start, start + MAX)
  return { images, index: index - start }
}

// `key` is the clicked tile, e.g. 'b/06'.
export function collectionFor(key) {
  const match = fromProject[key]
  if (match) {
    const p = findProject(match[0])
    const index = Math.max(0, p.images.findIndex((im) => im.key.endsWith(`/${match[1]}.jpg`)))
    return { key: p.slug, title: p.title, meta: [p.client, p.year].filter(Boolean).join(' · '), ...windowAround(p.images.map((im) => im.src), index) }
  }
  const list = daily.map(funSrc)
  return { key: 'daily', title: 'Daily Design Challenge', meta: 'Personal project · A design a day for 365 days', ...windowAround(list, Math.max(0, daily.indexOf(key))) }
}
