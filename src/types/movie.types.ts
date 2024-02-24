import { NextImageData } from "./shared.types";

export type Movie = {
  title: string;
  fullplot: string;
  poster: NextImageData;
  year: number;
  genres: string[];
  cast: string[];
  directors: string[];
  imdb: {
    rating: number | null;
  };
  isValid: boolean;
};

export type MovieRaw = Omit<Movie, "poster"> & { poster: string };
