import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_APP_HOST}/products/all`; // Use environment variable
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div>Error loading products: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Our Products</h1>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xxl-7 g-4">
        {products.map((product) => (
          <div className="col" key={product.product_id}>
            <div className="card h-100">
              <img
                src={`${import.meta.env.VITE_APP_HOST}/images/${product.photo}`}
                className="card-img-top"
                alt={product.name}
                style={{ objectFit: 'contain', height: '200px' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Price: ${product.price}</p>
                <a href={`/details/${product.product_id}`} className="btn btn-primary mt-auto">
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;