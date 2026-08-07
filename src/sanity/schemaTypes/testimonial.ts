import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Customer name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "location", title: "Location", type: "string", description: "e.g. Lagos, Abuja", validation: (r) => r.required() }),
    defineField({ name: "quote", title: "Review", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "rating", title: "Rating (1–5 stars)", type: "number", initialValue: 5, validation: (r) => r.required().min(1).max(5) }),
    defineField({ name: "photo", title: "Customer / pet photo (optional)", type: "image", options: { hotspot: true } }),
    defineField({
      name: "submittedAt",
      title: "Submitted on",
      type: "datetime",
      description: "When this review came in. Set automatically for reviews submitted from the website — feel free to edit it if you need to backdate or correct it.",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
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
    select: { title: "name", location: "location", media: "photo", status: "status", submittedAt: "submittedAt" },
    prepare(value) {
      const { title, location, media, status, submittedAt } = value;
      const dot: Record<string, string> = { approved: "✅", pending: "🕓" };
      const date = submittedAt ? new Date(String(submittedAt)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
      const subtitle = [location, date].filter(Boolean).join(" · ");
      return {
        title: `${dot[String(status)] ?? "✅"} ${String(title)}`,
        subtitle,
        media,
      };
    },
  },
});
