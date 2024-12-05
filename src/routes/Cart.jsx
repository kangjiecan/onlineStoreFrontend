import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const API_HOST = import.meta.env.VITE_APP_HOST;
    const TAX_RATE = 0.15; // 15% tax rate ?

    useEffect(() => {
        const fetchCartProducts = async () => {
            const cartCookie = Cookies.get('cart');
            if (!cartCookie) {
                setCartItems([]);
                return;
            }

            const cartArray = cartCookie.split(',');
            
            const countMap = [];
            cartArray.forEach(id => {
                const existingItem = countMap.find(item => item[0] === id);
                if (existingItem) {
                    existingItem[1]++;
                } else {
                    countMap.push([id, 1]);
                }
            });

            try {
                const productPromises = countMap.map(async ([id, quantity]) => {
                    const response = await fetch(`${API_HOST}/products/${id}`);
                    if (response.ok) {
                        const product = await response.json();
                        return { 
                            ...product, 
                            quantity: parseInt(quantity), 
                            total: product.price * parseInt(quantity),
                            cartItemId: `${id}-${Date.now()}`
                        };
                    }
                    return null;
                });

                const products = await Promise.all(productPromises);
                const filteredProducts = products.filter(Boolean);
                setCartItems(filteredProducts);
                
                const calculatedSubtotal = filteredProducts.reduce(
                    (sum, item) => sum + item.total,
                    0
                );
                const calculatedTax = calculatedSubtotal * TAX_RATE;
                const calculatedTotal = calculatedSubtotal + calculatedTax;
                
                setSubtotal(calculatedSubtotal);
                setTax(calculatedTax);
                setTotal(calculatedTotal);
            } catch (error) {
                console.error('Error fetching cart products:', error);
            }
        };

        fetchCartProducts();
    }, [API_HOST]);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleReduce = (itemId) => {
        console.log("Item to reduce:", itemId);
        if (itemId === undefined || itemId === null) {
            console.log("Invalid item ID");
            return;
        }
        
        const cartCookie = Cookies.get('cart');
        if (!cartCookie) return;

        const cartArray = cartCookie.split(',');
        const lastIndex = cartArray.lastIndexOf(itemId.toString());
        
        if (lastIndex !== -1) {
            cartArray.splice(lastIndex, 1);
            if (cartArray.length === 0) {
                Cookies.remove('cart');
            } else {
                Cookies.set('cart', cartArray.join(','));
            }
            window.location.reload();
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mt-4">
                <h1>Your Cart</h1>
                <p>Your cart is empty.</p>
                <Link to="/" className="btn btn-primary">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1>Your Cart</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Thumbnail</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Reduce Quantity</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.cartItemId}>
                            <td>
                                <img 
                                    src={`${API_HOST}/images/${item.photo}`} 
                                    alt={item.name} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            </td>
                            <td>{item.name}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <button 
                                    className="btn btn-warning btn-sm" 
                                    onClick={() => handleReduce(item.product_id)}
                                >
                                    Reduce Quantity by 1
                                </button>
                            </td>
                            <td>${item.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-end">
            <h5 className="text-xl mb-2">Subtotal: ${subtotal.toFixed(2)}</h5>
                <h5 className="text-xl mb-2">Tax (15%): ${tax.toFixed(2)}</h5>
                <h5 className="text-xl mb-2">Total: ${total.toFixed(2)}</h5>
            </div>
            <div className="mt-4">
                <Link to="/" className="btn btn-secondary me-2">Continue Shopping</Link>
               
            </div>
        </div>
    );
}

export default Cart;