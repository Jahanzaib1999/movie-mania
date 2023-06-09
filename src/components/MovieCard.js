import React, { createContext, useEffect } from "react";
import "./MovieCard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function MovieCard({ movie, isLoading }) {
  const navigate = useNavigate();
  const [showOverview, setShowOverview] = useState(false);
  const [isTvShow, setIsTvShow] = useState(false);
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    const setTv = () => {
      if (movie.name) {
        setIsTvShow(true);
      }
    };
    return setTv();
  }, []);

  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate(`/movie/${movie.id}`, { state: { isTvShow } });
    window.location.reload();
  };

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setDelayedLoading(isLoading);
    }, 2000);
    return () => clearTimeout(delayTimer);
  }, [isLoading]);

  return (
    <div
      className="movie-card-container"
      onClick={handleClick}
      onMouseEnter={() => setShowOverview(true)}
      onMouseLeave={() => setShowOverview(false)}
    >
      <div className="poster-container">
        {delayedLoading ? (
          <Skeleton height={"100%"} width={"100%"} /> // Skeleton with shimmer effect
        ) : movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        ) : (
          <p>No Poster found</p>
        )}
      </div>
      <div className="info-container">
        {delayedLoading ? (
          <Skeleton height={30} width={150} c /> // Skeleton with shimmer effect
        ) : isTvShow ? (
          <h3>
            {movie.name?.split(" ").splice(0, 6).join(" ")}{" "}
            {movie.name?.split(" ").length >= 7 && "..."}
          </h3>
        ) : (
          <h3>
            {movie.title?.split(" ").splice(0, 6).join(" ")}
            {movie.title?.split(" ").length >= 7 && "..."}
          </h3>
        )}
        {delayedLoading ? (
          <Skeleton height={20} width={60} /> // Skeleton with shimmer effect
        ) : movie.vote_average ? (
          <div className="rating">{movie.vote_average.toFixed(1)}</div>
        ) : (
          <p>N/A</p>
        )}
      </div>
      {showOverview && (
        <div className="overview-container">
          {delayedLoading ? (
            <Skeleton height={120} /> // Skeleton with shimmer effect
          ) : movie.overview ? (
            <p className="overview-text">{movie.overview}</p>
          ) : (
            <p>No Overview found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MovieCard;
