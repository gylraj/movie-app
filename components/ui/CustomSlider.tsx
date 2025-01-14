import React from 'react';
import { View, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import Slider from '@react-native-community/slider';

interface CustomSliderProps {
  currentTime: number; // Current playback time in seconds
  duration: number; // Total video duration in seconds
  onSlidingStart: (value: number) => void; // Function called when user finishes seeking
  onSlidingComplete: (value: number) => void; // Function called when user finishes seeking
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function CustomSlider({
  currentTime,
  duration,
  onSlidingStart,
  onSlidingComplete,
}: CustomSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={currentTime}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSlidingComplete} // Called when user releases the slider
        minimumTrackTintColor="#1FB28A"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1FB28A"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#fff',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
