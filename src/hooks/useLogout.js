import { useState } from "react";
import { projectAuth } from "../firebase/config";

export const useLogout = () => {
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    setError(null);

    try {
      await projectAuth.signOut();
    } catch (error) {
      setError(error);
    } finally {
      setPending(false);
    }
  };

  return { error, pending, handleLogout };
};
