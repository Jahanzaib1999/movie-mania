import React, { useState, useEffect, useRef } from "react";
import MovieCard from "../../components/MovieCard";
import "./TvSeriesPage.css";
import useTmdb from "../../hooks/useTmdb";

import { FaFilter } from "react-icons/fa";

export default function TvSeriesPage() {
  const [selectedTvCategory, setSelectedTvCategory] = useState(
    localStorage.getItem("selectedTvCategory") ||
      "on_the_air" ||
      "top_rated" ||
      "All Tv Shows"
  );
  const [page, setPage] = useState(parseInt(localStorage.getItem("page")) || 1);
  const [selectedGenreList, setSelectedGenreList] = useState(
    JSON.parse(localStorage.getItem("selectedGenreList")) || []
  );

  const [FiltersMenuExpanded, setFiltersMenuExpanded] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const [selectedYear, setSelectedYear] = useState(null);

  const [filteredParams, setFilteredParams] = useState(``);

  const { data: languageData, loading: languageLoading } = useTmdb(
    "/configuration/languages"
  );

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
    `page=${page}${filteredParams}
  `
  );

  const applyFilters = () => {
    let params = "";

    // Apply language filter
    if (selectedLanguage !== "All") {
      params += `&with_original_language=${selectedLanguage}`;
    }

    // Apply year filter
    if (selectedYear !== "null") {
      params += `&year=${selectedYear}`;
    }

    // Apply genre filter
    const genreIds = Object.keys(selectedGenreList);
    if (genreIds.length > 0) {
      const genres = genreIds.join(",");
      params += `&with_genres=${genres}`;
    }

    setFilteredParams(params);

    setFiltersMenuExpanded(!FiltersMenuExpanded);
  };

  function handleGenreSelection(genreId) {
    setSelectedGenreList((prevSelectedGenreList) => {
      if (prevSelectedGenreList[genreId]) {
        const updatedGenreList = { ...prevSelectedGenreList };
        delete updatedGenreList[genreId];
        return updatedGenreList;
      } else {
        return { ...prevSelectedGenreList, [genreId]: true };
      }
    });
  }

  const clearFilters = () => {
    setSelectedLanguage("All");
    setSelectedYear("null");
    setSelectedGenreList({});
    setFilteredParams("");
    setFiltersMenuExpanded(!FiltersMenuExpanded);
  };

  function handleNextPageClick() {
    setPage(page + 1);
  }

  function handlePrevPageClick() {
    setPage(page - 1);
  }

  function toggleFiltersMenu() {
    setFiltersMenuExpanded(!FiltersMenuExpanded);
  }

  useEffect(() => {
    localStorage.setItem("selectedTvCategory", selectedTvCategory);
    localStorage.setItem("page", page);
    localStorage.setItem(
      "selectedGenreList",
      JSON.stringify(Object.values(selectedGenreList))
    );
  }, [selectedTvCategory, page, selectedGenreList]);

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
              setSelectedGenreList([]);
              setPage(1);
              setFiltersMenuExpanded(!FiltersMenuExpanded);
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
              setSelectedGenreList([]);
              setPage(1);
              setFiltersMenuExpanded(!FiltersMenuExpanded);
            }}
          >
            Top Rated
          </div>
          <div
            className={`category-item-tv genre-category ${
              selectedTvCategory === "All Tv Shows" ? "active" : ""
            }`}
            onClick={() => {
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

      {selectedTvCategory === "All Tv Shows" && (
        <div
          className={`filters-menu ${
            FiltersMenuExpanded ? "filters-menu-expanded" : ""
          }`}
        >
          <div>
            <div className="filter-heading" onClick={toggleFiltersMenu}>
              <FaFilter /> Filters
            </div>
            {FiltersMenuExpanded && (
              <div className="filters-dropdown">
                <div className="filter-section">
                  <h3>
                    Genre<span className="select-info">(multi select)</span>
                  </h3>
                  <div className="filter-options">
                    {genreLoading ? (
                      <div>Loading genres...</div>
                    ) : (
                      genreData.genres.map((genre) => (
                        <label key={genre.id}>
                          <input
                            type="checkbox"
                            checked={!!selectedGenreList[genre.id]}
                            onChange={() => handleGenreSelection(genre.id)}
                          />

                          <span>{genre.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="filter-section">
                  <h3>
                    Year<span className="select-info">(single select)</span>
                  </h3>
                  <div className="filter-options">
                    {Array.from({ length: 5 }, (_, index) => 2023 - index).map(
                      (year) => (
                        <label key={year}>
                          <input
                            type="radio"
                            name="year"
                            value={year.toString()}
                            checked={selectedYear === year.toString()}
                            onChange={(e) => setSelectedYear(e.target.value)}
                          />
                          <span>{year}</span>
                        </label>
                      )
                    )}
                    <label>
                      <input
                        type="radio"
                        name="year"
                        value="older"
                        checked={selectedYear === "2018"}
                        onChange={(e) => setSelectedYear("2018")}
                      />
                      <span>Older</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="year"
                        value=""
                        checked={selectedYear === ""}
                        onChange={(e) => setSelectedYear(e.target.value)}
                      />
                      <span
                        style={{
                          backgroundColor: "transparent",
                          color: "#000",
                        }}
                      >
                        Clear
                      </span>
                    </label>
                  </div>
                </div>

                <div className="filter-section">
                  <h3>
                    Languages
                    <span className="select-info">(single select)</span>
                  </h3>
                  <div className="filter-options">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                      <option value="All">Select a language</option>
                      {languageLoading ? (
                        <option disabled>Loading languages...</option>
                      ) : (
                        languageData.map((language) => (
                          <option
                            key={language.iso_639_1}
                            value={language.iso_639_1}
                          >
                            {language.english_name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* <div className="filter-section">
                  <h3>Rating</h3>
                  <div className="filter-options"></div>
                </div> */}

                <div className="apply-filters-button">
                  <button className="filter-button" onClick={applyFilters}>
                    Apply Filters
                  </button>
                  <button className="clear-button" onClick={clearFilters}>
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
