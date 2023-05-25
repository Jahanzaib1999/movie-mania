import { useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  const { currentUser, setCurrentUser } = useAuthContext();

  const handleLogin = async (email, password) => {
    setPending(true);
    setError(null);

    try {
      await projectAuth
        .signInWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          setCurrentUser(userCredentials.user);
          console.log(currentUser);
        });
    } catch (error) {
      setError(error.message);
    } finally {
      setPending(false);
    }
  };

  return { error, pending, handleLogin };
};
