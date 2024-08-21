import { Navigate, createBrowserRouter } from 'react-router-dom';
import Home from './modules/home/Home';
import Login from './modules/login/Login';
import { useAtom } from 'jotai';
import { token } from './store';
import Trade from './modules/trade/Trade';
import Orders from './modules/orders/Orders';
import Positions from './modules/positions/Positions';
import Settings from './modules/settings/Settings';
import Basket from './modules/basket/Basket';
import Accounts from './modules/accounts';
import TradeX from './modules/trade-x/TradeX';
import ChartComponent from './modules/chart/Chart';
import OptionTrade from './modules/option-trade/OptionTrade';

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
      path: '/accounts/:userId',
      element: <Accounts />,
    },
    {
      path: '/chart',
      element: <ChartComponent />,
    },
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
          path: '/settings',
          element: (
            <AuthRouter>
              <Settings />
            </AuthRouter>
          ),
        },
        {
          path: '/positions',
          element: (
            <AuthRouter>
              <Positions />
            </AuthRouter>
          ),
        },
        {
          path: '/basket',
          element: (
            <AuthRouter>
              <Basket />
            </AuthRouter>
          ),
        },
        {
          path: '/option-trade',
          element: (
            <AuthRouter>
              <OptionTrade />
            </AuthRouter>
          ),
        },
        {
          path: '/trade-x',
          element: (
            <AuthRouter>
              <TradeX />
            </AuthRouter>
          ),
        },
        {
          path: '/option-trade/:instrumentId',
          element: (
            <AuthRouter>
              <OptionTrade />
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
