import React from "react";
import "./ProfileCard.css";

const ProfileCard = ({ crew }) => {
  const { profile_path, job, name, character } = crew;
  const imageUrl = profile_path
    ? `https://image.tmdb.org/t/p/w185${profile_path}`
    : "https://via.placeholder.com/185x278.png?text=No+Image";

  return (
    <div className="profile-card">
      <div className="profile-image">
        <img src={imageUrl} alt={`${name} profile`} />
      </div>
      <div className="profile-job">
        {job
          ? job.split(" ").slice(0, 4).join(" ")
          : character.split(" ").slice(0, 3).join(" ")}
      </div>
      <div className="profile-name">{name}</div>
    </div>
  );
};

export default ProfileCard;
