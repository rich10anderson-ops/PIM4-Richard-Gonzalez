import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value) {
    throw new Error(`Falta configurar ${key} en las variables de entorno de Firebase.`);
  }
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const authPersistenceReady = setPersistence(auth, browserLocalPersistence);
