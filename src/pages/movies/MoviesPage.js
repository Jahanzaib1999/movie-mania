import React, { useEffect, useRef, useState } from "react";
import MovieCard from "../../components/MovieCard";
import useTmdb from "../../hooks/useTmdb";
import "./MoviesPage.css";

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

function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState(
    JSON.parse(localStorage.getItem("selectedGenre")) || null
  );
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory") ||
      "now_playing" ||
      "top_rated" ||
      "Genre"
  );
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [page, setPage] = useState(parseInt(localStorage.getItem("page")) || 1);

  const { data: genreData, loading: genreLoading } =
    useTmdb("/genre/movie/list");

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
    `page=${page}&with_genres=${selectedGenre?.id || ""}`
  );

  function handleNextPageClick() {
    setPage(page + 1);
  }

  function handlePrevPageClick() {
    setPage(page - 1);
  }

  const movieListRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory);
    localStorage.setItem("page", page);
    localStorage.setItem("selectedGenre", JSON.stringify(selectedGenre));
  }, [selectedCategory, page, selectedGenre]);

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
              setSelectedGenre({});
              setPage(1);
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
              setSelectedGenre({});
              setPage(1);
            }}
          >
            Top Rated
          </div>
          <div
            className={`category-item-movie genre-category ${
              selectedCategory === "Genre" ? "active" : ""
            }`}
            onClick={() => {
              setShowGenreDropdown(!showGenreDropdown);
              setSelectedCategory("Genre");
              setPage(1);
            }}
          >
            Genre
          </div>
        </div>
      </div>

      {/* {showGenreDropdown && (
        <div className="genre-dropdown">
          {genreLoading ? (
            <div>Loading...</div>
          ) : (
            genreData.genres.map((genre) => (
              <div
                className="genre-dropdown-item"
                key={genre.id}
                onClick={() => {
                  setSelectedGenre(genre);
                  setSelectedCategory("Genre");
                  setShowGenreDropdown(false);
                }}
              >
                {genre.name}
              </div>
            ))
          )}
        </div>
      )} */}

      {selectedCategory === "Genre" && (
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
                      setSelectedGenre(genre);
                      setSelectedCategory("Genre");
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
            {selectedGenre.name === null ? "Select Genre" : selectedGenre.name}
          </div>
        </div>
      )}

      <div className="movies-section">
        {selectedCategory === "now_playing" && (
          <>
            <div className="movies-list">
              {nowPlayingLoading ? (
                <div>Loading...</div>
              ) : (
                nowPlayingData.results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              )}
            </div>
          </>
        )}
        {selectedCategory === "top_rated" && (
          <>
            <div className="movies-list">
              {topRatedLoading ? (
                <div>Loading...</div>
              ) : (
                topRatedData.results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              )}
            </div>
          </>
        )}
        {selectedCategory === "Genre" && selectedGenre && (
          <>
            <h1>{selectedGenre.name}</h1>
            <div className="movies-list">
              {movieLoading ? (
                <div>Loading...</div>
              ) : (
                movieData.results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              )}
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
