import React from "react";
import { useState, useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import DetailedMovieCard from "./DetailedMovieCard";
import "./SwipeableGallery.css";

function SwipeableGallery({ movies }) {
  const [index, setIndex] = useState(0);

  const handleChangeIndex = (newIndex) => {
    if (newIndex >= 0 && newIndex < movies.length) {
      setIndex(newIndex);
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     handleChangeIndex((index + 1) % movies.length);
  //   }, 3500);
  //   return () => clearInterval(interval);
  // }, [index, movies.length]);

  return (
    <div className="swipeable-gallery">
      <div className="swipeable-view-container">
        <SwipeableViews
          index={index}
          onChangeIndex={handleChangeIndex}
          enableMouseEvents
        >
          {movies.map((movie) => (
            <div className="swipeable-card-container" key={movie.id}>
              <DetailedMovieCard movie={movie} />
            </div>
          ))}
        </SwipeableViews>
        <div className="arrow-container">
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
        </div>
      </div>
    </div>
  );
}
export default SwipeableGallery;
