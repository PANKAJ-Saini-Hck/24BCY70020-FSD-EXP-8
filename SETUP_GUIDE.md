# RBAC System - Setup & Execution Guide

## Project Overview

This is a complete **Role-Based Access Control (RBAC)** full-stack application implementing:

1. ✅ **Role Hierarchy**: Admin → Manager → User
2. ✅ **Permission System**: Read, Write, Delete, Manage Users, View Reports, Manage Roles
3. ✅ **API-Level Restrictions**: Token validation, role/permission checks
4. ✅ **Frontend Route Guards**: Protected routes based on roles
5. ✅ **Role-Based UI**: Dynamic menus and dashboards

## Project Structure

```
exp-8/
├── backend/
│   ├── models/
│   │   ├── User.js          # User model with password hashing
│   │   └── Role.js          # Role definition model
│   ├── middleware/
│   │   └── auth.js          # JWT and RBAC middleware
│   ├── routes/
│   │   ├── auth.js          # Auth endpoints
│   │   ├── users.js         # User management
│   │   ├── admin.js         # Admin functions
│   │   └── dashboard.js     # Dashboard endpoints
│   ├── server.js            # Express server
│   ├── .env                 # Environment config
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Auth.jsx             # Login/Register
    │   │   ├── Dashboard.jsx        # Role dashboards
    │   │   ├── Navigation.jsx       # Navbar
    │   │   ├── ManageUsers.jsx      # Admin panel
    │   │   ├── ProtectedRoute.jsx   # Route guards
    │   │   ├── Unauthorized.jsx     # Error pages
    │   │   └── *.css                # Styles
    │   ├── context/
    │   │   └── AuthContext.jsx      # Auth state
    │   ├── api.js                   # API client
    │   ├── App.jsx                  # Routes
    │   └── index.jsx                # Entry point
    ├── public/
    │   └── index.html
    └── package.json
```

## Quick Start

### Step 1: Start MongoDB

```bash
# Windows (if MongoDB is installed locally)
mongod

# OR use MongoDB Atlas (cloud database)
# Update MONGODB_URI in backend/.env with connection string
```

### Step 2: Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

### Step 3: Start Frontend Application

```bash
cd frontend
npm install
npm start
```

Expected output:
```
Compiled successfully!
You can now view rbac-frontend in the browser.
Local: http://localhost:3000
```

### Step 4: Access the Application

Open browser and go to: **http://localhost:3000**

## Login with Demo Accounts

| Role    | Email              | Password    |
|---------|-------------------|-------------|
| Admin   | admin@test.com    | password123 |
| Manager | manager@test.com  | password123 |
| User    | user@test.com     | password123 |

## Key Features Demonstration

### 1. **Role-Based Dashboards**
- Login as different roles to see role-specific dashboards
- Admin sees system statistics and user management
- Manager sees team reports and analytics
- User sees personal information

### 2. **Protected Routes**
- Unauthorized users are blocked from accessing pages
- Redirected to `/unauthorized` with 403 error
- Role checks happen at route level

### 3. **API-Level Restrictions**
- Every API call validates JWT token
- Checks user role and permissions
- Returns 401/403 errors for unauthorized access

### 4. **Role-Based UI**
- Navigation menu changes based on user role
- Admin gets "Manage Users" and "Analytics" options
- Manager gets "Reports" and "Team" options
- User gets "Profile" option

### 5. **Admin Features**
- View all users in the system
- Assign/change user roles
- Toggle user active status
- View audit logs with last login times

## API Endpoints Summary

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user
```

### Users
```
GET    /api/users              - List all users (admin)
GET    /api/users/:id          - Get user details
PUT    /api/users/:id          - Update user (admin)
DELETE /api/users/:id          - Delete user (admin)
```

### Admin
```
GET    /api/admin/stats        - System statistics (admin)
POST   /api/admin/assign-role  - Change user role (admin)
POST   /api/admin/toggle-status - Active/Inactive user (admin)
GET    /api/admin/audit-log    - View audit log (admin)
```

### Dashboard
```
GET    /api/dashboard/user     - User dashboard
GET    /api/dashboard/manager  - Manager dashboard (manager+)
GET    /api/dashboard/admin    - Admin dashboard (admin)
```

## Role Permissions Matrix

| Permission      | Admin | Manager | User |
|-----------------|-------|---------|------|
| read            | ✅    | ✅      | ✅   |
| write           | ✅    | ✅      | ❌   |
| delete          | ✅    | ✅      | ❌   |
| manage_users    | ✅    | ❌      | ❌   |
| view_reports    | ✅    | ✅      | ❌   |
| manage_roles    | ✅    | ❌      | ❌   |

## Middleware Flow

```
Request
  ↓
authMiddleware (Verify JWT token)
  ↓
authorize(...roles) (Check role)
  ↓
checkPermission() (Verify permission)
  ↓
Route Handler
```

## Testing Workflow

### Test 1: User Registration
1. Go to Register page
2. Fill form and create new user
3. Auto-login and redirect to dashboard

### Test 2: Authentication
1. Login with admin@test.com / password123
2. Token stored in localStorage
3. Navigate dashboard
4. Logout clears storage

### Test 3: Role-Based Access
1. Login as User → Can only see User Dashboard
2. Login as Manager → Can see Manager Dashboard + Reports
3. Login as Admin → Can see Admin Dashboard + Manage Users

### Test 4: API Restrictions
1. Open browser DevTools → Network tab
2. Make API call without token → 401 Unauthorized
3. Make API call with User role to admin endpoint → 403 Forbidden
4. Make API call with Admin role → 200 Success

### Test 5: Route Guards
1. Login as User
2. Try accessing `/admin/users` directly
3. Redirected to `/unauthorized` page

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rbac_db
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
```

### Frontend (api.js)
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Restart
npm run dev
```

### MongoDB Connection Error
```bash
# Ensure MongoDB is running
# Check connection string in .env
# Use MongoDB Atlas for cloud option
```

### Frontend CORS Error
```bash
# Backend must have CORS enabled
# Already configured in server.js
# Verify API_BASE_URL is correct
```

### Authentication Issues
```bash
# Clear localStorage
localStorage.clear()

# Login again
# Check browser console for errors
```

## Performance Features

- ✅ JWT for stateless authentication
- ✅ Role-based caching opportunities
- ✅ Pagination ready (not yet implemented)
- ✅ Minimal API calls
- ✅ Lazy loading of dashboards

## Security Implementations

- ✅ Password hashing (bcryptjs)
- ✅ JWT token validation
- ✅ CORS protection
- ✅ Role-based access control
- ✅ Permission-level authorization
- ✅ Secure error messages
- ✅ Password not exposed in responses

## Next Steps

1. **Customize Roles**: Add new roles in Role.js
2. **Add Permissions**: Extend permission enums
3. **Expand UI**: Add more dashboard widgets
4. **Database Seeding**: Create seed script for demo data
5. **Testing**: Write unit and integration tests
6. **Deployment**: Deploy backend to Heroku/AWS, frontend to Vercel

## Support

For issues or questions:
1. Check backend logs for API errors
2. Check browser console for frontend errors
3. Verify MongoDB is running
4. Ensure correct environment variables
5. Clear cache and restart servers

---

**Created**: April 20, 2026
**Version**: 1.0.0
**Status**: Ready for College Submission ✅
