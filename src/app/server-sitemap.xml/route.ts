import mongodb from "@/lib/mongodb";
import { serializeSlug } from "@/utils/slug.utils";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";

async function fetchSitePaths(): Promise<ISitemapField[]> {
  const cli = await mongodb;
  const db = cli.db("sample_mflix");

  const baseURL = process.env.VERCEL_URL || "http://localhost:3000";

  const movies = await db.collection("movies").find().toArray();

  return [
    {
      loc: baseURL,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 1,
    },
    ...movies.map(
      (movie) =>
        ({
          loc: `${baseURL}/movie/${serializeSlug(movie.title)}`,
          lastmod: new Date().toISOString(),
          changefreq: "monthly",
          priority: 0.8,
        } as ISitemapField)
    ),
  ];
}

export async function GET(request: Request) {
  const allPaths = await fetchSitePaths();

  return getServerSideSitemap(allPaths);
}
