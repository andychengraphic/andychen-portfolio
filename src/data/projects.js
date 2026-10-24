import ratios from './ratios.json'

// Every project's images live in src/assets/work/<slug>/01.jpg, 02.jpg, … in display order;
// 01 is the cover. ratios.json holds each image's width ÷ height so tiles can keep their shape.
const files = import.meta.glob('../assets/work/*/*.jpg', { eager: true, import: 'default' })
const images = {}
for (const [path, src] of Object.entries(files)) {
  const key = path.replace('../assets/', '')
  const slug = key.split('/')[1]
  ;(images[slug] ||= []).push({ src, ratio: ratios[key] || 1, key })
}
for (const list of Object.values(images)) list.sort((a, b) => a.key.localeCompare(b.key))

// Filters on the Work page, in order.
export const categories = ['Brand Identity', 'Advertising', 'Merch', 'Photography', 'App Design', 'Packaging']

// The order here is the order on the Work page. `summary` is the one line shown on the tile;
// `kind` separates client work from the Daily Design Challenge (a design a day for 365 days).
const list = [
  {
    slug: 'meal-prep-sunday-ads',
    title: 'Meal Prep Sunday',
    summary: 'Performance ads that sell the plate',
    client: 'Meal Prep Sunday',
    year: '2025',
    kind: 'Client',
    tags: ['Advertising'],
    description:
      'As the in-house designer and photographer at Meal Prep Sunday, I design and write performance ads for social, from fat-burner launches to head-to-head comparisons with the competition, alongside infographics, emails and web assets.',
  },
  {
    slug: 'be-human',
    title: 'Be Human Counseling',
    summary: 'A warmer identity for therapy',
    client: 'Be Human Counseling',
    year: '2023–',
    kind: 'Client',
    tags: ['Brand Identity'],
    description:
      'A full visual identity rebrand for a counseling practice: logo, colour, type and the imperfect dot, carried through a website redesign (behuman.life), business cards, posters and social graphics.',
  },
  {
    slug: 'viewarea',
    title: 'ViewArea',
    summary: '1,000+ designs for brands like the NFL',
    client: 'ViewArea LLC',
    year: '2023–24',
    kind: 'Client',
    tags: ['Merch'],
    description:
      'As the primary print designer for premium glass whiteboards, desk pads and signs, I produced over 1,000 custom designs in 12 months for clients including DHL, Chase, Northrop Grumman, Microsoft, Google, Pepsi Frito-Lay and the NFL, helping lift average order quantity two to five times.',
  },
  {
    slug: 'golden-spoon',
    title: 'Golden Spoon',
    summary: 'Merch and posters for a frozen yogurt shop',
    client: 'Golden Spoon Rancho Bernardo',
    year: '2020–',
    kind: 'Client',
    tags: ['Merch', 'Brand Identity'],
    description:
      'Ongoing design for a Golden Spoon frozen yogurt franchise: the Premium Full Service mark, staff uniforms and hoodies, social media, signage, menus and in-store posters.',
  },
  {
    slug: 'meal-prep-sunday-apps',
    title: 'Meal Prep Sunday Apps',
    summary: 'App Store screens for three apps',
    client: 'Meal Prep Sunday',
    year: '2025',
    kind: 'Client',
    tags: ['App Design'],
    description:
      'App Store listings for Meal Prep Sunday’s subscription app, its fitness and nutrition app and its delivery driver app, pairing product photography with clear feature callouts.',
  },
  {
    slug: 'alta-driving-school',
    title: 'Alta Driving School',
    summary: 'An identity built from road lines',
    client: 'Alta Driving School',
    year: '',
    kind: 'Client',
    tags: ['Brand Identity'],
    description:
      'A logo drawn from lane markings, carried through the student car wrap, a trifold brochure and business cards.',
  },
  {
    slug: 'meal-prep-sunday-photo',
    title: 'Meal Prep Sunday Photography',
    summary: 'Food, product and model shoots',
    client: 'Meal Prep Sunday',
    year: '2025',
    kind: 'Client',
    tags: ['Photography'],
    description:
      'Product listing, hero and lifestyle photography for Meal Prep Sunday, from overhead plate shots to influencer shoots for the AM & PM fat burners.',
  },
  {
    slug: 'pop-off',
    title: 'Pop Off',
    summary: 'Event merch',
    client: 'Pop Off',
    year: '',
    kind: 'Client',
    tags: ['Merch'],
    description: 'Event merch: shirts, foam trucker hats and drinkware.',
  },
  {
    slug: 'pawsbites',
    title: 'PawsBites',
    summary: 'Product photography for fresh dog food',
    client: 'PawsBites',
    year: '',
    kind: 'Client',
    tags: ['Photography'],
    description: 'Studio product photography for a fresh dog food brand: packaging flat lays, full containers and in-hand details.',
  },
  {
    slug: 'no-internet-cafe',
    title: 'No Internet Café',
    summary: 'A café where the Wi-Fi is the point',
    client: 'Daily Design Challenge, day 19',
    year: '2025',
    kind: 'Personal',
    tags: ['Brand Identity'],
    description: 'A brand for a café with no Wi-Fi, built around the offline dinosaur: A-frame sign, menu book, mug and tote.',
  },
  {
    slug: 'poster-series',
    title: 'Poster Series',
    summary: 'Cars, K-pop and cymatics',
    client: 'Daily Design Challenge',
    year: '2025',
    kind: 'Personal',
    tags: ['Advertising'],
    description: 'Posters from the Daily Design Challenge, one a day, exploring type, texture and image.',
  },
  {
    slug: 'apres-shred',
    title: 'Après Shred',
    summary: 'A ski brand in two languages',
    client: 'Daily Design Challenge, day 9',
    year: '2025',
    kind: 'Personal',
    tags: ['Brand Identity', 'Merch'],
    description: 'A bilingual ski brand set in Japanese and English, shown across apparel, a magazine cover and a catalog.',
  },
  {
    slug: 'suburbs',
    title: 'Suburbs',
    summary: 'Stuff for awesome people',
    client: 'Daily Design Challenge, day 16',
    year: '2025',
    kind: 'Personal',
    tags: ['Brand Identity', 'Merch'],
    description: 'A streetwear label with a heart: storefront sign, sign cubes, a five-panel cap and tees.',
  },
  {
    slug: 'nissan',
    title: 'Nissan',
    summary: 'A Japanese-language poster and mug',
    client: 'Daily Design Challenge, day 22',
    year: '2025',
    kind: 'Personal',
    tags: ['Advertising'],
    description: 'A poster and mug for Nissan built from a stacked, Japanese-language wordmark.',
  },
  {
    slug: 'drop-water',
    title: 'Drop',
    summary: 'Canned spring water',
    client: 'Daily Design Challenge, day 1',
    year: '2025',
    kind: 'Personal',
    tags: ['Packaging'],
    description: 'Can design for a spring water brand, set in a single bold word.',
  },
  {
    slug: 'lunar-alps-resort',
    title: 'Lunar Alps Resort',
    summary: 'Hotel key cards',
    client: 'Personal project',
    year: '2025',
    kind: 'Personal',
    tags: ['Brand Identity'],
    description: 'Key card design for an imagined alpine resort.',
  },
  {
    slug: 'socal-surfing',
    title: 'SoCal Surfing',
    summary: 'Billboard',
    client: 'Personal project',
    year: '2025',
    kind: 'Personal',
    tags: ['Advertising'],
    description: 'An out-of-home billboard for Southern California surfing.',
  },
]

export const projects = list.map((p) => ({ ...p, images: images[p.slug] || [], cover: (images[p.slug] || [])[0] }))
export const findProject = (slug) => projects.find((p) => p.slug === slug)
