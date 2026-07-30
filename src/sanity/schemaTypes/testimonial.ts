import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Customer name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "location", title: "Location", type: "string", description: "e.g. Lagos, Abuja" }),
    defineField({ name: "quote", title: "Review", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "rating", title: "Rating (1–5 stars)", type: "number", initialValue: 5, validation: (r) => r.required().min(1).max(5) }),
    defineField({ name: "photo", title: "Customer / pet photo (optional)", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "name", subtitle: "location", media: "photo" },
  },
});
