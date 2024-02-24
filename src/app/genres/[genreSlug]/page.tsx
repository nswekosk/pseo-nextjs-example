import mongodb from "@/lib/mongodb";
import { Movie, MovieRaw } from "@/types/movie.types";
import probeImage from "@/utils/probeImage";
import { deserializeSlug, serializeSlug } from "@/utils/slug.utils";
import Image from "next/image";

type QueryResponse = {
  movies: Movie[];
};

async function fetchMovies(genre: string): Promise<QueryResponse> {
  const cli = await mongodb;
  const db = cli.db("sample_mflix");

  const movies = await db
    .collection("movies")
    .aggregate<MovieRaw>([
      {
        $match: {
          genres: genre,
          poster: { $exists: true }, // Only return movies that have a poster
        },
      },
      {
        $sort: {
          "imdb.rating": -1, // Sort by imdb.rating in descending order (highest rating first)
        },
      },
      {
        $project: {
          title: 1,
          fullplot: 1,
          poster: 1,
          year: 1,
          genres: { $ifNull: ["$genres", []] },
          cast: { $ifNull: ["$cast", []] },
          directors: { $ifNull: ["$directors", []] },
          "imdb.rating": 1,
        },
      },
      {
        $limit: 15, // Limit the result to the top 10 movies
      },
    ])
    .toArray();

  const moviesWithImageDimensions = await Promise.all(
    movies.map(async (movie) => {
      const imageData = await probeImage(movie.poster, movie.title);
      return imageData ? { ...movie, poster: imageData } : null;
    })
  );

  return {
    movies: moviesWithImageDimensions.filter(
      (movie): movie is Movie => movie != null
    ),
  };
}

type Props = {
  params: { genreSlug: string };
};

export default async function Page({ params }: Props) {
  const data = await fetchMovies(deserializeSlug(params.genreSlug));

  return (
    <div>
      <h1 className="mb-4">
        Top {data.movies.length} Movies in Genre:{" "}
        {deserializeSlug(params.genreSlug)}
      </h1>

      <ul className="divide-y-2 space-y-8">
        {data.movies.map((movie) => (
          <li key={movie.title} className="pt-8">
            <div className="flex gap-8">
              <Image {...movie.poster} className="max-w-[400px]" />

              <div className="space-y-3">
                <h2 className="text-xl font-bold">
                  <a
                    href={`/movies/${serializeSlug(movie.title)}`}
                    className="hover:underline hover:text-orange-600"
                  >
                    {movie.title} ({movie.year})
                  </a>
                </h2>

                {movie.imdb.rating && <p>IMDB Rating: {movie.imdb.rating}</p>}

                <p className="text-lg text-gray-500">{movie.fullplot}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
