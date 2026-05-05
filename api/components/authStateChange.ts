import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

function useAuthUser(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    // Cleanup: evita suscripciones duplicadas (importante en React StrictMode)
    return () => unsubscribe();
  }, []);

  return { user, loading };
}