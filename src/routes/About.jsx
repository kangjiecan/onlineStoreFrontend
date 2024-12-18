import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Utility function to decode JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const About = () => {
  const [searchParams] = useSearchParams();
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokenAndUser = async () => {
      const code = searchParams.get('code');
      if (!code) return;

      try {
        const response = await fetch(
          'https://sf0far1zjh.execute-api.ca-central-1.amazonaws.com/Stage/auth2/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              code: code,
              grant_type: 'authorization_code',
            }),
          }
        );

        const tokenData = await response.json();

        if (tokenData.error) {
          throw new Error(tokenData.error);
        }

        // Save tokens to localStorage
        localStorage.setItem('accessToken', tokenData.access_token);
        localStorage.setItem('idToken', tokenData.id_token);
        localStorage.setItem('refreshToken', tokenData.refresh_token || '');

        // Decode the id_token to get user information
        if (tokenData.id_token) {
          const decodedToken = decodeJWT(tokenData.id_token);
          if (decodedToken) {
            setNickname(decodedToken.nickname || 'User');
            // Navigate to home with userId as state
            navigate('/home', { 
              state: { userId: decodedToken.sub }
            });
          }
        }
      } catch (err) {
        console.error('Authentication error:', err);
      }
    };

    fetchTokenAndUser();
  }, [searchParams, navigate]);

  return (
    <div className="p-4">
      {nickname && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl">Welcome back, {nickname}!</h2>
        </div>
      )}
    </div>
  );
};

export default About;