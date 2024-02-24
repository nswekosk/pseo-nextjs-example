import { NextImageData } from "@/types/shared.types";
import probe from "probe-image-size";

export default async function probeImage(
  src: string,
  movieTitle: string
): Promise<NextImageData | null> {
  let data: any;

  try {
    data = await probe(src);
    return {
      src,
      width: data.width,
      height: data.height,
      alt: `Poster for ${movieTitle}`,
    };
  } catch (e) {
    return null;
  }
}
