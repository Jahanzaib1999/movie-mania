import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MovieCard from "../../components/MovieCard";
import useTmdb from "../../hooks/useTmdb";
import "./SearchPage.css";

export default function SearchPage() {
  //   const [page, setPage] = useState(1);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");

  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
  } = useTmdb(`/search/multi`, `&query=${query}`);

  //   function handleNextPageClick() {
  //     setPage(page + 1);
  //   }

  //   function handlePrevPageClick() {
  //     setPage(page - 1);
  //   }

  //   useEffect(() => {
  //     setPage(1);
  //   }, []);

  return (
    <div className="search-page">
      <h1 className="search-header">Search Results for "{query}"</h1>
      {searchLoading && <p>Loading...</p>}
      {searchError && <p>Error: {searchError.message}</p>}
      {!searchLoading && !searchError && (
        <>
          <div className="movies-list">
            {searchData.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* <div className="pagination">
            {page > 1 && (
              <button
                className="pagination-button"
                onClick={handlePrevPageClick}
              >
                Prev
              </button>
            )}
            <span className="page-number">Page {page}</span>
            <button className="pagination-button" onClick={handleNextPageClick}>
              Next
            </button>
          </div> */}
        </>
      )}
    </div>
  );
}
