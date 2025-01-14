import { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Button from '@/components/ui/Button';
import { auth } from '@/firebase';
import { logger } from '@/utils/logger';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (userCredential) {
        logger('Sign in successful');
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      logger('Sign in error:', error);
      Alert.alert('Error', `Sign in failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (userCredential) {
        logger('Sign up successful');
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      logger('Sign up error:', error);
      Alert.alert('Error', `Sign up failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isFormIncomplete = !email.trim() || !password;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Welcome to MovieApp</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            secureTextEntry
            autoCorrect={false}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button label="Sign In" onPress={handleSignIn} disabled={isFormIncomplete || loading} />
          <Button label="Sign Up" onPress={handleSignUp} disabled={isFormIncomplete || loading} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  innerContainer: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    marginTop: 16,
  },
});
