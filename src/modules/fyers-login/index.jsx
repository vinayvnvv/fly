import { fyersToken, fyersUser } from '../../store';
import { useAtom } from 'jotai';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fyers } from '../../main';

const { VITE_FYERS_APP_SECRET } = import.meta.env;

export default function FyersLogin() {
  const [authToken, setToken] = useAtom(fyersToken);
  const [user, setUser] = useAtom(fyersUser);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken && user) navigate('/');
    const authCode = searchParams.get('auth_code');
    if (!authCode) {
      var generateAuthcodeURL = fyers.generateAuthCode();
      window.location.href = generateAuthcodeURL;
    }
    if (authCode) {
      fyers
        .generate_access_token({
          secret_key: VITE_FYERS_APP_SECRET,
          auth_code: authCode,
        })
        .then(res => {
          console.log(res);
          setToken(res.access_token);
          fyers.setAccessToken(res.access_token);
          fyers.get_profile().then(_res => {
            console.log(_res);
            const _d = {
              ..._res?.data,
              refresh_token: res.refresh_token,
            };
            setUser(_d);
            navigate('/');
          });
        });
    }
  }, []);
  return <div>FyersLogin...</div>;
}
