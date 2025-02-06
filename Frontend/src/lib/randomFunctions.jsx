import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useRequireAuth(redirectPath = '/test') {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token || token.trim() === '') {
      navigate(redirectPath);
    }
  }, [navigate, redirectPath]);
}
