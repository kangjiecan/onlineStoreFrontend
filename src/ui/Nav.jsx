import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Navbar Brand */}
        <Link className="navbar-brand" to="/">
          My space
        </Link>

        {/* Navbar Toggler for Mobile View */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {/* Login Button */}
            <li className="nav-item me-2">
            <a
                href={`${
                  import.meta.env.VITE_COGNITO_DOMAIN
                }/login?client_id=${
                  import.meta.env.VITE_COGNITO_CLIENT_ID
                }&response_type=code&scope=email+openid+profile&redirect_uri=${
                  import.meta.env.VITE_REDIRECT_URI
                }`}
              >
                Login
              </a>
            </li>

            
            {/* Signup Button */}
            <li className="nav-item">
              <a
                href={`${
                  import.meta.env.VITE_COGNITO_DOMAIN
                }/signup?client_id=${
                  import.meta.env.VITE_COGNITO_CLIENT_ID
                }&response_type=code&scope=email+openid+profile&redirect_uri=${
                  import.meta.env.VITE_REDIRECT_URI
                }`}
              >
                Sign-Up
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
