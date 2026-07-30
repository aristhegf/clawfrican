import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQs",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({
      name: "category", title: "Category", type: "string",
      options: { list: ["General", "Cats", "Birds", "Reptiles", "Delivery", "Payment"] },
    }),
    defineField({ name: "orderRank", title: "Order", type: "number" }),
  ],
  preview: {
    select: { title: "question", subtitle: "category" },
  },
});
