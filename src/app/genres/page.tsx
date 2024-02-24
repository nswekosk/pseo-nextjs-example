import mongodb from "@/lib/mongodb";
import { GenreWithCount } from "@/types/genre.types";
import { serializeSlug } from "@/utils/slug.utils";

type QueryResponse = {
  genres: GenreWithCount[];
};

async function fetchGenres(): Promise<QueryResponse> {
  const cli = await mongodb;
  const db = cli.db("sample_mflix");

  const genres = await db
    .collection("movies")
    .aggregate<GenreWithCount>([
      {
        $unwind: "$genres", // Split the genres array into separate documents
      },
      {
        $group: {
          _id: "$genres", // Group by genre
          count: { $sum: 1 }, // Count the occurrences of each genre
        },
      },
      {
        $sort: {
          count: -1, // Sort by count in descending order (most popular first)
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          genre: "$_id", // Rename _id to genre
          count: 1, // Include the count field
        },
      },
    ])
    .toArray();

  return { genres };
}

export default async function Page() {
  const data = await fetchGenres();

  return (
    <div>
      <h1 className="mb-4">Genres</h1>
      <ul className="list-disc ml-4 space-y-2">
        {data.genres.map((genre) => (
          <li key={genre.genre}>
            <a
              href={`/genres/${serializeSlug(genre.genre)}`}
              className="hover:underline hover:text-orange-600"
            >
              {genre.genre}
            </a>{" "}
            ({genre.count})
          </li>
        ))}
      </ul>
    </div>
  );
}
