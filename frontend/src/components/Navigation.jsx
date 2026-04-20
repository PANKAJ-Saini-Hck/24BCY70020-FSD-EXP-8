import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navigation.css';

export const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const getMenuItems = () => {
    const baseMenu = [
      { label: 'Dashboard', path: `/dashboard/${user.role}` },
    ];

    const roleMenus = {
      admin: [
        { label: 'Manage Users', path: '/admin/users' },
        { label: 'Analytics', path: '/admin/analytics' },
      ],
      manager: [
        { label: 'Reports', path: '/manager/reports' },
        { label: 'Team', path: '/manager/team' },
      ],
      user: [
        { label: 'Profile', path: '/user/profile' },
      ],
    };

    return [...baseMenu, ...(roleMenus[user.role] || [])];
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>RBAC System</h1>
        </div>

        <ul className="navbar-menu">
          {getMenuItems().map((item) => (
            <li key={item.path}>
              <button onClick={() => navigate(item.path)} className="menu-link">
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="navbar-user">
          <span className="user-info">
            {user.name} ({user.role.toUpperCase()})
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
