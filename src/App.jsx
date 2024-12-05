import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Nav from "./ui/Nav";
import Sidebar from "./ui/Sidebar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("sessionId") ? true : false;
});
  return (
    <>
      {/* Pass the isLoggedIn state and setIsLoggedIn to Nav */}
      <Nav isLoggedIn={isLoggedIn} />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 py-3">
            <Sidebar />
          </div>

          <div className="col-md-9 py-3">
            <div className="d-flex justify-content-end mb-3">
              {/* Add Checkout button */}
              <Link to="/Checkout" className="btn btn-success btn-lg">
                <i className="bi bi-cart-check me-2"></i> Checkout
              </Link>
            </div>
            {/* Pass setIsLoggedIn to child routes */}
            <Outlet context={setIsLoggedIn} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;