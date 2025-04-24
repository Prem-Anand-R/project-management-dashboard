
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard
    navigate('/');
  }, [navigate]);

  return null; // This component renders nothing as it redirects
};

export default Index;
