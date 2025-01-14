import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '@/types/movieTypes';
import { fetchMovies } from '@/api/omdbApi';
import NetInfo from '@react-native-community/netinfo';
import { mergeWithoutDuplicates } from '@/utils/helper';

type MovieState = {
  movies: Movie[];
  searchedMovies: Movie[];
  favorites: Movie[];
  page: number;
  totalResults: number | null;
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  fetchMovieList: (query: string) => Promise<void>;
  fetchNextPage: (query: string) => Promise<void>;
  addFavorite: (movie: Movie) => void;
  removeFavorite: (imdbID: string) => void;
  reset: () => void;
};

// Define a type for partial persistence
type PartialMovieState = Partial<Pick<MovieState, 'favorites'>>;

export const useMovieStore = create(
  persist<MovieState>(
    (set, get) => ({
      movies: [],
      favorites: [],
      searchedMovies: [],
      page: 1,
      totalResults: null,
      isLoading: false,
      error: null,
      isOffline: false,

      reset: async () => {
        console.log('reset');
        set({ isLoading: false, page: 1, error: null, searchedMovies: [] });
      },

      fetchMovieList: async (query: string) => {
        console.log('fetchMovieList', query);
        const { movies } = get();

        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          set({ isOffline: true, error: 'You are offline. Showing cached results.' });
          return;
        }

        set({ isLoading: true, page: 1, error: null });
        try {
          const data = await fetchMovies({ pageParam: 1, query });
          const mergedMovies = mergeWithoutDuplicates(movies, data.Search || [], 'imdbID');

          set({
            searchedMovies: data.Search || [],
            movies: mergedMovies,
            totalResults: parseInt(data.totalResults || '0'),
            isLoading: false,
          });
        } catch (error) {
          const message = (error as Error).message;
          console.log('message', message);
          set({ error: message, isLoading: false });
        }
      },

      fetchNextPage: async (query: string) => {
        const { page, movies, searchedMovies } = get();

        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          set({ isOffline: true, error: 'You are offline. Showing cached results.' });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const data = await fetchMovies({ pageParam: page + 1, query });
          const mergedMovies = mergeWithoutDuplicates(movies, data.Search || [], 'imdbID');
          set({
            searchedMovies: [...searchedMovies, ...(data.Search || [])],
            movies: mergedMovies,
            page: page + 1,
            totalResults: parseInt(data.totalResults || '0'),
            isLoading: false,
          });
        } catch (error) {
          const message = (error as Error).message;
          console.log('message', message);
          set({ error: message, isLoading: false });
        }
      },

      addFavorite: (movie: Movie) => {
        const { favorites } = get();
        if (!favorites.find((fav) => fav.imdbID === movie.imdbID)) {
          set({ favorites: [...favorites, movie] });
        }
      },

      removeFavorite: (imdbID: string) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((movie) => movie.imdbID !== imdbID) });
      },
    }),
    {
      name: 'movie-storage', // Key for AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
