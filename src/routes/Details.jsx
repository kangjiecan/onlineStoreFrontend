import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Details() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_HOST = import.meta.env.VITE_APP_HOST;

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`${API_HOST}/products/${productId}`);
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId, API_HOST]);

    const handleAddToCart = () => {
        try {
            const currentCart = Cookies.get('cart');
            const cartArray = currentCart ? currentCart.split(',') : [];
            cartArray.push(productId);
            Cookies.set('cart', cartArray.join(','), { expires: 7 });
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
            successMessage.style.zIndex = '1000';
            successMessage.textContent = `Added ${product?.name} to cart!`;
            document.body.appendChild(successMessage);
            
            setTimeout(() => {
                successMessage.remove();
            }, 2000);
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('Failed to add item to cart. Please try again.');
        }
    };

    const handleGoBack = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    Error loading product details: {error}
                    <button 
                        className="btn btn-outline-danger ms-3"
                        onClick={handleGoBack}
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning" role="alert">
                    Product not found.
                    <button 
                        className="btn btn-outline-warning ms-3"
                        onClick={handleGoBack}
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h1 className="card-title">{product.name}</h1>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <img
                                src={`${API_HOST}/images/${product.photo}`}
                                alt={product.name}
                                className="img-fluid rounded"
                            />
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h5 className="text-primary mb-3">Price: ${product.price}</h5>
                                <p className="mb-2"><strong>Stock:</strong> {product.stock}</p>
                                <p className="mb-3"><strong>Description:</strong> {product.description}</p>
                            </div>
                            <div className="d-grid gap-2 d-md-flex">
                                <button
                                    onClick={handleAddToCart}
                                    className="btn btn-primary me-md-2"
                                    disabled={product.stock === 0}
                                >
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                <button
                                    onClick={handleGoBack}
                                    className="btn btn-secondary"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;