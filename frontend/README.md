# Personal Information

Rahul Jaluthria
24BCY70054
24BCY-3(A)

# RBAC Frontend - Role-Based Access Control UI

## Overview
React-based frontend for a Role-Based Access Control system with protected routes, role-based dashboards, and responsive UI.

## Features
- ✅ User Authentication (Login/Register)
- ✅ Protected Routes with Role Guards
- ✅ Role-Based Dashboards (User, Manager, Admin)
- ✅ Dynamic Navigation Menu
- ✅ Admin User Management
- ✅ Permission-Based UI Elements
- ✅ Responsive Design
- ✅ Error Handling & Loading States

## Tech Stack
- React 18.2
- React Router v6
- Axios for API calls
- CSS for styling

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL**
   - Open `src/api.js`
   - Update `API_BASE_URL` if backend is on different port:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

4. **Start development server**
   ```bash
   npm start
   ```

Application runs on `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth.jsx           # Login/Register components
│   │   ├── Dashboard.jsx      # Role-based dashboards
│   │   ├── Navigation.jsx     # Navigation bar
│   │   ├── ManageUsers.jsx    # Admin user management
│   │   ├── ProtectedRoute.jsx # Route guards
│   │   ├── Unauthorized.jsx   # Error pages
│   │   └── *.css              # Component styles
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication state
│   ├── api.js                 # API calls
│   ├── App.jsx                # Main app component
│   ├── App.css
│   ├── index.jsx
│   └── index.css
├── package.json
└── README.md
```

## Components

### Auth.jsx
- `<Login />` - User login form
- `<Register />` - User registration form

### Dashboard.jsx
- `<UserDashboard />` - Standard user dashboard
- `<ManagerDashboard />` - Manager dashboard with stats
- `<AdminDashboard />` - Admin dashboard with system stats

### Navigation.jsx
- `<Navigation />` - Dynamic navbar with role-based menu items

### ProtectedRoute.jsx
- `<ProtectedRoute>` - Guards routes by role
- `<PermissionGuard>` - Checks specific permissions

### ManageUsers.jsx
- `<ManageUsers />` - Admin page to view/delete users

## Authentication Flow

1. User enters credentials on Login page
2. API returns JWT token and user data
3. Token stored in localStorage
4. Token sent with every API request
5. AuthContext manages user state globally
6. Routes check user role and permissions
7. Unauthorized users redirected to error page

## API Integration

All API calls go through `src/api.js`:

```javascript
import { authAPI, userAPI, adminAPI, dashboardAPI } from '../api';

// Authentication
authAPI.login(credentials)
authAPI.register(userData)
authAPI.getCurrentUser()

// Users
userAPI.getAllUsers()
userAPI.getUserById(id)
userAPI.updateUser(id, data)
userAPI.deleteUser(id)

// Admin
adminAPI.getStats()
adminAPI.assignRole(data)
adminAPI.toggleUserStatus(data)
adminAPI.getAuditLog()

// Dashboard
dashboardAPI.getUserDashboard()
dashboardAPI.getManagerDashboard()
dashboardAPI.getAdminDashboard()
```

## Role-Based Access

### User Routes
- `/dashboard/user` - Personal dashboard
- `/user/profile` - Profile view

### Manager Routes
- `/dashboard/manager` - Manager dashboard
- `/manager/reports` - Reports page
- `/manager/team` - Team overview

### Admin Routes
- `/dashboard/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/analytics` - Analytics page

## Demo Credentials

```
Admin:
- Email: admin@test.com
- Password: password123

Manager:
- Email: manager@test.com
- Password: password123

User:
- Email: user@test.com
- Password: password123
```

## UI Features

### Responsive Design
- Mobile-friendly layout
- Flexible grid system
- Touch-friendly buttons

### Visual Feedback
- Loading states
- Error messages
- Success notifications
- Role-based badges

### Navigation
- Dynamic menu based on role
- Active route highlighting
- Breadcrumb trails
- User info display

## Styling

Components use CSS modules and inline styles:

- **Color Scheme**:
  - Primary: #667eea
  - Dark: #2c3e50
  - Accent: #764ba2

- **Key Classes**:
  - `.dashboard` - Dashboard container
  - `.auth-container` - Auth pages
  - `.navbar` - Navigation bar
  - `.role-badge` - Role indicators
  - `.permission-badge` - Permission tags

## Error Handling

The app handles various error scenarios:

```javascript
// Invalid credentials
Unauthorized - Invalid credentials

// Missing token
Unauthorized - No token provided

// Insufficient permissions
Access denied - Insufficient permissions

// Not found
Page not found (404)

// Server error
Server error
```

## Best Practices Implemented

- ✅ Protected routes with role checks
- ✅ Permission-based UI rendering
- ✅ JWT token storage and management
- ✅ Error boundary implementation
- ✅ Loading states for async operations
- ✅ Responsive mobile-first design
- ✅ Context API for state management
- ✅ Modular component structure

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Troubleshooting

### Cannot connect to backend
- Ensure backend is running on port 5000
- Check `API_BASE_URL` in `src/api.js`
- Verify CORS is enabled on backend

### Token not working
- Clear localStorage: `localStorage.clear()`
- Login again to get new token
- Check browser console for errors

### Components not rendering
- Check React Router paths match component routes
- Verify role-based guards allow current user
- Check browser console for JS errors

## Future Enhancements
- [ ] Refresh token implementation
- [ ] User profile editing
- [ ] Password change functionality
- [ ] Remember me option
- [ ] Dark mode
- [ ] Notification system
- [ ] Role creation UI
- [ ] Permission management UI
- [ ] Export user data
- [ ] Search and filter users
