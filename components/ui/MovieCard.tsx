import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const defaultImage = require('@/assets/images/default-image.png');

export default function MovieCard({ movie, onPress, onToggleFavorite, isFavorite }: any) {
  const source =
    movie && movie.Poster && movie.Poster !== 'N/A'
      ? {
          uri: movie.Poster || defaultImage,
        }
      : defaultImage;

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      {/* Movie Poster */}
      <Image source={source} style={styles.poster} resizeMode="cover" />

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.Title}
        </Text>
        <Text style={styles.year}>{movie.Year}</Text>
      </View>

      {/* Favorite Icon */}
      <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
        <Text style={styles.favoriteIcon}>{isFavorite ? '★' : '☆'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  year: {
    marginTop: 4,
    fontSize: 14,
    color: '#888',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  favoriteIcon: {
    fontSize: 28,
    color: 'red', // Highlighted color for favorites
  },
});
