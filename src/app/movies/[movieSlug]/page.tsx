import mongodb from "@/lib/mongodb";
import { Movie, MovieRaw } from "@/types/movie.types";
import Image from "next/image";
import probeImage from "@/utils/probeImage";
import { notFound } from "next/navigation";
import { deserializeSlug, serializeSlug } from "@/utils/slug.utils";
import JsonLd from "@/components/JsonLd";
import MovieMeta from "@/components/MovieMeta";

type QueryResponse = {
  movie: Movie | null;
};

async function fetchMovie(title: string): Promise<QueryResponse> {
  const cli = await mongodb;
  const db = cli.db("sample_mflix");

  const movieData = await db.collection("movies").findOne<MovieRaw>({ title });

  const imageData = movieData
    ? await probeImage(movieData.poster, movieData.title)
    : null;

  return {
    movie: imageData && movieData ? { ...movieData, poster: imageData } : null,
  };
}

type Props = {
  params: { movieSlug: string };
};

export default async function Page({ params }: Props) {
  const data = await fetchMovie(deserializeSlug(params.movieSlug));

  if (!data.movie) {
    notFound();
  }

  return (
    <>
      <JsonLd
        entries={[
          {
            type: "review",
            data: {
              rating: data.movie.imdb.rating ?? 7, // Default to 7 if no rating is available
              maxRating: 10,
            },
          },
          {
            type: "article",
            data: {
              title: data.movie.title,
              images: [data.movie.poster.src],
              authors: [],
            },
          },
        ]}
      />
      <div>
        <h1 className="mb-4">
          Movie: {data.movie.title} ({data.movie.year})
        </h1>

        <div className="flex gap-8">
          <Image {...data.movie.poster} className="max-w-[400px]" />

          <div className="space-y-3">
            <MovieMeta movie={data.movie} />

            <p className="text-lg text-gray-500">{data.movie.fullplot}</p>
          </div>
        </div>
      </div>{" "}
    </>
  );
}
