import React from "react";
import { Link } from "react-router-dom";

function CheckoutSuccess() {
  return (
    <div className="container text-center mt-5">
      <h1>Thank You for Your Purchase!</h1>
      <p>Your order has been successfully placed.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Continue Shopping
      </Link>
    </div>
  );
}

export default CheckoutSuccess;