import { useState, useEffect } from "react";

const useTmdb = (endpoint, params = "") => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = "ed036b8de8d4dd1405534d162870b1fd";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&${params}`
        );
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint, params]);

  return {
    data,
    loading,
    error,
  };
};

export default useTmdb;
