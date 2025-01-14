import React from 'react';
import { View, Text, Modal, StyleSheet, Button } from 'react-native';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose, title, children }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>{title}</Text>
        {children}
        <Button title="Close" onPress={onClose} />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomModal;
