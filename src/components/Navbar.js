import "./Navbar.css";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { AuthContext } from "../context/AuthContext";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

import { HiMenu } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { BsSearch } from "react-icons/bs";

import MovieManiaLogo from "../assets/images/movie-mania-logo.png";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const auth = useAuthContext();

  const dropdownContainerRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  const dropdownSearchRef = useRef(null);

  const [showMenu, setShowMenu] = useState(false);

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const [showSearchbar, setShowSearchBar] = useState(false);

  const handleSearchDropdown = () => {
    setShowSearchBar(!showSearchbar);
  };

  const [prevScrollpos, setPrevScrollpos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollpos = window.pageYOffset;
      if (prevScrollpos > currentScrollpos) {
        // User is scrolling up
        document.querySelector(".navbar").style.top = "0px";
      } else {
        // User is scrolling down
        document.querySelector(".navbar").style.top = "-150px";
      }
      setPrevScrollpos(currentScrollpos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollpos]);

  useEffect(() => {
    // Function to close the dropdown when a user clicks outside of it
    function handleClickOutside(event) {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
      if (
        dropdownSearchRef.current &&
        !dropdownSearchRef.current.contains(event.target)
      ) {
        setShowSearchBar(false);
      }
    }

    // Add event listener to document to listen for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownContainerRef]);

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < 768);
    }
    handleResize(); // set initial state based on viewport width
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    error: logoutError,
    pending: logoutPending,
    handleLogout,
  } = useLogout();

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearch(searchValue);
    navigate(`/search?q=${encodeURIComponent(searchValue)}`);
  };

  return (
    <nav className="navbar">
      <div className="logo-and-ul">
        <div className="menu-button-div">
          {showMenu ? (
            <MdClose
              className="menu-button"
              size={32}
              onClick={handleToggleMenu}
            />
          ) : (
            <HiMenu
              className="menu-button"
              size={32}
              onClick={handleToggleMenu}
            />
          )}
        </div>
        <Link to="/" className="nav-link">
          <img src={MovieManiaLogo} className="logo" />
        </Link>

        <ul
          //ref={dropdownMenuRef}
          style={showMenu ? { display: `${showMenu ? "flex" : "none"}` } : {}}
        >
          <li>
            <NavLink to="/" className="nav-link" onClick={handleToggleMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/movies"
              className="nav-link"
              onClick={handleToggleMenu}
            >
              Movies
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/series"
              className="nav-link"
              onClick={handleToggleMenu}
            >
              TV Series
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className="nav-link"
              onClick={handleToggleMenu}
            >
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pricing"
              className="nav-link"
              onClick={handleToggleMenu}
            >
              Pricing
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              className="nav-link"
              onClick={handleToggleMenu}
            >
              Login
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="search-profile-div">
        <div className="search-container">
          <BsSearch
            size={32}
            className="search-icon"
            onClick={handleSearchDropdown}
          />
          <input
            style={
              showSearchbar
                ? { display: `${showSearchbar ? "flex" : "none"}` }
                : {}
            }
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search"
            className="search-bar"
            ref={dropdownSearchRef}
          />
        </div>

        <div className="user-profile">
          <div
            className="circle"
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
            }}
          >
            {auth.currentUser?.email?.charAt(0).toUpperCase()}
          </div>

          {dropdownOpen && (
            <div className="dropdown-container" ref={dropdownContainerRef}>
              <div className="user-initial-circle">
                {auth.currentUser?.email?.charAt(0).toUpperCase()}
              </div>
              {auth.currentUser ? (
                <>
                  <p className="login-msg">
                    Logged In as {auth.currentUser.displayName}
                  </p>
                  <button
                    disabled={logoutPending}
                    onClick={handleLogout}
                    className="signout-button-navbar"
                  >
                    {logoutPending ? "Logging out" : "Log Out"}
                  </button>
                </>
              ) : (
                <>
                  <p>Not Logged In</p>
                  <Link to="/login" className="login-link">
                    Login
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
