import React, { useEffect, useState, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import useTmdb from "../../hooks/useTmdb";
import "./DetailPage.css";
import ReviewCard from "../../components/ReviewCard";
import { AuthContext, AuthProvider } from "../../context/AuthContext";
import { timestamp } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import ProfileCard from "../../components/ProfileCard";
import useFirestore from "../../hooks/useFirestore";
import useCollection from "../../hooks/useCollection";
import MovieCard from "../../components/MovieCard";

import { AiFillStar } from "react-icons/ai";

import Filter from "bad-words";

function DetailPage() {
  const [endpoint, setEndpoint] = useState("");
  const [reviewEndpoint, setReviewEndpoint] = useState("");
  const [similarEndpoint, setSimilarEndpoint] = useState("");

  const { id } = useParams();
  let { state } = useLocation();
  const { isTvShow } = state;
  const [genres, setGenres] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [movieCast, setMovieCast] = useState([]);

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState("");
  const [episodeOptions, setEpisodeOptions] = useState([]);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [ratingError, setRatingError] = useState("");

  const { addDocument, error, success } = useFirestore("reviews");

  const { documents: reviewDocuments, error: reviewDocumentsError } =
    useCollection("reviews");

  const handleReviewSubmit = () => {
    const user = auth.currentUser;

    const filter = new Filter();

    if (filter.isProfane(reviewText)) {
      // Discard the review
      console.log("Review contains bad words. Discarding...");

      // Inform the user about the issue
      alert(
        "Your review contains inappropriate language. Please remove the offensive words."
      );

      return; // Exit the function without adding the review to the database
    }

    const review = {
      userId: user.uid,
      author: user.displayName,
      email: user.email,
      movieId: id,
      isTvShow: isTvShow,
      content: reviewText,
      rating: rating,
      created_at: timestamp
        .now()
        .toDate()
        .toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split("/")
        .reverse()
        .join("-"),
    };

    addDocument(review);
    setReviewText("");
    setRating(0);
    setSubmitEnabled(false);

    if (error) {
      console.log("Error adding review: ", error);
    } else {
    }
  };

  const handleRatingChange = (e) => {
    const value = parseInt(e.target.value);

    if (value > 10 || value < 0) {
      setRatingError("Rating needs to be between 0 and 10");
      setSubmitEnabled(false);
    } else {
      setRatingError("");
      setRating(value);
      setSubmitEnabled(true);
    }
  };

  const auth = useAuthContext();

  let isMounted = true;

  const {
    data: movieData,
    loading: movieLoading,
    error: movieError,
  } = useTmdb(endpoint);
  const {
    data: reviewData,
    loading: reviewLoading,
    error: reviewError,
  } = useTmdb(reviewEndpoint);
  const {
    data: episodeData,
    loading: episodeLoading,
    error: episodeError,
  } = useTmdb(`/tv/${id}/season/${selectedSeason}`);

  const {
    data: movieCreditData,
    loading: movieCreditLoading,
    error: movieCreditError,
  } = useTmdb(`/movie/${id}/credits`);

  const {
    data: similarData,
    loading: similarLoading,
    error: similarError,
  } = useTmdb(similarEndpoint);

  useEffect(() => {
    const set = () => {
      if (isTvShow !== undefined) {
        if (isTvShow) {
          setEndpoint(`/tv/${id}`);
          setReviewEndpoint(`/tv/${id}/reviews`);
          setSimilarEndpoint(`/tv/${id}/similar`);
        } else {
          setEndpoint(`/movie/${id}`);
          setReviewEndpoint(`/movie/${id}/reviews`);
          setSimilarEndpoint(`/movie/${id}/similar`);
        }
      }
    };

    set();

    return () => {
      isMounted = false;
    };
  }, [isTvShow, id]);

  useEffect(() => {
    if (isMounted && movieData && movieCreditData) {
      setGenres(movieData.genres);
      setCompanies(movieData.production_companies);
      setMovieCast(movieCreditData.cast);
    }

    return () => {
      setGenres([]);
      setCompanies([]);
      setMovieCast([]);
    };
  }, [isMounted, movieData, movieCreditData]);

  useEffect(() => {
    if (isMounted && reviewData) {
      const filteredReviewDocuments = reviewDocuments.filter(
        (doc) => doc.movieId === id
      );
      setReviews((prevReviews) => [
        ...prevReviews,
        ...(Array.isArray(reviewData.results) ? reviewData.results : []),
        ...filteredReviewDocuments,
      ]);
    }
    return () => {
      setReviews([]);
    };
  }, [isMounted, reviewData, reviewDocuments, id]);

  const backgroundImage =
    movieData &&
    `url(https://image.tmdb.org/t/p/original${movieData.backdrop_path})`;

  const posterImage =
    movieData &&
    `url(https://image.tmdb.org/t/p/original${movieData.poster_path})`;

  const handleSeasonSelect = (event) => {
    const seasonNumber = parseInt(event.target.value, 10);
    setSelectedSeason(seasonNumber);

    if (seasonNumber !== null) {
      // Get the episode count of the selected season
      const selectedSeasonObject = movieData?.seasons?.find(
        (season) => season.season_number === Number(seasonNumber)
      );
      const episodeCount = selectedSeasonObject.episode_count;

      // Generate the episode options based on the episode count
      const episodeOptions = [];
      for (let i = 1; i <= episodeCount; i++) {
        episodeOptions.push(i);
      }

      // Set the first episode as the default selected episode
      setSelectedEpisode(episodeOptions[0]);

      // Set the episode options for the episode dropdown
      setEpisodeOptions(episodeOptions);
    } else {
      setSelectedEpisode("");
      setEpisodeOptions([]);
    }
  };

  const handleEpisodeSelect = (event) => {
    setSelectedEpisode(event.target.value);
  };

  function calculateAverageRuntime(episodes) {
    const totalRuntime = episodes.reduce(
      (accumulator, episode) => accumulator + (episode.runtime || 0),
      0
    );
    const averageRuntime = totalRuntime / episodes.length;
    return Math.round(averageRuntime);
  }

  useEffect(() => {
    const set = () => {
      if (isTvShow !== undefined) {
        if (isTvShow) {
          setEndpoint(`/tv/${id}`);
          setReviewEndpoint(`/tv/${id}/reviews`);
        } else {
          setEndpoint(`/movie/${id}`);
          setReviewEndpoint(`/movie/${id}/reviews`);
        }
      }
    };

    set();

    return () => {
      isMounted = false;
    };
  }, [isTvShow, id]);

  return (
    <div className="movie-detail-page">
      {movieLoading && <p className="loading">Loading Details...</p>}
      {!movieLoading && (
        <>
          <div className="movie-backdrop" style={{ backgroundImage }}>
            {/* <div className="poster-container">
              <img
                className="poster-image"
                src={posterImage}
                alt="Movie Poster"
              />
            </div> */}
            {posterImage && (
              <div
                className="movie-poster"
                style={{ backgroundImage: posterImage }}
              ></div>
            )}
          </div>
          <div className="details-container">
            <div className="title">
              {movieData && isTvShow ? (
                <h2 className="heading">{movieData.name}</h2>
              ) : (
                <h2 className="heading">{movieData.title}</h2>
              )}
              {/* <div className="genres-container">
                {genres &&
                  genres.map((genre) => (
                    <p key={genre.id} className="genre">
                      {genre.name}
                    </p>
                  ))}
              </div> */}
            </div>
            <div className="detail-body">
              <div className="vote-date-time-div">
                <div className="vote-average">
                  <AiFillStar color="#000" />
                  <p className="vote-average-text">
                    {movieData.vote_average
                      ? movieData.vote_average.toFixed(1)
                      : "N/A"}
                  </p>
                </div>

                <div className="divider"></div>

                <div className="runtime">
                  <div className="runtime-main">
                    {isTvShow ? (
                      <p className="runtime-text">
                        {episodeData && episodeData.episodes?.length > 0
                          ? `${calculateAverageRuntime(
                              episodeData.episodes
                            )} mins`
                          : "N/A"}
                      </p>
                    ) : (
                      <p className="runtime-text">
                        {movieData.runtime
                          ? `${movieData.runtime} mins`
                          : "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="divider"></div>

                <div className="release-date">
                  {isTvShow ? (
                    <p className="first-air-date">
                      {movieData.first_air_date
                        ? new Date(movieData.first_air_date).toLocaleDateString(
                            "en-GB"
                          )
                        : "N/A"}
                    </p>
                  ) : (
                    <p className="release-date-text">
                      {movieData.release_date
                        ? new Date(movieData.release_date).toLocaleDateString(
                            "en-GB"
                          )
                        : "N/A"}
                    </p>
                  )}
                </div>
              </div>

              <div className="overview">
                <h2 className="heading">Overview:</h2>
                <p className="text-body">
                  {movieData.overview || "No overview available"}
                </p>
              </div>

              <div className="genres">
                <h2 className="heading">Genre:</h2>
                <div className="genres-container">
                  {genres &&
                    genres.map((genre) => (
                      <p key={genre.id} className="genre">
                        {genre.name}
                      </p>
                    ))}
                </div>
              </div>

              <div className="countries">
                <h2 className="heading">Country:</h2>
                {movieData.production_countries &&
                movieData.production_countries.length > 0 ? (
                  <p className="text-body">
                    {movieData.production_countries
                      .map((country) => country.name)
                      .join(", ")}
                  </p>
                ) : (
                  <p>No country information available</p>
                )}
              </div>

              <h2 className="heading">Production Companies:</h2>
              <div className="companies-container">
                {companies &&
                  companies.slice(0, 4).map((company) => (
                    <div className="company" key={company.id}>
                      {company.name && (
                        <p className="company-name">{company.name}</p>
                      )}
                      {company.logo_path && (
                        <img
                          className="company-logo"
                          alt="&copy;"
                          src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                        />
                      )}
                    </div>
                  ))}
              </div>

              {isTvShow && (
                <>
                  <h2 className="heading">Seasons & Episodes:</h2>
                  <div className="season-episode-container">
                    <div className="season-dropdown">
                      <h2 htmlFor="season-select" className="heading">
                        Season:
                      </h2>
                      <select id="season-select" onChange={handleSeasonSelect}>
                        <option value="">--Select a season--</option>
                        {movieLoading && <option disabled>Loading...</option>}
                        {!movieLoading &&
                          movieData?.seasons?.map((season) => (
                            <option
                              key={season.id}
                              value={season.season_number}
                            >
                              Season {season.season_number}
                            </option>
                          ))}
                      </select>
                    </div>
                    {selectedSeason !== null && (
                      <div className="episode-dropdown">
                        <h2 className="heading">Episode:</h2>
                        <select
                          id="episode-select"
                          onChange={handleEpisodeSelect}
                          value={selectedEpisode}
                        >
                          {episodeOptions.map((option) => (
                            <option key={option} value={option}>
                              Episode {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedEpisode && episodeData && (
                <>
                  <h2 className="heading">Details:</h2>
                  <div className="episode-card">
                    <h3>{episodeData.episodes[selectedEpisode - 1].name}</h3>
                    <div className="episode-details">
                      <div className="airdate-runtime">
                        <div className="airdate">
                          {episodeData.episodes[selectedEpisode - 1].air_date
                            ? episodeData.episodes[selectedEpisode - 1].air_date
                            : "N/A"}
                        </div>
                        <div className="runtime">
                          {episodeData.episodes[selectedEpisode - 1].runtime
                            ? `${
                                episodeData.episodes[selectedEpisode - 1]
                                  .runtime
                              } mins`
                            : "N/A"}
                        </div>
                      </div>

                      <p className="episode-overview">
                        {episodeData.episodes[selectedEpisode - 1].overview}
                      </p>

                      {episodeData.episodes[selectedEpisode - 1].guest_stars
                        .length > 0 ||
                      episodeData.episodes[selectedEpisode - 1].crew.length >
                        0 ? (
                        <>
                          {episodeData.episodes[selectedEpisode - 1].guest_stars
                            .length > 0 && (
                            <>
                              <h3>Cast:</h3>
                              <div className="crew-list">
                                {[
                                  ...new Set(
                                    episodeData.episodes[
                                      selectedEpisode - 1
                                    ].guest_stars.map((star) => star.id)
                                  ),
                                ].map((id) => {
                                  const star = episodeData.episodes[
                                    selectedEpisode - 1
                                  ].guest_stars.find((star) => star.id === id);
                                  return (
                                    <ProfileCard crew={star} key={star.id} />
                                  );
                                })}
                              </div>
                            </>
                          )}

                          {episodeData.episodes[selectedEpisode - 1].crew
                            .length > 0 && (
                            <>
                              <h3>Crew:</h3>
                              <div className="crew-list">
                                {episodeData.episodes[selectedEpisode - 1].crew
                                  .filter((crew, index, arr) => {
                                    return (
                                      arr.findIndex((c) => c.id === crew.id) ===
                                      index
                                    );
                                  })
                                  .map((crew) => (
                                    <ProfileCard crew={crew} key={crew.id} />
                                  ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <p>No cast or crew data available</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {!isTvShow && (
                <>
                  <h2 className="heading">Cast:</h2>
                  <div className="crew-list">
                    {movieCreditLoading && <p>Loading...</p>}
                    {!movieCreditLoading &&
                      movieCast?.map((castMember) => (
                        <ProfileCard key={castMember.id} crew={castMember} />
                      ))}
                  </div>
                </>
              )}

              {similarLoading && (
                <p className="loading">Loading Similar Content...</p>
              )}
              {similarData?.results?.length > 0 && (
                <div className="similar-content">
                  <h2 className="heading">
                    Similar {isTvShow ? "TV Series" : "Movies"}
                  </h2>
                  <div className="similar-content-container">
                    {similarData?.results.slice(0, 10).map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                </div>
              )}

              <h2 className="heading">Reviews</h2>

              <div className="review-container">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <p>No reviews yet</p>
                )}
              </div>
              <label className="review-label">Leave a review:</label>
              <div className="review-input-container">
                {auth.currentUser ? (
                  <>
                    <textarea
                      rows={5}
                      cols={30}
                      type="text"
                      placeholder="Enter your review here"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      maxLength={100}
                      className="review-text-area"
                    />
                    <input
                      type="number"
                      placeholder="Enter rating out of 10"
                      min={0}
                      max={10}
                      value={rating}
                      onChange={handleRatingChange}
                      className="review-input-number"
                    />
                    {ratingError && (
                      <div className="rating-error">{ratingError}</div>
                    )}
                    <button
                      onClick={handleReviewSubmit}
                      disabled={!submitEnabled}
                    >
                      Submit
                    </button>
                    {success && (
                      <p className="success-msg">Review successfully added</p>
                    )}
                  </>
                ) : (
                  <button
                    className="review-login-button"
                    onClick={() => (window.location.href = "/login")}
                  >
                    Login to leave a review
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DetailPage;

// <div className="movie-detail-page" style={{ backgroundImage }}>
//   {movieLoading && <p className="loading">Loading Details...</p>}
//   {!movieLoading && (
//     <>
//       <div className="details-container">
//         <div className="title">
//           {movieData && isTvShow ? (
//             <h2>{movieData.name}</h2>
//           ) : (
//             <h2>{movieData.title}</h2>
//           )}
//         </div>
//         <div className="genres-container">
//           {genres &&
//             genres.map((genre) => (
//               <p key={genre.id} className="genre">
//                 {genre.name}
//               </p>
//             ))}
//         </div>

//         <div className="overview">
//           <p className="overview-text">
//             {movieData.overview || "No overview available"}
//           </p>
//         </div>
//         <div className="release-date">
//           {isTvShow ? (
//             <p className="first-air-date">
//               First Air Data: {movieData.first_air_date || "N/A"}
//             </p>
//           ) : (
//             <p className="release-date-text">
//               Release Date: {movieData.release_date || "N/A"}
//             </p>
//           )}
//         </div>

//         <div className="vote-average">
//           <p className="vote-average-text">
//             Vote Average:{" "}
//             {movieData.vote_average
//               ? movieData.vote_average.toFixed(1)
//               : "N/A"}
//           </p>
//         </div>

//         {!isTvShow && (
//           <div className="runtime-main">
//             <p className="runtime-text">
//               Runtime:{" "}
//               {movieData.runtime ? `${movieData.runtime} mins` : "N/A"}
//             </p>
//           </div>
//         )}
//         <h3>Production Companies:</h3>
//         <div className="companies-container">
//           {companies &&
//             companies.slice(0, 4).map((company) => (
//               <div className="company" key={company.id}>
//                 {company.name && (
//                   <p className="company-name">{company.name}</p>
//                 )}
//                 {company.logo_path && (
//                   <img
//                     className="company-logo"
//                     alt="&copy;"
//                     src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
//                   />
//                 )}
//               </div>
//             ))}
//         </div>

// {isTvShow && (
//   <div className="season-episode-container">
//     <div className="season-dropdown">
//       <label>Season:</label>
//       <select onChange={handleSeasonSelect}>
//         <option value="">--Select a season--</option>
//         {movieLoading && <p>Loading...</p>}
//         {!movieLoading &&
//           movieData?.seasons?.map((season) => (
//             <option key={season.id} value={season.season_number}>
//               Season {season.season_number}
//             </option>
//           ))}
//       </select>
//     </div>
//     {selectedSeason && (
//       <div className="episode-dropdown">
//         <label>Episode:</label>
//         <select
//           onChange={handleEpisodeSelect}
//           value={selectedEpisode}
//         >
//           {episodeOptions.map((option) => (
//             <option key={option} value={option}>
//               Episode {option}
//             </option>
//           ))}
//         </select>
//       </div>
//     )}
//   </div>
// )}

// {selectedEpisode && episodeData && (
//   <div className="episode-card">
//     <h3>{episodeData.episodes[selectedEpisode - 1].name}</h3>
//     <div className="episode-details">
//       <div className="airdate-runtime">
//         <div className="airdate">
//           {episodeData.episodes[selectedEpisode - 1].air_date
//             ? episodeData.episodes[selectedEpisode - 1].air_date
//             : "N/A"}
//         </div>
//         <div className="runtime">
//           {episodeData.episodes[selectedEpisode - 1].runtime
//             ? `${
//                 episodeData.episodes[selectedEpisode - 1].runtime
//               } mins`
//             : "N/A"}
//         </div>
//       </div>

//       <p className="episode-overview">
//         {episodeData.episodes[selectedEpisode - 1].overview}
//       </p>

//       {episodeData.episodes[selectedEpisode - 1].crew.length >
//         0 && (
//         <>
//           <h3>Cast:</h3>
//           <div className="crew-list">
//             {[
//               ...new Set(
//                 episodeData.episodes[
//                   selectedEpisode - 1
//                 ].guest_stars.map((star) => star.id)
//               ),
//             ].map((id) => {
//               const star = episodeData.episodes[
//                 selectedEpisode - 1
//               ].guest_stars.find((star) => star.id === id);
//               return <ProfileCard crew={star} key={star.id} />;
//             })}
//           </div>

//           <h3>Crew:</h3>
//           <div className="crew-list">
//             {episodeData.episodes[selectedEpisode - 1].crew
//               .filter((crew, index, arr) => {
//                 return (
//                   arr.findIndex((c) => c.id === crew.id) === index
//                 );
//               })
//               .map((crew) => (
//                 <ProfileCard crew={crew} key={crew.id} />
//               ))}
//           </div>
//         </>
//       )}
//     </div>
//   </div>
// )}

// {!isTvShow && (
//   <>
//     <h3>Cast:</h3>
//     <div className="crew-list">
//       {movieCreditLoading && <p>Loading...</p>}
//       {!movieCreditLoading &&
//         movieCast?.map((castMember) => (
//           <ProfileCard key={castMember.id} crew={castMember} />
//         ))}
//     </div>
//   </>
// )}
//       </div>

// <div className="review-container">
//   <h1>Reviews</h1>
//   {reviews && reviews.length > 0 ? (
//     reviews.map((review) => (
//       <ReviewCard key={review.id} review={review} />
//     ))
//   ) : (
//     <p>No reviews yet</p>
//   )}
//   <div className="review-input">
//     <label>Leave a review:</label>
//     {auth.currentUser ? (
//       <>
//         <textarea
//           rows={5}
//           cols={30}
//           type="text"
//           placeholder="Enter your review here"
//           value={reviewText}
//           onChange={(e) => setReviewText(e.target.value)}
//           maxLength={100}
//         />
//         <input
//           type="number"
//           placeholder="Enter rating out of 10"
//           min={0}
//           max={10}
//           value={rating}
//           onChange={handleRatingChange}
//         />
//         {ratingError && (
//           <div className="rating-error">{ratingError}</div>
//         )}
//         <button
//           onClick={handleReviewSubmit}
//           disabled={!submitEnabled}
//         >
//           Submit
//         </button>
//         {success && (
//           <p className="success-msg">Review successfully added</p>
//         )}
//       </>
//     ) : (
//       <button
//         className="review-login-button"
//         onClick={() => (window.location.href = "/login")}
//       >
//         Login to leave a review
//       </button>
//     )}
//   </div>
// </div>
//     </>
//   )}
// </div>
