import React from "react";
import { useState, useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import DetailedMovieCard from "./DetailedMovieCard";
import "./SwipeableGallery.css";

function SwipeableGallery({ movies, isLoading }) {
  const [index, setIndex] = useState(0);
  const [backdropUrl, setBackdropUrl] = useState("");

  const handleChangeIndex = (newIndex) => {
    if (newIndex >= 0 && newIndex < movies.length) {
      setIndex(newIndex);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleChangeIndex((index + 1) % movies.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [index, movies.length]);

  useEffect(() => {
    const fetchBackdropUrl = async () => {
      try {
        const response = await fetch(
          `https://image.tmdb.org/t/p/w500${movies[index].backdrop_path}`
        );
        if (response.ok) {
          const backdropUrl = response.url;
          setBackdropUrl(backdropUrl);
        } else {
          setBackdropUrl(null); // Set backdrop URL to null if there is an error
        }
      } catch (error) {
        setBackdropUrl(null); // Set backdrop URL to null in case of an exception
      }
    };

    fetchBackdropUrl();
  }, [movies, index]);

  return (
    <div
      className="swipeable-gallery"
      // style={{
      //   backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
      //   backgroundSize: "contain",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
    >
      <div className="swipeable-view-container">
        <SwipeableViews
          index={index}
          onChangeIndex={handleChangeIndex}
          enableMouseEvents
        >
          {movies.map((movie) => (
            <div className="swipeable-card-container" key={movie.id}>
              <DetailedMovieCard movie={movie} isLoading={isLoading} />
            </div>
          ))}
        </SwipeableViews>
        {/* <div className="arrow-container">
          <div
            className="left-arrow-button"
            onClick={() => handleChangeIndex(index - 1)}
          >
            <i className="fas fa-arrow-left"></i>
          </div>
          <div
            className="right-arrow-button"
            onClick={() => handleChangeIndex(index + 1)}
          >
            <i className="fas fa-arrow-right"></i>
          </div>
        </div> */}
        <div className="dots-container">
          {movies.map((_, idx) => (
            <div
              key={idx}
              className={`dot ${idx === index ? "active" : ""}`}
              onClick={() => handleChangeIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default SwipeableGallery;
