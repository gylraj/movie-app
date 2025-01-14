import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MovieDetailResponse } from '@/types/movieTypes';

type MovieDetailsState = {
  movieDetails: Record<string, MovieDetailResponse>; // Stores details keyed by movie ID
  setMovieDetails: (id: string, details: MovieDetailResponse) => void;
  getMovieDetails: (id: string) => MovieDetailResponse | null;
};

export const useMovieDetailsStore = create(
  persist<MovieDetailsState>(
    (set, get) => ({
      movieDetails: {},
      setMovieDetails: (id, details) =>
        set((state) => ({
          movieDetails: {
            ...state.movieDetails,
            [id]: details,
          },
        })),
      getMovieDetails: (id) => get().movieDetails[id] || null,
    }),
    {
      name: 'movie-details-storage', // Key for AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
