import { initializeApp, setLogLevel } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Silence Firebase SDK default logger warnings
setLogLevel('error');

// Safe environment variable resolution for both Vite client and Node.js environments
const getEnvVar = (key: string, fallback: string = ""): string => {
  try {
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch {}
  try {
    if (typeof process !== "undefined" && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {}
  return fallback;
};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnvVar("VITE_FIREBASE_API_KEY", "AIzaSyAD5brfUUCMfxxjqFke4vJtFx8eyhGE9us"),
  authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN", "environmental-shapers-network.firebaseapp.com"),
  projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID", "environmental-shapers-network"),
  storageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET", "environmental-shapers-network.firebasestorage.app"),
  messagingSenderId: getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID", "834783600290"),
  appId: getEnvVar("VITE_FIREBASE_APP_ID", "1:834783600290:web:6b08ba48f099bd2c0c81fb"),
  measurementId: getEnvVar("VITE_FIREBASE_MEASUREMENT_ID", "G-M1DV3S0X1R")
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Cloud Storage
export const storage = getStorage(app);

