import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = projectFirestore
      .collection(collection)
      .doc(id)
      .onSnapshot(
        (snapshot) => {
          setDocument({ id: snapshot.id, ...snapshot.data() });
        },
        (err) => {
          setError(err);
        }
      );

    return () => unsubscribe();
  }, [collection, id]);

  return { document, error };
};

export default useDocument;
