import React, { useEffect, useRef, useState } from "react";
import MovieCard from "../../components/MovieCard";
import useTmdb from "../../hooks/useTmdb";
import "./MoviesPage.css";

import { FaFilter } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";

// function MoviesPage() {
//   const [selectedCategory, setSelectedCategory] = useState("now_playing");
//   const [page, setPage] = useState(1);

//   const { data: nowPlayingData, loading: nowPlayingLoading } = useTmdb(
//     `/movie/now_playing`,
//     `page=${page}`
//   );
//   const { data: topRatedData, loading: topRatedLoading } = useTmdb(
//     `/movie/top_rated`,
//     `page=${page}`
//   );

//   const { data: popularData, loading: popularLoading } =
//     useTmdb(`/movie/popular`);

//   function handleNextPageClick() {
//     setPage(page + 1);
//   }

//   function handlePrevPageClick() {
//     setPage(page - 1);
//   }

//   useEffect(() => {
//     setPage(1);
//   }, [selectedCategory]);

//   return (
//     <div className="movies-page">
//       <div className="header">
//         <h1>Movies</h1>
//         <div className="category-selector">
//           <div
//             className={`category-item ${
//               selectedCategory === "now_playing" ? "active" : ""
//             }`}
//             onClick={() => setSelectedCategory("now_playing")}
//           >
//             Now Playing
//           </div>
//           <div
//             className={`category-item ${
//               selectedCategory === "top_rated" ? "active" : ""
//             }`}
//             onClick={() => setSelectedCategory("top_rated")}
//           >
//             Top Rated
//           </div>
//           <div
//             className={`category-item ${
//               selectedCategory === "popular" ? "active" : ""
//             }`}
//             onClick={() => setSelectedCategory("popular")}
//           >
//             Popular
//           </div>
//         </div>
//       </div>
//       <div className="movies-section">
//         {selectedCategory === "now_playing" && (
//           <>
//             <div className="movies-list">
//               {nowPlayingLoading ? (
//                 <div>Loading...</div>
//               ) : (
//                 nowPlayingData.results.map((movie) => (
//                   <MovieCard key={movie.id} movie={movie} />
//                 ))
//               )}
//             </div>
//             <div className="pagination">
//               {page > 1 && (
//                 <button
//                   className="pagination-button"
//                   onClick={handlePrevPageClick}
//                 >
//                   Prev
//                 </button>
//               )}
//               <span className="page-number">Page {page}</span>
//               <button
//                 className="pagination-button"
//                 onClick={handleNextPageClick}
//               >
//                 Next
//               </button>
//             </div>
//           </>
//         )}
//         {selectedCategory === "top_rated" && (
//           <>
//             <div className="movies-list">
//               {topRatedLoading ? (
//                 <div>Loading...</div>
//               ) : (
//                 topRatedData.results.map((movie) => (
//                   <MovieCard key={movie.id} movie={movie} />
//                 ))
//               )}
//             </div>
//             <div className="pagination">
//               {page > 1 && (
//                 <button
//                   className="pagination-button"
//                   onClick={handlePrevPageClick}
//                 >
//                   Prev
//                 </button>
//               )}
//               <span className="page-number">Page {page}</span>
//               <button
//                 className="pagination-button"
//                 onClick={handleNextPageClick}
//               >
//                 Next
//               </button>
//             </div>
//           </>
//         )}
//         {selectedCategory === "popular" && (
//           <>
//             <div className="movies-list">
//               {popularLoading ? (
//                 <div>Loading...</div>
//               ) : (
//                 popularData.results.map((movie) => (
//                   <MovieCard key={movie.id} movie={movie} />
//                 ))
//               )}
//             </div>
//             <div className="pagination">
//               {page > 1 && (
//                 <button
//                   className="pagination-button"
//                   onClick={handlePrevPageClick}
//                 >
//                   Prev
//                 </button>
//               )}
//               <span className="page-number">Page {page}</span>
//               <button
//                 className="pagination-button"
//                 onClick={handleNextPageClick}
//               >
//                 Next
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default MoviesPage;

