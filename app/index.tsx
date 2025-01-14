import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '@/firebase';

export default function RootScreen() {
  const router = useRouter();
  console.log('dada');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace('/(tabs)'); // Redirect to tabs if logged in
      } else {
        router.replace('/home'); // Redirect to login if not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
