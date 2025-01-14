import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onPress, disabled }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} disabled={disabled}>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 8,
  },
  label: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Button;
