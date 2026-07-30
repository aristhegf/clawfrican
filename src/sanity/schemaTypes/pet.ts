import { defineField, defineType } from "sanity";

export default defineType({
  name: "pet",
  title: "Pets",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", description: "e.g. Luna", validation: (r) => r.required() }),
    defineField({ name: "breed", title: "Breed", type: "string", description: "e.g. Persian", validation: (r) => r.required() }),
    defineField({ name: "colour", title: "Colour", type: "string", description: "e.g. Blue, Golden, Banana morph yellow" }),
    defineField({
      name: "category", title: "Category", type: "string",
      options: { list: [{ title: "Cat", value: "cat" }, { title: "Bird", value: "bird" }, { title: "Reptile", value: "reptile" }], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "sex", title: "Sex", type: "string", options: { list: ["Female", "Male"], layout: "radio" } }),
    defineField({ name: "age", title: "Age", type: "string", description: "e.g. 5 months" }),
    defineField({ name: "price", title: "Price", type: "string", description: "e.g. ₦650,000" }),
    defineField({
      name: "status", title: "Status", type: "string",
      options: {
        list: [
          { title: "🟢 Available", value: "available" },
          { title: "🟡 Reserved", value: "reserved" },
          { title: "🔵 New Arrival", value: "new-arrival" },
          { title: "🟣 Coming Soon", value: "coming-soon" },
          { title: "⚫ Sold (hidden from site)", value: "sold" },
        ],
        layout: "radio",
      },
      initialValue: "available",
      validation: (r) => r.required(),
    }),
    defineField({ name: "featured", title: 'Show in "Featured Pets" on homepage?', type: "boolean", initialValue: false }),
    defineField({ name: "staffPick", title: "⭐ Staff Pick", type: "boolean", description: "Shows a Staff Pick badge everywhere.", initialValue: false }),
    defineField({ name: "photo", title: "Main Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "gallery", title: "More Photos (gallery)", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "videoUrl", title: "Video link (optional)", type: "url", description: "YouTube / TikTok link." }),
    defineField({
      name: "tags", title: "Personality tags", type: "array", of: [{ type: "string" }],
      options: { list: ["Good with kids", "Good with other pets", "Apartment friendly", "Beginner friendly", "Quiet", "Active", "Hand raised", "Tame"] },
    }),
    defineField({
      name: "health", title: "Health information", type: "array", of: [{ type: "string" }],
      options: { list: ["Vaccinated", "Dewormed", "DNA sexed", "Microchipped", "Vet certificate"] },
    }),
    defineField({ name: "litterTrained", title: "Litter trained?", type: "boolean", hidden: ({ document }) => document?.category !== "cat" }),
    defineField({ name: "pedigree", title: "Pedigree", type: "string", hidden: ({ document }) => document?.category !== "cat" }),
    defineField({ name: "coatType", title: "Coat type", type: "string", hidden: ({ document }) => document?.category !== "cat" }),
    defineField({ name: "vocabulary", title: "Vocabulary", type: "string", hidden: ({ document }) => document?.category !== "bird" }),
    defineField({ name: "handFed", title: "Hand fed?", type: "boolean", hidden: ({ document }) => document?.category !== "bird" }),
    defineField({ name: "closedRing", title: "Closed ring?", type: "boolean", hidden: ({ document }) => document?.category !== "bird" }),
    defineField({ name: "morph", title: "Morph", type: "string", hidden: ({ document }) => document?.category !== "reptile" }),
    defineField({ name: "feedingSchedule", title: "Feeding schedule", type: "string", hidden: ({ document }) => document?.category !== "reptile" }),
    defineField({ name: "lastShed", title: "Last shed", type: "string", hidden: ({ document }) => document?.category !== "reptile" }),
    defineField({
      name: "origin", title: "CB or WC", type: "string",
      options: { list: [{ title: "Captive Bred (CB)", value: "CB" }, { title: "Wild Caught (WC)", value: "WC" }], layout: "radio" },
      hidden: ({ document }) => document?.category !== "reptile",
    }),
    defineField({ name: "temperament", title: "Temperament", type: "string" }),
    defineField({ name: "diet", title: "Diet", type: "string" }),
    defineField({ name: "story", title: "About (personality story)", type: "text", rows: 4 }),
  ],
  preview: {
    select: { title: "name", subtitle: "breed", media: "photo", status: "status", pick: "staffPick" },
    prepare(value) {
      const { title, subtitle, media, status, pick } = value;
      const dot: Record<string, string> = { available: "🟢", reserved: "🟡", "new-arrival": "🔵", "coming-soon": "🟣", sold: "⚫" };
      return { title: `${dot[String(status)] ?? "🟢"}${pick ? " ⭐" : ""} ${String(title)}`, subtitle: String(subtitle), media };
    },
  },
});
