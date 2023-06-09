import React from "react";
import "./Footer.css";

import {
  AiFillInstagram,
  AiFillTwitterSquare,
  AiFillFacebook,
} from "react-icons/ai";

import MovieManiaLogo from "../assets/images/movie-mania-logo.png";
import TMDBLogo from "../assets/images/tmdb-logo.png";

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* <div className="footer-logo">
        <img src="logo.png" alt="Logo" className="logo" />
        <span className="logo-text">Your Website</span>
      </div> */}
      <div className="links-container">
        <h2 className="footer-heading">Links</h2>
        <div className="footer-links">
          <a href="/home">Home</a>
          <a href="/movies">Movies</a>
          <a href="/series">Tv Series</a>
          <a href="/contact">Contact</a>
          <a href="/login">Login</a>
          <a href="/pricing">Pricing</a>
          <a href="/">Terms of Service</a>
        </div>
        <h2 className="footer-heading">Socials</h2>
        <div className="footer-social">
          <div className="social-link">
            <AiFillFacebook />
          </div>
          <div className="social-link">
            <AiFillTwitterSquare />
          </div>
          <div className="social-link">
            <AiFillInstagram />
          </div>
        </div>
      </div>

      <div className="footer-text">
        <h2 className="footer-heading">About Us</h2>
        <p>
          &copy; {new Date().getFullYear()} MovieMania. All rights reserved.
          MovieMania is a free movie and tv show browsing and reviewing website
          with zero ads. MovieMania uses the TMDB API for the data on this
          website.
        </p>
        <p className="second-text">
          This site does not store any files on our server, we only linked to
          the media which is hosted on 3rd party services.
        </p>
        <div className="footer-logos">
          <a href="/">
            <img src={MovieManiaLogo} className="footer-logo" />
          </a>
          <a href="/">
            <img
              src={TMDBLogo}
              className="footer-logo"
              style={{ scale: "0.6" }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
