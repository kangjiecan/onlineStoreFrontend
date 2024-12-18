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
import Create from './routes/Create.jsx';
import Confirmation from './routes/Confirmation.jsx';
import About from './routes/About.jsx';
import Contact from './routes/Contact.jsx';
import Posts from './routes/Posts.jsx';
//import VerifyEmail from './routes/VerifyEmail.jsx';


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
      { path: '/Create', element: <Create /> },
      { path: '/confirmation', element: <Confirmation /> },
      {path:'/about',element:<About/>},
      {path:'/contact',element:<Contact/>},
      {path:'/Home',element:<Home/>},
      {path:'/Posts/:retrieve_userID',element:<Posts/>},
      //{path:'/VerifyEmail',element:<VerifyEmail/>}
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);