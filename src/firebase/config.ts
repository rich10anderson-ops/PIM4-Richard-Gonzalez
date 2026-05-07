import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // Normalizamos a minúsculas para evitar el error 400 de Firestore
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.toLowerCase(),
};

if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
  console.warn("Firebase config incompleta. Verifica tus variables de entorno.");
}

const app = initializeApp(firebaseConfig);

// Exportamos auth y db para usarlo en la app
export const auth = getAuth(app);
export const db = getFirestore(app);