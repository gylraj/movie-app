import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import Button from '@/components/ui/Button';

const movieDetails = {
  title: 'Justice League',
  image: 'justice-league.jpg',
  plot: 'Fueled by his restored faith in humanity...',
  cast: [
    { id: '1', name: 'Ben Affleck', avatar: 'ben.jpg' },
    { id: '2', name: 'Gal Gadot', avatar: 'gal.jpg' },
  ],
  reviews: [{ id: '1', review: 'A great movie!', author: 'John' }],
};

const DetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={{ uri: movieDetails.image }} style={styles.banner} />
      <Button label="▶️ Watch Trailer" onPress={() => router.push('/player')} />
      <Text style={styles.title}>{movieDetails.title}</Text>
      <Text style={styles.plot}>{movieDetails.plot}</Text>

      <Text style={styles.sectionTitle}>Cast</Text>
      <FlatList
        horizontal
        data={movieDetails.cast}
        renderItem={({ item }) => (
          <View style={styles.castCard}>
            <Image source={{ uri: item.avatar }} style={styles.castAvatar} />
            <Text>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.sectionTitle}>User Reviews</Text>
      {movieDetails.reviews.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <Text>
            {review.author}: {review.review}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  banner: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  plot: {
    fontSize: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  castCard: {
    marginRight: 16,
    alignItems: 'center',
  },
  castAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  reviewCard: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default DetailsScreen;
