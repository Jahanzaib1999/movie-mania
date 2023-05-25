import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

const useCollection = (collection) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = projectFirestore.collection(collection).onSnapshot(
      (snapshot) => {
        setDocuments(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      },
      (err) => {
        setError(err);
      }
    );

    return () => unsubscribe();
  }, [collection]);

  return { documents, error };
};

export default useCollection;
