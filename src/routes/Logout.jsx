import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

function Logout() {
  const setIsLoggedIn = useOutletContext();
  const navigate = useNavigate();
  const API_HOST = import.meta.env.VITE_APP_HOST; 

  const handleLogout = async () => {
    try {
      const sessionId = sessionStorage.getItem("sessionId");
      if (!sessionId) {
        throw new Error("No session ID found. User might not be logged in.");
      }

      const response = await fetch(`${API_HOST}/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`, 
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Logout failed.");
      }

      const data = await response.json();
      console.log("Logout response:", data);

      setIsLoggedIn(false); 
      //distory the session ID
      sessionStorage.removeItem("sessionId"); 
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Are you sure you want to log out?</h2>
      <div className="text-center">
        <button onClick={handleLogout} className="btn btn-success btn-lg">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Logout;