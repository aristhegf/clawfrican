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
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Reviews submitted from the website start as Pending and are hidden from the site until approved.",
      options: {
        list: [
          { title: "✅ Approved (visible on site)", value: "approved" },
          { title: "🕓 Pending (submitted from site, awaiting review)", value: "pending" },
        ],
        layout: "radio",
      },
      initialValue: "approved",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    { title: "Pending first", name: "pendingFirst", by: [{ field: "status", direction: "asc" }, { field: "_createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "location", media: "photo", status: "status" },
    prepare(value) {
      const { title, subtitle, media, status } = value;
      const dot: Record<string, string> = { approved: "✅", pending: "🕓" };
      return {
        title: `${dot[String(status)] ?? "✅"} ${String(title)}`,
        subtitle: String(subtitle ?? ""),
        media,
      };
    },
  },
});
