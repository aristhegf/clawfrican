import { createClient } from "next-sanity";
import { apiVersion, clientProjectId, dataset, studioBasePath } from "../env";

export const client = createClient({
  projectId: clientProjectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: { studioUrl: studioBasePath },
});
