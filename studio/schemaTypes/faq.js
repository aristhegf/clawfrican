// Clawfrican — FAQ schema
// Place at: schemaTypes/faq.js
// NOTE: the website ships with a full built-in FAQ already. You only need to
// add FAQ documents here if you want to change or add to those defaults —
// as soon as at least one FAQ exists in Sanity, the site shows Sanity's FAQs
// instead of the built-in ones.

export default {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string', validation: r => r.required() },
    { name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: r => r.required() },
    { name: 'category', title: 'Category', type: 'string',
      options: { list: [
        'About Our Pets', 'Reservations & Availability', 'Delivery',
        'Care', 'Payments', 'Trust & Ethics', 'Before Buying',
      ] },
      validation: r => r.required() },
    { name: 'order', title: 'Order', type: 'number',
      description: 'Lower numbers appear first.', initialValue: 100 },
  ],
  preview: { select: { title: 'question', subtitle: 'category' } },
}
