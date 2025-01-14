import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useMovieStore } from '@/store/movieStore'; // Import zustand store
import { useDebounce } from '@/hooks/useDebounce';
import MovieCard from '@/components/ui/MovieCard';
import { router } from 'expo-router';
import { Movie } from '@/types/movieTypes';
import { getTenItems } from '@/utils/helper';

export default function MoviesListScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const [page, setPage] = useState(1);

  // Access zustand store
  const {
    movies,
    searchedMovies,
    fetchMovieList,
    fetchNextPage,
    isLoading,
    error,
    favorites,
    addFavorite,
    removeFavorite,
    reset,
  } = useMovieStore();

  // Fetch movies when debounced query changes
  React.useEffect(() => {
    if (debouncedQuery) {
      fetchMovieList(debouncedQuery);
    }
  }, [debouncedQuery]);

  React.useEffect(() => {
    if (!query) {
      reset();
      setPage(1);
    }
  }, [query]);

  const handleLoadMore = () => {
    if (!query) {
      setPage((page) => page + 1);
      return;
    }

    if (searchedMovies.length > 0) {
      fetchNextPage(query);
    }
  };

  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
    if (isFavorite) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  console.log('movies', movies.length);

  const initialData = useMemo(() => (!query ? getTenItems(movies, page) : []), [query, page]);

  console.log('favorites', favorites);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for a movie..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      <FlatList
        data={!query ? initialData : searchedMovies}
        initialNumToRender={10} // Only render 10 items initially
        removeClippedSubviews={true} // Removes off-screen items
        keyExtractor={(item, index) => item.imdbID || index.toString()}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => router.push(`/movie-details/${item.imdbID}`)}
            onToggleFavorite={() => toggleFavorite(item)}
            isFavorite={favorites.some((fav) => fav.imdbID === item.imdbID)}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <ActivityIndicator size="small" color="#0000ff" /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  movieCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteButton: {
    marginLeft: 10,
    padding: 10,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
});