// FAILED ATTEMPT AT IMPLEMENTING GENRE LOGIC
// IT WORKS ITS JUST THAT DATA IS DESIGNED IN A WAY THAT IT REQUIRES
// PAGE PARAMETER FOR NEW RESULTS AND FILTER IS WORKING
// BUT ONLY FOR SEPARATE PAGES.
// SO IF SELECTED GENRE WAS ACTION THEN ALL THE MOVIES
// ON THAT SPECIFIC PAGE WHICH HAVE ACTION GENRE LISTED
// IN THEIR RESPONSE WILL BE RENDERED
// BUT THIS CREATES AN IMBALANCE LEAVING SOME PAGES
// BLANK WHILE OTHERS SHOW SOME RESULTS AS ONLY
// A FEW MOVIES PER PAGE WOULD BELONG TO A GENRE SELECTED
// BY THE USER

// JSON.parse(localStorage.getItem("selectedGenre")) ||

// ${
//   selectedGenre !== null && selectedGenre !== undefined
//     ? `&with_genres=${selectedGenre?.id}`
//     : ""
// }

function MoviesPage() {
  const [selectedGenreList, setSelectedGenreList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory") ||
      "now_playing" ||
      "top_rated" ||
      "All Movies"
  );

  const [page, setPage] = useState(parseInt(localStorage.getItem("page")) || 1);

  const [FiltersMenuExpanded, setFiltersMenuExpanded] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const [selectedYear, setSelectedYear] = useState(null);

  const [filteredParams, setFilteredParams] = useState(``);

  const [appliedFilters, setAppliedFilters] = useState([]);

  const { data: genreData, loading: genreLoading } =
    useTmdb("/genre/movie/list");

  const { data: languageData, loading: languageLoading } = useTmdb(
    "/configuration/languages"
  );

  const { data: nowPlayingData, loading: nowPlayingLoading } = useTmdb(
    `/movie/now_playing`,
    `page=${page}`
  );
  const { data: topRatedData, loading: topRatedLoading } = useTmdb(
    `/movie/top_rated`,
    `page=${page}`
  );
  const {
    data: movieData,
    loading: movieLoading,
    error: movieError,
  } = useTmdb(
    `/discover/movie`,
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

    const appliedFilters = [];

    if (selectedLanguage !== "All") {
      appliedFilters.push({ name: "Language", value: selectedLanguage });
    }

    if (selectedYear !== null && selectedYear !== "null") {
      appliedFilters.push({ name: "Year", value: selectedYear });
    }

    if (Object.keys(selectedGenreList).length > 0) {
      const genreNames = Object.keys(selectedGenreList).map((genreId) => {
        const genre = genreData.genres.find(
          (genre) => genre.id === parseInt(genreId)
        );
        return genre ? genre.name : "";
      });
      appliedFilters.push(
        ...genreNames.map((name) => ({ name: "Genre", value: name }))
      );
    }

    setAppliedFilters(appliedFilters);

    setFiltersMenuExpanded(!FiltersMenuExpanded);
  };

  //console.log(filteredParams);

  function toggleFiltersMenu() {
    setFiltersMenuExpanded(!FiltersMenuExpanded);
  }

  function handleNextPageClick() {
    setPage(page + 1);
  }

  function handlePrevPageClick() {
    setPage(page - 1);
  }

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
    setAppliedFilters([]);
  };

  const resetFilters = () => {
    setSelectedLanguage("All");
    setSelectedYear(null);
    setSelectedGenreList({});
    setFilteredParams("");
    setFiltersMenuExpanded(false);
    setAppliedFilters([]);
  };

  useEffect(() => {
    resetFilters();
  }, []);

  const movieListRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory);
    localStorage.setItem("page", page);
    localStorage.setItem(
      "selectedGenreList",
      JSON.stringify(Object.values(selectedGenreList))
    );
  }, [selectedCategory, page, selectedGenreList]);

  //console.log(localStorage.getItem("selectedGenreList"));

  useEffect(() => {
    const container = movieListRef.current;
    const handleScroll = () => {
      localStorage.setItem("scrollPosition", container.scrollTop);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Load the scroll position from localStorage when the component mounts
  useEffect(() => {
    const container = movieListRef.current;
    container.scrollTop = parseInt(localStorage.getItem("scrollPosition")) || 0;
  }, []);

  const removeFilter = (index) => {
    const filter = appliedFilters[index];
    const updatedFilters = appliedFilters.filter((_, i) => i !== index);
    setAppliedFilters(updatedFilters);

    if (filter.name === "Language") {
      setSelectedLanguage("All");
    } else if (filter.name === "Year") {
      setSelectedYear(null);
    } else if (filter.name === "Genre") {
      const updatedGenreList = { ...selectedGenreList };
      delete updatedGenreList[filter.value];
      setSelectedGenreList(updatedGenreList);
    }

    setFilteredParams("");
    // setFiltersMenuExpanded(false);
  };

  //console.log(selectedGenreList);
  //console.log(selectedLanguage);
  //console.log(selectedYear);

  return (
    <div className="movies-page" ref={movieListRef}>
      <div className="movies-header">
        <h1>Movies</h1>

        <div className="category-selector">
          <div
            className={`category-item-movie ${
              selectedCategory === "now_playing" ? "active" : ""
            }`}
            onClick={() => {
              setSelectedCategory("now_playing");
              setPage(1);
              setFiltersMenuExpanded(!FiltersMenuExpanded);
            }}
          >
            Now Playing
          </div>
          <div
            className={`category-item-movie ${
              selectedCategory === "top_rated" ? "active" : ""
            }`}
            onClick={() => {
              setSelectedCategory("top_rated");
              setPage(1);
              setFiltersMenuExpanded(!FiltersMenuExpanded);
            }}
          >
            Top Rated
          </div>
          <div
            className={`category-item-movie genre-category ${
              selectedCategory === "All Movies" ? "active" : ""
            }`}
            onClick={() => {
              setSelectedCategory("All Movies");
              setPage(1);
            }}
          >
            All Movies
          </div>
        </div>
      </div>

      {selectedCategory === "All Movies" && (
        <>
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
                      {Array.from(
                        { length: 5 },
                        (_, index) => 2023 - index
                      ).map((year) => (
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
                      ))}
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

          <div className="applied-filters">
            {appliedFilters.map((filter, index) => (
              <div className="filter-tag" key={index}>
                {filter.name}: {filter.value}
                <button
                  className="remove-filter-button"
                  onClick={() => removeFilter(index)}
                >
                  <AiFillCloseCircle />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* {selectedCategory === "All Movies" && (
        <div className="genre-dropdown-container">
          {showGenreDropdown ? (
            <div className="genre-dropdown">
              {genreLoading ? (
                <div className="genre-loading">Loading...</div>
              ) : (
                <>
                  <div className="placeholder">Select Genre</div>
                  {genreData?.genres.map((genre) => (
                    <div
                      className="genre-dropdown-item"
                      key={genre.id}
                      onClick={() => {
                        setSelectedGenre(genre);
                        setShowGenreDropdown(false);
                      }}
                    >
                      {genre.name}
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            <div
              className="selected-genre"
              onClick={() => setShowGenreDropdown(true)}
            >
              {selectedGenre ? selectedGenre.name : "Select Genre"}
            </div>
          )}
        </div>
      )} */}

      <div className="movies-section">
        {selectedCategory === "now_playing" && (
          <>
            <div className="movies-list">
              {!nowPlayingLoading &&
                nowPlayingData?.results?.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isLoading={nowPlayingLoading}
                  />
                ))}
            </div>
          </>
        )}
        {selectedCategory === "top_rated" && (
          <>
            <div className="movies-list">
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
        {selectedCategory === "All Movies" && (
          <>
            <h1>{selectedGenreList.name}</h1>
            <div className="movies-list">
              {!movieLoading &&
                movieData?.results?.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isLoading={movieLoading}
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

export default MoviesPage;
