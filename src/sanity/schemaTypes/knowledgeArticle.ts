import { defineField, defineType } from "sanity";

export default defineType({
  name: "knowledgeArticle",
  title: "Knowledge Base",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "category", title: "Category", type: "string",
      options: {
        list: ["Species Profile", "Care Guide", "Feeding & Nutrition", "Housing & Enclosures", "Health & Vet", "Behaviour & Training", "Beginner Advice", "Clawfrican Policies", "Common Myths", "FAQ"],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "tags", title: "Search tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, validation: (r) => r.required().min(2) }),
    defineField({ name: "content", title: "Content", type: "text", rows: 12, validation: (r) => r.required() }),
    defineField({ name: "priority", title: "Priority (1–10)", type: "number", initialValue: 5 }),
  ],
  preview: { select: { title: "title", subtitle: "category" } },
});
