export const SITE_SETTINGS_QUERY = `*[_type=="siteSettings"][0]{
  whatsapp, email, instagram, tiktok, address
}`;

export const FEATURED_PETS_QUERY = `*[_type=="pet" && featured==true && status!="sold"] | order(_createdAt desc)[0...3]{
  _id, name, breed, colour, category, sex, age, price, status, staffPick,
  photo, tags
}`;

export const ALL_PETS_QUERY = `*[_type=="pet" && status!="sold"] | order(_createdAt desc){
  _id, name, breed, colour, category, sex, age, price, status, staffPick,
  photo, tags
}`;

export const PET_BY_SLUG_QUERY = `*[_type=="pet"]{
  _id, name, breed, colour, category, sex, age, price, status, staffPick,
  photo, gallery, videoUrl, tags, health, temperament, diet, story,
  litterTrained, pedigree, coatType,
  vocabulary, handFed, closedRing,
  morph, feedingSchedule, lastShed, origin
}`;

export const ALL_PETS_FOR_PARAMS_QUERY = `*[_type=="pet" && status!="sold"]{name}`;

export const TESTIMONIALS_QUERY = `*[_type=="testimonial" && status != "pending"] | order(_createdAt desc)[0...6]{
  _id, name, location, quote, rating, photo
}`;

export const ALL_TESTIMONIALS_QUERY = `*[_type=="testimonial" && status != "pending"] | order(_createdAt desc){
  _id, name, location, quote, rating, photo
}`;

export const FEATURED_GUIDES_QUERY = `*[_type=="guide" && featured==true] | order(publishedAt desc)[0...3]{
  _id, title, slug, category, excerpt, cover, readTime
}`;

export const ALL_GUIDES_QUERY = `*[_type=="guide"] | order(publishedAt desc){
  _id, title, slug, category, excerpt, cover, readTime, publishedAt
}`;

export const GUIDE_BY_SLUG_QUERY = `*[_type=="guide" && slug.current==$slug][0]{
  _id, title, slug, category, excerpt, cover, readTime, body, publishedAt
}`;

export const ALL_GUIDE_SLUGS_QUERY = `*[_type=="guide" && defined(slug.current)]{slug}`;

export const FAQS_QUERY = `*[_type=="faq"] | order(orderRank asc, _createdAt asc){
  _id, question, answer, category
}`;

export const ABOUT_QUERY = `*[_type=="aboutPage"][0]{
  headline, story, portrait, signature
}`;
