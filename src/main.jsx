import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './routes/Home.jsx';
import Details from './routes/Details.jsx';
import Signup from './routes/Signup.jsx';
import Login from './routes/Login.jsx';
import Logout from './routes/Logout.jsx';
import Cart from './routes/Cart.jsx';
import Checkout from './routes/Checkout.jsx';
import Confirmation from './routes/Confirmation.jsx';
import About from './routes/About.jsx';
import Contact from './routes/Contact.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/details/:productId', element: <Details /> },
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { path: '/logout', element: <Logout /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/confirmation', element: <Confirmation /> },
      {path:'/about',element:<About/>},
      {path:'/contact',element:<Contact/>},
      {path:'/Home',element:<Home/>},

    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);