import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, GoogleAuthProvider, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC2sGVqbrMfX99Dp8RV0HSH4pcSvLWa4RE',
  authDomain: 'movie-app-5f32b.firebaseapp.com',
  projectId: 'movie-app-5f32b',
  storageBucket: 'movie-app-5f32b.firebasestorage.app',
  messagingSenderId: '785514035892',
  appId: '1:785514035892:web:0fa2916bb6fea7ea9135e1',
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
