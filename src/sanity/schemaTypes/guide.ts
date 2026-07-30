import { defineField, defineType } from "sanity";

export default defineType({
  name: "guide",
  title: "Care Guides",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug", title: "URL slug", type: "slug",
      options: { source: "title", maxLength: 80 },
      description: 'Tap "Generate" — this becomes the guide\'s shareable link.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category", title: "For which pets?", type: "string",
      options: { list: [{ title: "Cats", value: "cat" }, { title: "Birds", value: "bird" }, { title: "Reptiles", value: "reptile" }, { title: "General", value: "general" }], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", title: "Short summary", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "cover", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({ name: "readTime", title: "Read time (minutes)", type: "number" }),
    defineField({
      name: "body", title: "Article body", type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "featured", title: "Feature on homepage?", type: "boolean", initialValue: false }),
    defineField({ name: "publishedAt", title: "Published date", type: "datetime", initialValue: () => new Date().toISOString() }),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", category: "category", media: "cover" },
    prepare(value) {
      const { title, category, media } = value;
      const label: Record<string, string> = { cat: "Cats", bird: "Birds", reptile: "Reptiles", general: "General" };
      return { title: String(title), subtitle: `Guide · ${label[String(category)] ?? ""}`, media };
    },
  },
});
