import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Checkout() {
  const [sessionActive, setSessionActive] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
    credit_card: "",
    credit_expire: "",
    credit_cvv: "",
  });
  const navigate = useNavigate();

  const API_HOST = import.meta.env.VITE_APP_HOST; // Dynamically use API host

  useEffect(() => {
    checkSession();
    loadCart();
  }, []);

  const checkSession = async () => {
    const sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      setSessionActive(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_HOST}/users/getSession?sessionId=${sessionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.message === "Session active") {
        setSessionActive(true);
        setUserInfo(data.session);
      } else {
        setSessionActive(false);
        sessionStorage.removeItem("sessionId");
      }
    } catch (error) {
      setError("Error checking session. Please try again.");
      console.error("Session check failed:", error);
    }
  };

  const loadCart = () => {
    const cartCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cart="));
    if (cartCookie) {
      const cartArray = cartCookie.split("=")[1].split(",");
      setCart(cartArray);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_HOST}/purchase/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cart: cart.join(","),
          invoice_amt: 200.0, // Example subtotal
          invoice_tax: 26.0, // Example tax
          invoice_total: 226.0, // Example total
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Purchase completed successfully! Purchase ID: ${data.purchaseId}`);
        document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/");
      } else {
        throw new Error(data.message || "Purchase failed");
      }
    } catch (error) {
      setError(`Purchase failed: ${error.message}`);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!sessionActive) {
    return (
      <div className="container mt-5">
        <h2>Checkout</h2>
        <div className="alert alert-warning">
          <p>You must be logged in to access the checkout page.</p>
          <Link to="/login" className="btn btn-primary">
            Log in to proceed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout</h2>
      {userInfo && (
        <div>
          <p className="lead">
            Welcome, {userInfo.first_name} {userInfo.last_name}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="street" className="form-label">
                Street:
              </label>
              <input
                type="text"
                className="form-control"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label">
                City:
              </label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="province" className="form-label">
                Province:
              </label>
              <input
                type="text"
                className="form-control"
                id="province"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label">
                Country:
              </label>
              <input
                type="text"
                className="form-control"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="postal_code" className="form-label">
                Postal Code:
              </label>
              <input
                type="text"
                className="form-control"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="credit_card" className="form-label">
                Credit Card Number:
              </label>
              <input
                type="text"
                className="form-control"
                id="credit_card"
                name="credit_card"
                value={formData.credit_card}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="credit_expire" className="form-label">
                  Expiration Date:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="credit_expire"
                  name="credit_expire"
                  value={formData.credit_expire}
                  onChange={handleInputChange}
                  required
                  placeholder="MM/YY"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="credit_cvv" className="form-label">
                  CVV:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="credit_cvv"
                  name="credit_cvv"
                  value={formData.credit_cvv}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Complete Purchase
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Checkout;