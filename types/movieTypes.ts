export type Movie = Pick<MovieDetailResponse, 'Title' | 'Year' | 'imdbID' | 'Type' | 'Poster'>;

export interface MovieListResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: 'True' | 'False' | string;
  Error?: string;
}

export interface FetchMoviesResponse {
  movies: Movie[];
  nextPage: number | null;
}

export interface MovieDetailResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

interface Rating {
  Source: string;
  Value: string;
}
