import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <div className="error-code">403</div>
        <h1>Access Denied</h1>
        <p>You do not have permission to access this resource.</p>
        <div className="error-details">
          <p>
            Only users with specific roles can access this page. If you believe
            this is an error, please contact your administrator.
          </p>
        </div>
        <button onClick={() => navigate(-1)} className="btn-back">
          Go Back
        </button>
      </div>
    </div>
  );
};

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn-back">
          Go Home
        </button>
      </div>
    </div>
  );
};
