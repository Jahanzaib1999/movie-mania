import { useState } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignup = async (email, password, name) => {
    setPending(true);
    setError(null);

    if (!email || !password || !name) {
      return;
    }

    try {
      await projectAuth.createUserWithEmailAndPassword(email, password);

      await projectAuth.currentUser.updateProfile({
        displayName: name,
      });

      //adding user collection
      const user = projectAuth.currentUser;
      await projectFirestore
        .collection("users")
        .doc(user.uid)
        .set({ name, email });
    } catch (error) {
      setError(error);
    } finally {
      setSignupSuccess(true);
      setPending(false);
    }
  };

  return { error, pending, signupSuccess, handleSignup };
};
