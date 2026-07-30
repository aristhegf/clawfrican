// Clawfrican — Site Settings schema
// Place at: schemaTypes/siteSettings.js
// Create ONE "Site Settings" document in the Studio and keep it updated —
// the website reads WhatsApp, email, Instagram and address from here.

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'whatsapp', title: 'WhatsApp number', type: 'string',
      description: 'International format, no + or leading 0. e.g. 2348031234567' },
    { name: 'email', title: 'Email address', type: 'string',
      description: 'e.g. hello@clawfrican.com' },
    { name: 'instagram', title: 'Instagram URL', type: 'url',
      description: 'e.g. https://instagram.com/clawfrican' },
    { name: 'tiktok', title: 'TikTok URL', type: 'url',
      description: 'e.g. https://tiktok.com/@clawfrican' },
    { name: 'address', title: 'Address / location line', type: 'string',
      description: 'e.g. Lagos · By appointment' },
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
}
