import mongodb from "@/lib/mongodb";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// PLACEHOLDER
type QueryResponse = any;

// PLACEHOLDER
async function fetchPageData(theaterSlug: string): Promise<QueryResponse> {
  const cli = await mongodb;
  const db = cli.db("sample_mflix");

  return {};
}

type Props = {
  params: { theaterSlug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchPageData(params.theaterSlug);

  // If we don't find the data in the database, return 404 for the page
  if (!data) {
    notFound();
  }

  return {
    title: "Theater Title Placeholder",
    description: "Theater Excerpt Placeholder",
  };
}

export default async function Page({ params }: Props) {
  // This query will automatically be de-duplicated by Next.js since we called it in the `generateMetadata` function above
  const data = await fetchPageData(params.theaterSlug);

  // If we don't find the data in the database, return 404 for the page
  if (!data) {
    notFound();
  }

  return <div>Placeholder Theater Page</div>;
}
