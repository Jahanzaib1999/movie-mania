import React from "react";
import { useState, useEffect } from "react";
import "./DetailedMovieCard.css";
import { Link } from "react-router-dom";
import useTmdb from "../hooks/useTmdb";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DetailedMovieCard = ({ movie, isLoading }) => {
  const [isTvShow, setIsTvShow] = useState(false);
  const [genres, setGenres] = useState([]);
  const [shortOverview, setShortOverview] = useState("");
  const [delayedLoading, setDelayedLoading] = useState(true);

  const { data: genreData, loading: genreLoading } =
    useTmdb("/genre/movie/list");

  useEffect(() => {
    const setTv = () => {
      if (movie.name) {
        setIsTvShow(true);
      }
    };
    return setTv();
  }, [movie]);

  useEffect(() => {
    if (!genreLoading && genreData) {
      const movieGenres = genreData.genres?.filter((genre) =>
        movie.genre_ids.includes(genre.id)
      );
      setGenres(movieGenres?.map((genre) => genre.name));
    }

    const firstFiftyWords = movie.overview.split(" ").slice(0, 50).join(" ");
    setShortOverview(firstFiftyWords);
  }, [genreData, genreLoading, movie]);

  // useEffect(() => {
  //   const delayTimer = setTimeout(() => {
  //     setDelayedLoading(isLoading);
  //   }, 2000);
  //   return () => clearTimeout(delayTimer);
  // }, [isLoading]);

  return (
    <div className="wrapper">
      <div className="main_card">
        <div className="card_left">
          <div className="card_datails">
            <h1>{isTvShow ? movie.name : movie.title}</h1>
            <div className="card_cat">
              <p className="PG">{movie.adult ? "18+" : "PG-13"}</p>
              <p className="date">
                {isTvShow
                  ? movie.first_air_date?.slice(0, 4)
                  : movie.release_date?.slice(0, 4)}
              </p>
              {
                <p className="genre-div">
                  {genres.length > 0 ? genres.slice(0, 3).join(" | ") : "N/A"}
                </p>
              }
              <p className="vote">{movie.vote_average}</p>
            </div>
            <div className="disc">
              <p>{shortOverview}...</p>
            </div>
            <Link
              to={`/movie/${movie.id}`}
              state={{ isTvShow }}
              className="link"
            >
              Read More
            </Link>
          </div>
        </div>

        <div className="card_right">
          <div className="img_container">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={isTvShow ? movie.name : movie.title}
            />
          </div>

          {/* <div className="play_btn">
            <Link
              to={`/movie/${movie.id}`}
              state={{ isTvShow }}
              className="link"
            >
              <i className="fas fa-info-circle"></i>
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DetailedMovieCard;
