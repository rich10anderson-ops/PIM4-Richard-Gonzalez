import { auth } from "../../src/firebase/config";
import { signInWithPopup, GoogleAuthProvider, UserCredential } from "firebase/auth";

async function handleGoogleSignIn(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  // result.user contiene los mismos datos que email/password
  return result;
}