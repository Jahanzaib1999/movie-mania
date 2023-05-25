import { useState } from "react";
import { projectFirestore } from "../firebase/config";

const useFirestore = (collection) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addDocument = async (document) => {
    try {
      await projectFirestore.collection(collection).add(document);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err);
    }
  };

  const deleteDocument = async (id) => {
    try {
      await projectFirestore.collection(collection).doc(id).delete();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err);
    }
  };

  const updateDocument = async (id, updates) => {
    try {
      await projectFirestore.collection(collection).doc(id).update(updates);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err);
    }
  };

  return { addDocument, deleteDocument, updateDocument, error, success };
};

export default useFirestore;
