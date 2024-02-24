import mongodb from "@/lib/mongodb";
import { Movie, MovieRaw } from "@/types/movie.types";
import Image from "next/image";
import probeImage from "@/utils/probeImage";
import { deserializeSlug, serializeSlug } from "@/utils/slug.utils";
import JsonLd from "@/components/JsonLd";
import MovieMeta from "@/components/MovieMeta";
import buildOpenGraph from "@/utils/buildOpenGraph";

type QueryResponse = {
  movies: Movie[];
};

async function fetchMovies(actor: string): Promise<QueryResponse> {
  const cli = await mongodb;
  const db = cli.db("sample_mflix");

  const movies = await db
    .collection("movies")
    .aggregate<MovieRaw>([
      {
        $match: {
          cast: actor,
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
          _id: { $toString: "$_id" },
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
  params: { actorSlug: string };
};

function generateTitle(numMovies: number, actor: string) {
  return `Top ${numMovies} Movies With ${actor}`;
}

function generateExcerpt(actor: string) {
  return `Here are our rankings for the top movies with ${actor}.`;
}

export async function generateMetadata({ params }: Props) {
  const data = await fetchMovies(deserializeSlug(params.actorSlug));

  const title = generateTitle(
    data.movies.length,
    deserializeSlug(params.actorSlug)
  );
  const excerpt = generateExcerpt(deserializeSlug(params.actorSlug));

  return {
    title,
    description: excerpt,
    ...buildOpenGraph(title, excerpt, `actors/${params.actorSlug}`),
  };
}

export default async function Page({ params }: Props) {
  const data = await fetchMovies(deserializeSlug(params.actorSlug));

  const title = `Top ${data.movies.length} Movies With ${deserializeSlug(
    params.actorSlug
  )}`;
  const excerpt = `Here are our rankings for the top movies with ${deserializeSlug(
    params.actorSlug
  )}.`;

  return (
    <>
      <JsonLd
        entries={[
          {
            type: "article",
            data: {
              title,
              images: [data.movies[0].poster.src],
              authors: [],
            },
          },
        ]}
      />
      <div>
        <h1 className="mb-4">{title}</h1>

        <p>{excerpt}</p>

        <ul className="divide-y-2 space-y-8">
          {data.movies.map((movie) => (
            <li key={movie.title} className="pt-8">
              <div className="flex gap-8">
                <Image {...movie.poster} />

                <div className="space-y-3">
                  <MovieMeta movie={movie} />

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
      </div>{" "}
    </>
  );
}
