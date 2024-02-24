import { Metadata } from "next";

type ArticleData = {
  authors: string[];
  publishedTime: string;
};

const baseURL = `https://${process.env.VERCEL_URL || "localhost:3000"}`;

export default function buildOpenGraph(
  title: string,
  description: string,
  path: string,
  article?: ArticleData
): Pick<Metadata, "twitter" | "openGraph"> {
  const title64 = Buffer.from(title, "utf-8").toString("base64");
  const sampleImageBaseUrl = "https://assets.imgix.net/unsplash/citystreet.jpg";
  const titleOverlay = `https://assets.imgix.net/~text?txt64=${title64}&txtclr=fff&txtfont=avenir-black&txtsize=64&w=1200&txt-align=center&txt-fit=max`;
  const sampleImageWithTitle = `${sampleImageBaseUrl}?w=1200&h=660&mark-align=center&blend-mode=normal&blend-align=center&blend64=${Buffer.from(
    titleOverlay,
    "utf-8"
  ).toString("base64")}`;

  return {
    openGraph: {
      title,
      description,
      type: article ? "article" : "website",
      locale: "en-US",
      url: `${baseURL}/${path}`,
      siteName: "Next.js Movies Site",
      images: [
        {
          url: sampleImageWithTitle,
          width: 1200,
          height: 660,
          alt: `${title} OG Image`,
        },
      ],
      ...(article && article),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [sampleImageWithTitle],
    },
  };
}
