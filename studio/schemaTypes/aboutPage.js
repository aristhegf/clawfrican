// Clawfrican — About Page schema
// Place at: schemaTypes/aboutPage.js
// Create ONE "About Page" document in the Studio and fill it in —
// the About page on the website reads everything from here.

export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    { name: 'headline', title: 'Headline', type: 'string',
      description: 'The big title. You can use <em>italic gold</em> around words, e.g.: The person behind <em>the paws.</em>' },
    { name: 'intro', title: 'Intro line', type: 'text', rows: 2,
      description: 'One striking opening sentence, shown large.' },
    { name: 'story', title: 'Your story', type: 'text', rows: 10,
      description: 'Write freely. Leave an empty line between paragraphs.' },
    { name: 'quote', title: 'Pull quote', type: 'string',
      description: 'A short line shown in gold-accented italics. No quotation marks needed.' },
    { name: 'portrait', title: 'Your portrait photo', type: 'image', options: { hotspot: true },
      description: 'A great photo of you (JPG). Portrait orientation works best.' },
    { name: 'caption', title: 'Photo caption', type: 'string',
      description: 'e.g. Founder, Clawfrican' },
    { name: 'signatureName', title: 'Signature name', type: 'string',
      description: 'Shown in the Clawfrican wordmark font, like a signature. e.g. Aris' },
    { name: 'role', title: 'Role line', type: 'string',
      description: 'e.g. Founder · Clawfrican' },
  ],
  preview: { prepare: () => ({ title: 'About Page' }) },
}
