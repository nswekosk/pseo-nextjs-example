import { Movie } from "@/types/movie.types";
import { serializeSlug } from "@/utils/slug.utils";

type Props = {
  movie: Movie;
};

export default function MovieMeta({ movie }: Props) {
  return (
    <div className="space-y-2">
      <p>
        Genres:{" "}
        {movie.genres.map((genre, idx) => (
          <a
            key={genre}
            href={`/genres/${serializeSlug(genre)}`}
            className="text-orange-600 hover:underline"
          >
            {genre}
            {idx !== (movie?.genres ?? []).length - 1 ? ", " : ""}
          </a>
        ))}
      </p>

      <p>
        Cast:{" "}
        {movie.cast.map((actor, idx) => (
          <a
            key={actor}
            href={`/actors/${serializeSlug(actor)}`}
            className="text-orange-600 hover:underline"
          >
            {actor}
            {idx !== (movie?.cast ?? []).length - 1 ? ", " : ""}
          </a>
        ))}
      </p>

      <p>
        Directors:{" "}
        {movie.directors.map((director, idx) => (
          <a
            key={director}
            href={`/directors/${serializeSlug(director)}`}
            className="text-orange-600 hover:underline"
          >
            {director}
            {idx !== (movie?.directors ?? []).length - 1 ? ", " : ""}
          </a>
        ))}
      </p>
    </div>
  );
}
