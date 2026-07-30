// Clawfrican — Pet schema (v2)
// Replace the existing schemaTypes/pet.js with this file.

export default {
  name: 'pet',
  title: 'Pets',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string',
      description: 'e.g. Luna', validation: r => r.required() },
    { name: 'breed', title: 'Breed', type: 'string',
      description: 'e.g. Persian (put the colour in the Colour field)', validation: r => r.required() },
    { name: 'colour', title: 'Colour', type: 'string',
      description: 'e.g. Blue, Golden, Banana morph yellow' },
    { name: 'category', title: 'Category', type: 'string',
      options: { list: [
        { title: 'Cat', value: 'cat' },
        { title: 'Bird', value: 'bird' },
        { title: 'Reptile', value: 'reptile' },
      ], layout: 'radio' },
      validation: r => r.required() },
    { name: 'sex', title: 'Sex', type: 'string',
      options: { list: ['Female', 'Male'], layout: 'radio' } },
    { name: 'age', title: 'Age', type: 'string', description: 'e.g. 5 months' },
    { name: 'price', title: 'Price', type: 'string', description: 'e.g. ₦650,000' },

    { name: 'status', title: 'Ready to go home (Status)', type: 'string',
      options: { list: [
        { title: '🟢 Available', value: 'available' },
        { title: '🟡 Reserved', value: 'reserved' },
        { title: '🔵 New Arrival', value: 'new-arrival' },
        { title: '🟣 Coming Soon (build hype before launch)', value: 'coming-soon' },
        { title: '⚫ Sold (hidden from site)', value: 'sold' },
      ], layout: 'radio' },
      initialValue: 'available',
      validation: r => r.required() },

    { name: 'featured', title: 'Show in "Featured Pets" on homepage?', type: 'boolean',
      initialValue: false },
    { name: 'staffPick', title: '⭐ Staff Pick', type: 'boolean',
      description: 'Shows a Staff Pick badge on this pet everywhere on the site.',
      initialValue: false },

    { name: 'photo', title: 'Main Photo', type: 'image', options: { hotspot: true } },
    { name: 'gallery', title: 'More Photos (gallery)', type: 'array',
      of: [ { type: 'image', options: { hotspot: true } } ],
      description: 'Tip: add photos one or two at a time (large batches can glitch the uploader).' },
    { name: 'videoUrl', title: 'Video link (optional)', type: 'url',
      description: 'YouTube / TikTok link for this pet.' },

    { name: 'tags', title: 'Personality tags', type: 'array',
      of: [{ type: 'string' }],
      options: { list: [
        'Good with kids', 'Good with other pets', 'Apartment friendly',
        'Beginner friendly', 'Quiet', 'Active', 'Hand raised', 'Tame',
      ] },
      description: 'Tick all that apply — these appear as tags on the pet page.' },

    { name: 'health', title: 'Health information', type: 'array',
      of: [{ type: 'string' }],
      options: { list: [
        'Vaccinated', 'Dewormed', 'DNA sexed', 'Microchipped', 'Vet certificate',
      ] },
      description: 'Tick everything this pet has.' },

    /* ---------- CAT-ONLY FIELDS ---------- */
    { name: 'litterTrained', title: 'Litter trained?', type: 'boolean',
      hidden: ({ document }) => document?.category !== 'cat' },
    { name: 'pedigree', title: 'Pedigree', type: 'string',
      description: 'e.g. Registered, Champion bloodline',
      hidden: ({ document }) => document?.category !== 'cat' },
    { name: 'coatType', title: 'Coat type', type: 'string',
      description: 'e.g. Long-haired, Rosetted',
      hidden: ({ document }) => document?.category !== 'cat' },

    /* ---------- BIRD-ONLY FIELDS ---------- */
    { name: 'vocabulary', title: 'Vocabulary', type: 'string',
      description: 'e.g. Says 3 words, learning more',
      hidden: ({ document }) => document?.category !== 'bird' },
    { name: 'handFed', title: 'Hand fed?', type: 'boolean',
      hidden: ({ document }) => document?.category !== 'bird' },
    { name: 'closedRing', title: 'Closed ring?', type: 'boolean',
      hidden: ({ document }) => document?.category !== 'bird' },

    /* ---------- REPTILE-ONLY FIELDS ---------- */
    { name: 'morph', title: 'Morph', type: 'string',
      description: 'e.g. Banana, Pied',
      hidden: ({ document }) => document?.category !== 'reptile' },
    { name: 'feedingSchedule', title: 'Feeding schedule', type: 'string',
      description: 'e.g. Frozen-thawed, weekly',
      hidden: ({ document }) => document?.category !== 'reptile' },
    { name: 'lastShed', title: 'Last shed', type: 'string',
      description: 'e.g. 2 weeks ago, clean shed',
      hidden: ({ document }) => document?.category !== 'reptile' },
    { name: 'origin', title: 'CB or WC', type: 'string',
      options: { list: [
        { title: 'Captive Bred (CB)', value: 'CB' },
        { title: 'Wild Caught (WC)', value: 'WC' },
      ], layout: 'radio' },
      hidden: ({ document }) => document?.category !== 'reptile' },

    { name: 'temperament', title: 'Temperament', type: 'string',
      description: 'e.g. Calm · Affectionate' },
    { name: 'diet', title: 'Diet', type: 'string',
      description: 'e.g. Premium wet & dry' },
    { name: 'story', title: 'About (personality story)', type: 'text', rows: 4,
      description: 'A short story about this individual pet — 2 to 4 sentences.' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'breed', media: 'photo', status: 'status', pick: 'staffPick' },
    prepare({ title, subtitle, media, status, pick }) {
      const dot = { available: '🟢', reserved: '🟡', 'new-arrival': '🔵', 'coming-soon': '🟣', sold: '⚫' }[status] || '🟢';
      return { title: `${dot}${pick ? ' ⭐' : ''} ${title}`, subtitle, media };
    },
  },
}
