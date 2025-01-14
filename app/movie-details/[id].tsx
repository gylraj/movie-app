import { router, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useEffect, useState } from 'react';
import { MovieDetailResponse } from '@/types/movieTypes';
import { fetchMovieDetails } from '@/api/omdbApi';
import { useMovieDetailsStore } from '@/store/movieDetailsStore';

const defaultImage = require('@/assets/images/default-image.png');

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams(); // Get movie ID from the URL
  const { setMovieDetails, getMovieDetails } = useMovieDetailsStore();
  const [movie, setMovie] = useState<MovieDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('movie', movie);

  useEffect(() => {
    if (id) {
      const savedDetails = getMovieDetails(id as string); // Check if movie details already exist
      if (savedDetails) {
        console.log('savedDetails', savedDetails);
        setMovie(savedDetails);
        setIsLoading(false); // Avoid fetching if already available offline
      } else {
        console.log('fetchMovie', id);
        fetchMovie(id as string);
      }
    }
  }, [id]);

  const fetchMovie = async (movieId: string) => {
    try {
      const data = await fetchMovieDetails(movieId);
      setMovie(data);
      setMovieDetails(movieId, data); // Save movie details to the store
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const source =
    movie && movie.Poster && movie.Poster !== 'N/A'
      ? {
          uri: movie.Poster || defaultImage,
        }
      : defaultImage;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Movie details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => {
          router.push('/player');
        }}
      >
        <View style={styles.posterContainer}>
          <Image source={source} style={styles.poster} />
        </View>
      </TouchableOpacity>

      <Text style={styles.title}>{movie.Title}</Text>
      <Text style={styles.year}>
        {movie.Year} | {movie.Genre}
      </Text>
      <Text style={styles.infoText}>Directed by: {movie.Director}</Text>
      <Text style={styles.infoText}>Actors: {movie.Actors}</Text>
      <Text style={styles.infoText}>IMDB Rating: ⭐ {movie.imdbRating}</Text>

      <Text style={styles.plotHeading}>Plot</Text>
      <Text style={styles.plotText}>{movie.Plot}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  posterContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  poster: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  year: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  plotHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  plotText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});
