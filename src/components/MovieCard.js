import React, { createContext, useEffect } from "react";
import "./MovieCard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [showOverview, setShowOverview] = useState(false);

  const [isTvShow, setIsTvShow] = useState(false);

  useEffect(() => {
    const setTv = () => {
      if (movie.name) {
        setIsTvShow(true);
      }
    };
    return setTv();
  }, []);

  const handleClick = () => {
    navigate(`/movie/${movie.id}`, { state: { isTvShow } });
  };

  return (
    <div
      className="movie-card-container"
      onClick={handleClick}
      onMouseEnter={() => setShowOverview(true)}
      onMouseLeave={() => setShowOverview(false)}
    >
      <div className="poster-container">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        ) : (
          <p>No Poster found</p>
        )}
      </div>
      <div className="info-container">
        {isTvShow ? (
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
        {movie.vote_average ? (
          <div className="rating">{movie.vote_average.toFixed(1)}</div>
        ) : (
          <p>No Rating found</p>
        )}
      </div>
      {showOverview && (
        <div className="overview-container">
          {movie.overview ? (
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
