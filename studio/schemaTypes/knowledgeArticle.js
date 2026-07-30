// Clawfrican — Knowledge Base schema
// Place at: schemaTypes/knowledgeArticle.js
// Add articles in the Studio ("Knowledge Base") and the AI consultant
// automatically uses them — no code changes ever needed.
// Scales to hundreds of articles: the AI only reads the ones relevant
// to each conversation.

export default {
  name: 'knowledgeArticle',
  title: 'Knowledge Base',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string',
      description: 'e.g. "African Grey care basics", "Persian grooming guide", "Our reservation policy"',
      validation: r => r.required() },
    { name: 'category', title: 'Category', type: 'string',
      options: { list: [
        'Species Profile', 'Care Guide', 'Feeding & Nutrition', 'Housing & Enclosures',
        'Health & Vet', 'Behaviour & Training', 'Beginner Advice', 'Clawfrican Policies',
        'Common Myths', 'FAQ',
      ] },
      validation: r => r.required() },
    { name: 'tags', title: 'Search tags', type: 'array', of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Words customers might use: e.g. african grey, parrot, talking, noise, apartment. The AI finds this article through these.',
      validation: r => r.required().min(2) },
    { name: 'content', title: 'Content', type: 'text', rows: 12,
      description: 'Write the expertise here in plain language. The AI treats this as authoritative Clawfrican knowledge — more trusted than its general knowledge.',
      validation: r => r.required() },
    { name: 'priority', title: 'Priority', type: 'number', initialValue: 5,
      description: '1–10. Higher = preferred when several articles match (e.g. policies should be 10).' },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
}
