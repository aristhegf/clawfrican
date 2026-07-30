import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "whatsapp", title: "WhatsApp number", type: "string", description: "International format, no +. e.g. 2348031234567" }),
    defineField({ name: "email", title: "Email address", type: "string" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({ name: "tiktok", title: "TikTok URL", type: "url" }),
    defineField({ name: "address", title: "Address / location line", type: "string", description: "e.g. Lagos · By appointment" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
