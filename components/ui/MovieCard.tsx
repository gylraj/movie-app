import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CARD_WIDTH = Dimensions.get('window').width / 2 - 24; // Responsive 2-column grid
const CARD_HEIGHT = 250;

const defaultImage = require('@/assets/images/defaultImage.png');

export default function MovieCard({ movie, onPress, onToggleFavorite, isFavorite }: any) {
  const source = movie.Poster && movie.Poster !== 'N/A' ? { uri: movie.Poster } : defaultImage;

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={source} style={styles.image} defaultSource={defaultImage} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {movie.Title}
        </Text>
        <Text style={styles.genre} numberOfLines={1}>
          {movie.Year || 'N/A'}
        </Text>

        <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>{isFavorite ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 6,
    marginHorizontal: 2,
  },
  imageContainer: {
    flex: 3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#2c2c2e',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  genre: {
    fontSize: 12,
    color: '#b0b0b0',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fbc02d',
    marginLeft: 4,
  },

  favoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  favoriteIcon: {
    fontSize: 28,
    color: 'red', // Highlighted color for favorites
  },
});
