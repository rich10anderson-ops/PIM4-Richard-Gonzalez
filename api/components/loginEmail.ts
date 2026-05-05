import { auth } from "../../src/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

// Registrar un nuevo usuario
async function handleSignUp(email: string, password: string): Promise<UserCredential> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  // result.user ya tiene la sesión iniciada automáticamente
  return result;
}

// Login de usuario existente
async function handleSignIn(email: string, password: string): Promise<UserCredential> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  // result.user contiene los datos de sesión
  return result;
}