import React, { useContext, useEffect, useState } from 'react';
import { dashboardAPI } from '../api';
import './Dashboard.css';

export const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getUserDashboard();
      setData(response.data.dashboard);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!data) return <div className="error">Failed to load dashboard</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{data.content.title}</h1>
        <p>{data.content.description}</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>User Information</h2>
          <div className="info-table">
            <div className="info-row">
              <span>Name:</span>
              <strong>{data.user.name}</strong>
            </div>
            <div className="info-row">
              <span>Email:</span>
              <strong>{data.user.email}</strong>
            </div>
            <div className="info-row">
              <span>Role:</span>
              <strong className="role-badge">{data.user.role.toUpperCase()}</strong>
            </div>
            <div className="info-row">
              <span>Last Login:</span>
              <strong>{new Date(data.user.lastLogin).toLocaleDateString()}</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Your Permissions</h2>
          <div className="permissions-list">
            {data.user.permissions.map((perm) => (
              <span key={perm} className="permission-badge">
                {perm}
              </span>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Available Features</h2>
          <ul className="features-list">
            {data.content.features.map((feature, idx) => (
              <li key={idx}>✓ {feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const ManagerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getManagerDashboard();
      setData(response.data.dashboard);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!data) return <div className="error">Failed to load dashboard</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <p>Manage your team and view reports</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{data.stats.totalUsers}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Reports Generated</span>
              <span className="stat-value">{data.stats.reportsGenerated}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Users</h2>
          <div className="users-list">
            {data.recentUsers.map((user) => (
              <div key={user._id} className="user-item">
                <strong>{user.name}</strong>
                <small>{user.email}</small>
                <span className="role-badge">{user.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Available Features</h2>
          <ul className="features-list">
            {data.features.map((feature, idx) => (
              <li key={idx}>✓ {feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getAdminDashboard();
      setData(response.data.dashboard);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!data) return <div className="error">Failed to load dashboard</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Full system control and management</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card large">
          <h2>System Statistics</h2>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{data.stats.totalUsers}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Admins</span>
              <span className="stat-value">{data.stats.adminCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Managers</span>
              <span className="stat-value">{data.stats.managerCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Users</span>
              <span className="stat-value">{data.stats.userCount}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card large">
          <h2>Recent Users</h2>
          <div className="users-table">
            <div className="table-header">
              <div className="col">Name</div>
              <div className="col">Email</div>
              <div className="col">Role</div>
            </div>
            {data.recentUsers.map((user) => (
              <div key={user._id} className="table-row">
                <div className="col">{user.name}</div>
                <div className="col">{user.email}</div>
                <div className="col">
                  <span className="role-badge">{user.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Admin Features</h2>
          <ul className="features-list">
            {data.features.map((feature, idx) => (
              <li key={idx}>✓ {feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
