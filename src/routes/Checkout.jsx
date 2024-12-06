import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

function Checkout() {
  const [sessionActive, setSessionActive] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [cart, setCart] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      street: "",
      city: "",
      province: "",
      country: "",
      postal_code: "",
      credit_card: "",
      credit_expire: "",
      credit_cvv: "",
    }
  });

  const API_HOST = import.meta.env.VITE_APP_HOST;

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
    const cartValue = Cookies.get('cart');
    if (!cartValue) {
      setError("Your cart is empty");
      return;
    }
    setCart(cartValue);
  };

  const onSubmit = async (formData) => {
    try {
      const response = await fetch(`${API_HOST}/purchase/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cart: cart
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.remove('cart', { path: '/' });
        alert(`Purchase completed successfully! Purchase ID: ${data.purchaseId}`);
        navigate("/");
      } else {
        throw new Error(data.message || "Purchase failed");
      }
    } catch (error) {
      setError(`Purchase failed: ${error.message}`);
    }
  };

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => setError("")}>
          Try Again
        </button>
      </div>
    );
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
          <div className="mb-3">
            <strong>Cart Items:</strong> {cart}
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="street" className="form-label">
                Street:
              </label>
              <input
                className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                {...register("street", { required: "Street is required" })}
              />
              {errors.street && (
                <div className="invalid-feedback">{errors.street.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="city" className="form-label">
                City:
              </label>
              <input
                className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <div className="invalid-feedback">{errors.city.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="province" className="form-label">
                Province:
              </label>
              <input
                className={`form-control ${errors.province ? 'is-invalid' : ''}`}
                {...register("province", { required: "Province is required" })}
              />
              {errors.province && (
                <div className="invalid-feedback">{errors.province.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="country" className="form-label">
                Country:
              </label>
              <input
                className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                {...register("country", { required: "Country is required" })}
              />
              {errors.country && (
                <div className="invalid-feedback">{errors.country.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="postal_code" className="form-label">
                Postal Code:
              </label>
              <input
                className={`form-control ${errors.postal_code ? 'is-invalid' : ''}`}
                placeholder="A1B 2C3"
                {...register("postal_code", {
                  required: "Postal code is required",
                  pattern: {
                    value: /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/,
                    message: "Invalid postal code format"
                  }
                })}
              />
              {errors.postal_code && (
                <div className="invalid-feedback">{errors.postal_code.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="credit_card" className="form-label">
                Credit Card Number:
              </label>
              <input
                className={`form-control ${errors.credit_card ? 'is-invalid' : ''}`}
                placeholder="1234567890123456"
                maxLength="16"
                {...register("credit_card", {
                  required: "Credit card number is required",
                  pattern: {
                    value: /^\d{16}$/,
                    message: "Must be 16 digits"
                  }
                })}
              />
              {errors.credit_card && (
                <div className="invalid-feedback">{errors.credit_card.message}</div>
              )}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="credit_expire" className="form-label">
                  Expiration Date:
                </label>
                <input
                  className={`form-control ${errors.credit_expire ? 'is-invalid' : ''}`}
                  placeholder="MM/YY"
                  maxLength="5"
                  {...register("credit_expire", {
                    required: "Expiration date is required",
                    pattern: {
                      value: /^\d{2}\/\d{2}$/,
                      message: "Must be in MM/YY format"
                    }
                  })}
                />
                {errors.credit_expire && (
                  <div className="invalid-feedback">{errors.credit_expire.message}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="credit_cvv" className="form-label">
                  CVV:
                </label>
                <input
                  className={`form-control ${errors.credit_cvv ? 'is-invalid' : ''}`}
                  placeholder="123"
                  maxLength="3"
                  {...register("credit_cvv", {
                    required: "CVV is required",
                    pattern: {
                      value: /^\d{3}$/,
                      message: "Must be 3 digits"
                    }
                  })}
                />
                {errors.credit_cvv && (
                  <div className="invalid-feedback">{errors.credit_cvv.message}</div>
                )}
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