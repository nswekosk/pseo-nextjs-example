import mongodb from "@/lib/mongodb";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// PLACEHOLDER
type QueryResponse = any;

// PLACEHOLDER
async function fetchPageData(directorSlug: string): Promise<QueryResponse> {
  const cli = await mongodb;
  const db = cli.db("sample_mflix");

  return {};
}

type Props = {
  params: { directorSlug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchPageData(params.directorSlug);

  // If we don't find the data in the database, return 404 for the page
  if (!data) {
    notFound();
  }

  return {
    title: "Director Title Placeholder",
    description: "Director Excerpt Placeholder",
  };
}

export default async function Page({ params }: Props) {
  // This query will automatically be de-duplicated by Next.js since we called it in the `generateMetadata` function above
  const data = await fetchPageData(params.directorSlug);

  // If we don't find the data in the database, return 404 for the page
  if (!data) {
    notFound();
  }

  return (
    <div>
      <h1>Director Movie List Placeholder</h1>
    </div>
  );
}
