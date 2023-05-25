import React, { useContext, useEffect } from "react";
import "./LoginPage.css";
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { useSignup } from "../../hooks/useSignup";
import { useLogout } from "../../hooks/useLogout";
import { projectAuth } from "../../firebase/config";
import { AuthContext } from "../../context/AuthContext";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupName, setSignupName] = useState("");

  const auth = useAuthContext();

  const {
    error: logoutError,
    pending: logoutPending,
    handleLogout,
  } = useLogout();

  const { error: loginError, pending: loginPending, handleLogin } = useLogin();
  const {
    error: signupError,
    pending: signupPending,
    signupSuccess,
    handleSignup,
  } = useSignup();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      handleLogin(loginEmail, loginPassword);
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (
      signupEmail &&
      signupPassword &&
      signupConfirmPassword &&
      signupPassword === signupConfirmPassword
    ) {
      handleSignup(signupEmail, signupPassword, signupName).then(() => {
        if (signupSuccess) {
          setSignupEmail("");
          setSignupPassword("");
          setSignupConfirmPassword("");
          setSignupName("");
        }
      });
    }
  };

  return (
    <div className="login-signup-page">
      <div className="form-container">
        {auth.currentUser ? (
          <div className="already-logged-in">
            <p>You are successfully logged in with {auth.currentUser.email}</p>
            <button onClick={handleLogout} className="signout-button">
              {logoutPending ? "Logging out" : "Log Out"}
            </button>
            {logoutError && <p>{loginError.message}</p>}
          </div>
        ) : (
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <h2 className="form-title">Login</h2>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="login-email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="login-password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            {loginError && <div className="error">{loginError.message}</div>}
            <button
              type="submit"
              disabled={loginPending}
              className="form-submit-button"
            >
              {loginPending ? "Loading..." : "Login"}
            </button>
          </form>
        )}
      </div>

      <div className="form-divider" />

      <div className="form-container">
        <form className="signup-form" onSubmit={handleSignupSubmit}>
          <h2 className="form-title">Sign Up</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="signup-email"
              placeholder="Enter your email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="signup-password"
              placeholder="Enter a password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="signup-confirmPassword"
              placeholder="Confirm your password"
              value={signupConfirmPassword}
              onChange={(e) => setSignupConfirmPassword(e.target.value)}
            />
          </div>
          {signupPassword !== signupConfirmPassword && (
            <p>Passwords do not match</p>
          )}
          {signupError && <div className="error">{signupError.message}</div>}
          <button
            type="submit"
            disabled={signupPending}
            className="form-submit-button"
          >
            {signupPending ? "Loading..." : "Sign Up"}
          </button>
          {signupSuccess && (
            <p className="signup-msg">
              Signup successful! You can now login and start reviewing movies
              and tv shows
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
