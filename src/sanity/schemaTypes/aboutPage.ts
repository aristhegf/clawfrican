import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string", description: "e.g. We believe every animal deserves a loving home." }),
    defineField({ name: "story", title: "Founder story", type: "text", rows: 8 }),
    defineField({ name: "portrait", title: "Founder portrait", type: "image", options: { hotspot: true } }),
    defineField({ name: "signature", title: "Signature name", type: "string", description: "e.g. Aris, Founder" }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
