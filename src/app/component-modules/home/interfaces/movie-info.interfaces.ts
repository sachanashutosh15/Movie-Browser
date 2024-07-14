export interface MoviesList {
  page: number;
  results: MovieDetails[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails {
  adult: Boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  isFavourite?: boolean;
}

export interface Genre {
  id: number;
  name: string;
  isSelected: boolean;
}

export interface GenreList {
  genres: Genre[];
}
