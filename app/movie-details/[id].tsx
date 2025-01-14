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
import { Movie, MovieDetailResponse } from '@/types/movieTypes';
import { fetchMovieDetails } from '@/api/omdbApi';
import { useMovieDetailsStore } from '@/store/movieDetailsStore';
import { useMovieStore } from '@/store/movieStore';
import { Ionicons } from '@expo/vector-icons';

const defaultImage = require('@/assets/images/defaultImage.png');

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams(); // Get movie ID from the URL
  const { setMovieDetails, getMovieDetails } = useMovieDetailsStore();

  const { favorites, addFavorite, removeFavorite } = useMovieStore();

  const [movie, setMovie] = useState<MovieDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const savedDetails = getMovieDetails(id as string); // Check if movie details already exist
      if (savedDetails) {
        setMovie(savedDetails);
        setIsLoading(false); // Avoid fetching if already available offline
      } else {
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

  const toggleFavorite = () => {
    if (!movie) return;

    const isFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
    if (isFavorite) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  const source =
    movie && movie.Poster && movie.Poster !== 'N/A' ? { uri: movie.Poster } : defaultImage;

  const isFavorite = movie && favorites.some((fav) => fav.imdbID === movie?.imdbID);

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
      {/* Movie Poster with Play Button */}
      <View style={styles.posterWrapper}>
        <Image source={source} style={styles.poster} />
        <TouchableOpacity style={styles.playButton} onPress={() => router.push('/player')}>
          <View style={styles.playButtonInner}>
            <Ionicons name="play-circle" size={50} color="#ffffff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Movie Info */}
      <View style={styles.movieInfoContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {movie.Title}
          </Text>
          <TouchableOpacity onPress={() => toggleFavorite()}>
            <View style={styles.ratingContainer}>
              <Text style={styles.favoriteIcon}>{isFavorite ? '★' : '☆'}</Text>
              <Text style={styles.ratingText}>{movie.imdbRating || 'N/A'}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.year}>
          {movie.Year} | {movie.Genre}
        </Text>
        {/* Plot Section */}
        <Text style={styles.sectionHeading}>Plot Summary</Text>
        <Text style={styles.plotText}>{movie.Plot || 'No plot available.'}</Text>
        <Text style={styles.infoText}>Directed by: {movie.Director}</Text>
        <Text style={styles.infoText}>Actors: {movie.Actors}</Text>

        {/* User Review Section */}
        <Text style={styles.sectionHeading}>User Reviews (from IMDb)</Text>
        <Text style={styles.reviewText}>“{movie.Title} is highly rated by fans!”</Text>
        <TouchableOpacity>
          <Text style={styles.readMoreLink}>Read more</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
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
  posterWrapper: {
    position: 'relative',
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  poster: {
    width: '100%',
    height: '100%',
    // borderRadius: 12,
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonInner: {
    backgroundColor: '#000000aa',
    // padding: 10,
    borderRadius: 50,
  },
  playText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  movieInfoContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#333',
  },
  year: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
    marginVertical: 8,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  plotText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  castList: {
    marginBottom: 0,
    paddingVertical: 8,
  },
  castCard: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 8,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  castName: {
    fontSize: 14,
    color: '#444',
  },
  reviewText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#444',
  },
  readMoreLink: {
    fontSize: 16,
    color: '#007AFF',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 16,
  },
  actionButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#333',
  },

  favoriteButton: {
    // position: 'absolute',
    // bottom: 10,
    // right: 10,
  },
  favoriteIcon: {
    fontSize: 28,
    color: 'red', // Highlighted color for favorites
  },
  ratingContainer: {
    flexDirection: 'row', // Ensures the star and text are aligned horizontally
    alignItems: 'center', // Ensures vertical centering
    justifyContent: 'flex-end', // Moves the rating to the end of the row (for right alignment)
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
    paddingTop: 6,
  },
});
