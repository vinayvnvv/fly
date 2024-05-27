import { Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { stores, token } from '../../store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { upstoxClient } from '../../config/upstox';

const Login = () => {
  const [authToken, setToken] = useAtom(token);
  const [user, setUser] = useAtom(stores.user);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (authToken && user) navigate('/');
    const authCode = searchParams.get('code');
    if (!authCode) upstoxClient.redirectToLogin();
    if (authCode) {
      upstoxClient.getToken(authCode).then(res => {
        setToken(res.access_token);
        setUser(res);
        navigate('/');
      });
    }
  }, []);
  return <Typography>Login</Typography>;
};

export default Login;
