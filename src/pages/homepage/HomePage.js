import "./HomePage.css";

import React from "react";

import useTmdb from "../../hooks/useTmdb";
import SwipeableGallery from "../../components/SwipeableGallery";

import HeaderBg from "../../assets/images/header-bg.jpg";

export default function HomePage() {
  const {
    data: moviePopularData,
    loading: moviePopularLoading,
    error: moviePopularError,
  } = useTmdb("/movie/popular");
  // const {
  //   data: movieLatestData,
  //   loading: movieLatestLoading,
  //   error: movieLatestError,
  // } = useTmdb("/movie/latest");
  const {
    data: movieTopRatedData,
    loading: movieTopRatedLoading,
    error: movieTopRatedError,
  } = useTmdb("/movie/top_rated");
  const {
    data: tvPopularData,
    loading: tvPopularLoading,
    error: tvPopularError,
  } = useTmdb("/tv/popular");
  // const {
  //   data: tvLatestData,
  //   loading: tvLatestLoading,
  //   error: tvLatestError,
  // } = useTmdb("/tv/latest");
  const {
    data: tvTopRatedData,
    loading: tvTopRatedLoading,
    error: tvTopRatedError,
  } = useTmdb("/tv/top_rated");
  // console.log(moviePopularData);
  return (
    <div className="home-page">
      {moviePopularLoading && <p>Loading popular movies...</p>}
      {moviePopularError && (
        <p>
          An error occurred while loading popular movies:
          {moviePopularError.message}
        </p>
      )}
      {tvPopularLoading && <p>Loading popular TV shows...</p>}
      {tvPopularError && (
        <p>
          An error occurred while loading popular TV shows:
          {tvPopularError.message}
        </p>
      )}
      {/* {movieLatestLoading && <p>Loading latest movies...</p>}
      {movieLatestError && (
        <p>
          An error occurred while loading latest movies:
          {movieLatestError.message}
        </p>
      )} */}
      {/* {tvLatestLoading && <p>Loading latest TV shows...</p>}
      {tvLatestError && (
        <p>
          An error occurred while loading latest TV shows:
          {tvLatestError.message}
        </p>
      )} */}
      {movieTopRatedLoading && <p>Loading top rated movies...</p>}
      {movieTopRatedError && (
        <p>
          An error occurred while loading top rated movies:
          {movieTopRatedError.message}
        </p>
      )}
      {tvTopRatedLoading && <p>Loading top rated TV shows...</p>}
      {tvTopRatedError && (
        <p>
          An error occurred while loading top rated TV shows:
          {tvTopRatedError.message}
        </p>
      )}

      {!moviePopularLoading && !moviePopularError && (
        <>
          <div
            className="popular-movies-container"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${HeaderBg})`,
            }}
          >
            <h2 className="section-header">Popular Movies</h2>

            {!moviePopularLoading && !moviePopularError && (
              <SwipeableGallery
                movies={moviePopularData.results}
                isLoading={moviePopularLoading}
              />
            )}
          </div>
        </>
      )}

      {!movieTopRatedLoading && !movieTopRatedError && (
        <>
          <div
            className="popular-tv-shows-container"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${HeaderBg})`,
            }}
          >
            <h2 className="section-header">Top rated movies</h2>

            {!movieTopRatedLoading && !movieTopRatedError && (
              <SwipeableGallery
                movies={movieTopRatedData.results}
                isLoading={movieTopRatedLoading}
              />
            )}
          </div>
        </>
      )}

      {/* {!movieLatestLoading && !movieLatestError && (
        <>
          <div className="latest-movies">
            <h2>Latest Movies</h2>
            {movieLatestData.map((movie) => (
              <p key={movie.id}>{movie.title}</p>
            ))}
          </div>
        </>
      )} */}

      {/* {!tvLatestLoading && !tvLatestError && (
        <>
          <div className="latest-tv-shows">
            <h2>Latest TV Shows</h2>
            {tvLatestData.map((movie) => (
              <p key={movie.id}>{movie.title}</p>
            ))}
          </div>
        </>
      )} */}

      {!tvPopularLoading && !tvPopularError && (
        <>
          <div
            className="popular-tv-shows-container"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${HeaderBg})`,
            }}
          >
            <h2 className="section-header">Popular TV Shows</h2>

            {!tvPopularLoading && !tvPopularError && (
              <SwipeableGallery
                movies={tvPopularData.results}
                isLoading={tvPopularLoading}
              />
            )}
          </div>
        </>
      )}

      {!tvTopRatedLoading && !tvTopRatedError && (
        <>
          <div
            className="popular-tv-shows-container"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${HeaderBg})`,
            }}
          >
            <h2 className="section-header">Top rated TV Shows</h2>

            {!tvTopRatedLoading && !tvTopRatedError && (
              <SwipeableGallery
                movies={tvTopRatedData.results}
                isLoading={tvTopRatedLoading}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
