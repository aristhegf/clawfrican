// Clawfrican — Testimonial schema
// Place at: schemaTypes/testimonial.js

export default {
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    { name: 'name', title: 'Customer name', type: 'string', validation: r => r.required() },
    { name: 'location', title: 'Location', type: 'string', description: 'e.g. Lagos, Abuja' },
    { name: 'quote', title: 'Review', type: 'text', rows: 3, validation: r => r.required() },
    { name: 'rating', title: 'Rating (1–5 stars)', type: 'number',
      initialValue: 5,
      validation: r => r.required().min(1).max(5) },
    { name: 'photo', title: 'Customer / pet photo (optional)', type: 'image', options: { hotspot: true } },
  ],
  preview: {
    select: { title: 'name', subtitle: 'location', media: 'photo' },
  },
}
