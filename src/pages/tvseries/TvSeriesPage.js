import React, { useState, useEffect, useRef } from "react";
import MovieCard from "../../components/MovieCard";
import "./TvSeriesPage.css";
import useTmdb from "../../hooks/useTmdb";

export default function TvSeriesPage() {
  const [selectedTvCategory, setSelectedTvCategory] = useState(
    localStorage.getItem("selectedTvCategory") ||
      "on_the_air" ||
      "top_rated" ||
      "All Tv Shows"
  );
  const [page, setPage] = useState(parseInt(localStorage.getItem("page")) || 1);
  const [selectedTvGenre, setSelectedTvGenre] = useState(
    JSON.parse(localStorage.getItem("selectedTvGenre")) || null
  );

  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  const { data: genreData, loading: genreLoading } = useTmdb("/genre/tv/list");

  const { data: onAirData, loading: onAirLoading } = useTmdb(
    `/tv/on_the_air`,
    `page=${page}`
  );

  const { data: topRatedData, loading: topRatedLoading } = useTmdb(
    `/tv/top_rated`,
    `page=${page}`
  );

  const {
    data: tvData,
    loading: tvLoading,
    error: tvError,
  } = useTmdb(
    `/discover/tv`,
    `page=${page}${
      selectedTvGenre !== null && selectedTvGenre !== undefined
        ? `&with_genres=${selectedTvGenre?.id}`
        : ""
    }
`
  );

  function handleNextPageClick() {
    setPage(page + 1);
  }

  function handlePrevPageClick() {
    setPage(page - 1);
  }

  useEffect(() => {
    localStorage.setItem("selectedTvCategory", selectedTvCategory);
    localStorage.setItem("page", page);
    localStorage.setItem("selectedTvGenre", JSON.stringify(selectedTvGenre));
  }, [selectedTvCategory, page, selectedTvGenre]);

  const tvPageRef = useRef(null);

  useEffect(() => {
    const container = tvPageRef.current;
    const handleScroll = () => {
      localStorage.setItem("scrollPosition", container.scrollTop);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Load the scroll position from localStorage when the component mounts
  useEffect(() => {
    const container = tvPageRef.current;
    container.scrollTop = parseInt(localStorage.getItem("scrollPosition")) || 0;
  }, []);

  return (
    <div className="tv-page" ref={tvPageRef}>
      <div className="tv-header">
        <h1>Tv Shows</h1>
        <div className="category-selector">
          <div
            className={`category-item-tv ${
              selectedTvCategory === "on_the_air" ? "active" : ""
            }`}
            onClick={() => {
              setSelectedTvCategory("on_the_air");
              setSelectedTvGenre({});
              setPage(1);
            }}
          >
            On The Air
          </div>
          <div
            className={`category-item-tv ${
              selectedTvCategory === "top_rated" ? "active" : ""
            }`}
            onClick={() => {
              setSelectedTvCategory("top_rated");
              setSelectedTvGenre({});
              setPage(1);
            }}
          >
            Top Rated
          </div>
          <div
            className={`category-item-tv genre-category ${
              selectedTvCategory === "All Tv Shows" ? "active" : ""
            }`}
            onClick={() => {
              setShowGenreDropdown(!showGenreDropdown);
              setSelectedTvCategory("All Tv Shows");
              setPage(1);
            }}
          >
            All TV Shows
          </div>
        </div>
      </div>

      {/* {selectedTvCategory === "All Tv Shows" && (
        <div className="genre-dropdown-container">
          {showGenreDropdown && (
            <div className="genre-dropdown">
              {genreLoading ? (
                <div className="genre-loading">Loading...</div>
              ) : (
                genreData.genres.map((genre) => (
                  <div
                    className="genre-dropdown-item"
                    key={genre.id}
                    onClick={() => {
                      setSelectedTvGenre(genre);
                      setSelectedTvCategory("Genre");
                      setShowGenreDropdown(false);
                    }}
                  >
                    {genre.name}
                  </div>
                ))
              )}
            </div>
          )}
          <div
            className="selected-genre"
            onClick={() => setShowGenreDropdown(!showGenreDropdown)}
          >
            {selectedTvGenre.name === null
              ? "Select Genre"
              : selectedTvGenre.name}
          </div>
        </div>
      )} */}

      <div className="tv-section">
        {selectedTvCategory === "on_the_air" && (
          <>
            <div className="tv-list">
              {!onAirLoading &&
                onAirData?.results?.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isLoading={onAirLoading}
                  />
                ))}
            </div>
          </>
        )}

        {selectedTvCategory === "top_rated" && (
          <>
            <div className="tv-list">
              {!topRatedLoading &&
                topRatedData?.results?.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isLoading={topRatedLoading}
                  />
                ))}
            </div>
          </>
        )}

        {selectedTvCategory === "All Tv Shows" && (
          <>
            <h1>{selectedTvGenre.name}</h1>
            <div className="tv-list">
              {!tvLoading &&
                !tvError &&
                tvData?.results?.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isLoading={tvLoading}
                  />
                ))}
            </div>
          </>
        )}

        <div className="pagination">
          {page > 1 && (
            <button className="pagination-button" onClick={handlePrevPageClick}>
              Prev
            </button>
          )}
          <span className="page-number">Page {page}</span>
          <button className="pagination-button" onClick={handleNextPageClick}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
