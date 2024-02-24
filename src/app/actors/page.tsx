import mongodb from "@/lib/mongodb";
import { serializeSlug } from "@/utils/slug.utils";

import { Metadata } from "next";

type ActorWithCount = {
  actor: string;
  count: number;
};

type QueryResponse = {
  actors: ActorWithCount[];
};

async function fetchActors(): Promise<QueryResponse> {
  const cli = await mongodb;
  const db = cli.db("sample_mflix");

  const actors = await db
    .collection("movies")
    .aggregate<ActorWithCount>([
      {
        $unwind: "$cast", // Split the cast array into separate documents
      },
      {
        $group: {
          _id: "$cast", // Group by cast member
          count: { $sum: 1 }, // Count the occurrences of each cast member
        },
      },
      {
        $sort: {
          count: -1, // Sort by count in descending order (most popular first)
        },
      },
      {
        $limit: 100,
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          actor: "$_id", // Rename _id to actor/actress
          count: 1, // Include the count field
        },
      },
    ])
    .toArray();

  return { actors };
}

export const metadata: Metadata = {
  title: "Actors Title Placeholder",
  description: "Actors Excerpt Placeholder",
};

/**
 * Ideas for this page:
 *
 * - Add a list of most popular actors of all time
 * - Add a list of actors by genre
 *
 * The idea here is for this page to be a "content hub" that allows
 * the user to discover other pages on your website.
 */
export default async function Page() {
  const data = await fetchActors();

  return (
    <div>
      <h1 className="mb-4">Top {data.actors.length} Actors and Actresses</h1>
      <ul className="list-disc ml-4 space-y-2">
        {data.actors.map((actor) => (
          <li key={actor.actor}>
            <a
              href={`/actors/${serializeSlug(actor.actor)}`}
              className="hover:underline hover:text-orange-600"
            >
              {actor.actor}
            </a>{" "}
            ({actor.count})
          </li>
        ))}
      </ul>
    </div>
  );
}
