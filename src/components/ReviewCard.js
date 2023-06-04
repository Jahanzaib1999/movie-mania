import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import "./ReviewCard.css";

function ReviewCard({ review }) {
  const auth = useAuthContext();

  const isCurrentUser =
    auth?.currentUser?.uid !== null &&
    auth?.currentUser?.uid !== undefined &&
    auth?.currentUser?.uid === review?.userId;

  // console.log(auth.currentUser?.uid);
  // console.log(review?.userId);
  // console.log(isCurrentUser);
  const cardStyle = {
    border: isCurrentUser
      ? "1px solid rgba(85, 76, 217)"
      : "1px solid lightgray",
    backgroundColor: isCurrentUser ? `rgba(85, 76, 217, 0.5)` : "",
  };

  return (
    <div className="review-card" style={cardStyle}>
      <div className="review-header">
        <div
          className="review-avatar"
          style={{ backgroundColor: review.avatarColor }}
        >
          {review.author[0].toUpperCase()}
        </div>
        <div className="review-author">{review.author}</div>
        <div className="review-date">{review.created_at.slice(0, 4)}</div>
      </div>
      <div className="review-content">
        {review.content.split(" ").slice(0, 40).join(" ")}
      </div>
    </div>
  );
}

export default ReviewCard;
