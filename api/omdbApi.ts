import { MovieListResponse, MovieDetailResponse } from '@/types/movieTypes';
import apiClient from '@/api/apiClient';

// Fetch movies
export const fetchMovies = async ({
  query,
  pageParam = 1,
}: {
  query: string;
  pageParam?: number;
}): Promise<MovieListResponse> => {
  try {
    const response = await apiClient.get('/', {
      params: {
        s: query,
        type: 'movie',
        page: pageParam,
      },
    });

    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'Failed to fetch movies');
    }

    return response.data;
  } catch (error) {
    console.log('Error fetching movies:', error);
    throw error;
  }
};

// Fetch movie details
export const fetchMovieDetails = async (id: string): Promise<MovieDetailResponse> => {
  try {
    const response = await apiClient.get('/', {
      params: {
        i: id,
      },
    });

    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'Failed to fetch movie details');
    }

    return response.data;
  } catch (error) {
    console.log('Error fetching movie details:', error);
    throw error;
  }
};
