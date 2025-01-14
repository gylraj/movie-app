import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabBarBackground() {
  if (Platform.OS === 'ios') {
    return <BlurView intensity={85} tint="light" style={StyleSheet.absoluteFillObject} />;
  }

  return (
    <View
      style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255, 255, 255, 0.9)' }]}
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
