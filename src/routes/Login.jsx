import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";

function Login() {
    const setIsLoggedIn = useOutletContext();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const API_HOST = import.meta.env.VITE_APP_HOST; 

    // Check for existing session on component mount
    useEffect(() => {
        const sessionId = sessionStorage.getItem("sessionId");
        if (sessionId) {
            setIsLoggedIn(true);
            navigate("/");
        }
    }, [setIsLoggedIn, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            const response = await fetch(`${API_HOST}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "An error occurred.");
            }

            const data = await response.json();
            sessionStorage.setItem("sessionId", data.sessionId);
            setIsLoggedIn(true);
            navigate("/");
        } catch (error) {
            setErrorMessage(error.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Login</h2>
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </div>
                            </form>
                            {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
                            <div className="mt-4 text-center">
                                <p>Don't have an account? <Link to="/signup">Register</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;