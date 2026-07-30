// Clawfrican — Care Guide / Article schema
// Place at: schemaTypes/guide.js
// Rich blog-style articles for the Care Resources section.
// Staff write these in the Studio with headings, bold, lists, and images.

export default {
  name: 'guide',
  title: 'Care Guides',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string',
      description: 'e.g. "How to groom a Persian cat"',
      validation: r => r.required() },
    { name: 'slug', title: 'URL slug', type: 'slug',
      options: { source: 'title', maxLength: 80 },
      description: 'Tap "Generate" — this becomes the guide\'s shareable link.',
      validation: r => r.required() },
    { name: 'category', title: 'For which pets?', type: 'string',
      options: { list: [
        { title: 'Cats', value: 'cat' },
        { title: 'Birds', value: 'bird' },
        { title: 'Reptiles', value: 'reptile' },
        { title: 'General', value: 'general' },
      ], layout: 'radio' },
      description: 'Shows as the card label, e.g. "Guide · Cats".',
      validation: r => r.required() },
    { name: 'excerpt', title: 'Short summary', type: 'text', rows: 2,
      description: 'One or two sentences shown on the guide card and at the top of the article.',
      validation: r => r.required() },
    { name: 'cover', title: 'Cover image', type: 'image', options: { hotspot: true },
      description: 'The main image (JPG). Shown on the card and as the article header.' },
    { name: 'readTime', title: 'Read time (minutes)', type: 'number',
      description: 'Optional, e.g. 4. Shown as "4 min read".' },
    { name: 'body', title: 'Article body', type: 'array',
      of: [
        { type: 'block' },                                  // headings, paragraphs, bold, lists, links
        { type: 'image', options: { hotspot: true } },      // inline images between paragraphs
      ],
      description: 'Write the full guide here. Use the style menu for Heading 2/3, bold, bullet lists, and drop in images.',
      validation: r => r.required() },
    { name: 'featured', title: 'Feature on homepage Care Resources?', type: 'boolean',
      initialValue: false,
      description: 'Ticked guides appear in the homepage Care Resources strip.' },
    { name: 'publishedAt', title: 'Published date', type: 'datetime',
      description: 'Controls ordering — newest guides appear first.',
      initialValue: () => new Date().toISOString() },
  ],
  orderings: [
    { title: 'Newest first', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', category: 'category', media: 'cover' },
    prepare({ title, category, media }) {
      const label = { cat: 'Cats', bird: 'Birds', reptile: 'Reptiles', general: 'General' }[category] || '';
      return { title, subtitle: label ? `Guide · ${label}` : 'Guide', media };
    },
  },
}
