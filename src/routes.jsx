import { Navigate, createBrowserRouter } from 'react-router-dom';
import Home from './modules/home/Home';
import Login from './modules/login/Login';
import { useAtom } from 'jotai';
import { token } from './store';
import Trade from './modules/trade/Trade';
import Orders from './modules/orders/Orders';

const AuthRouter = ({ children }) => {
  const [authToken] = useAtom(token);
  return authToken ? (
    children
  ) : (
    <>
      <Navigate to={'/login'} />
    </>
  );
};

export const router = AppLayout =>
  createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: (
            <AuthRouter>
              <Home />
            </AuthRouter>
          ),
        },
        {
          path: '/orders',
          element: (
            <AuthRouter>
              <Orders />
            </AuthRouter>
          ),
        },
        {
          path: '/login',
          element: <Login />,
        },
      ],
    },
  ]);
