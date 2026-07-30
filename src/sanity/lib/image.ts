import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { clientProjectId, dataset } from "../env";

const builder = createImageUrlBuilder({ projectId: clientProjectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}
