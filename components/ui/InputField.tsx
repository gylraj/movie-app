import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({ value, onChangeText, placeholder }) => (
  <TextInput
    style={styles.input}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});

export default InputField;
