# Personal Information

Rahul Jaluthria
24BCY70054
24BCY-3(A)

# Role-Based Access Control (RBAC) System

A complete full-stack implementation of Role-Based Access Control with role hierarchy, permission management, API restrictions, and role-based UI.

## 📋 Project Objectives

✅ **1. Define Role Hierarchy**
- Admin → highest privileges
- Manager → intermediate privileges
- User → basic privileges

✅ **2. Assign Permissions**
- Admin: read, write, delete, manage_users, view_reports, manage_roles
- Manager: read, write, delete, view_reports
- User: read

✅ **3. Enforce API-Level Restrictions**
- JWT token validation on all protected routes
- Role-based access control middleware
- Permission-level authorization checks

✅ **4. Guard Frontend Routes**
- ProtectedRoute component for role checks
- Redirect to /unauthorized for forbidden access
- Token validation before rendering

✅ **5. Create Role-Based UI**
- Dynamic navigation based on user role
- Role-specific dashboards
- Permission-based component visibility

## 📁 Project Structure

```
exp-8/
├── backend/
│   ├── models/              # MongoDB schemas
│   ├── middleware/          # Authentication & RBAC
│   ├── routes/              # API endpoints
│   ├── server.js            # Express setup
│   ├── seed.js              # Database seeding
│   ├── .env                 # Environment config
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Auth context
│   │   ├── api.js           # API client
│   │   ├── App.jsx          # Routes
│   │   └── index.jsx        # Entry point
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── SETUP_GUIDE.md           # Quick start guide
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or cloud)
- npm or yarn

### Installation

**Backend Setup:**
```bash
cd backend
npm install
npm run dev
# Server starts on http://localhost:5000
```

**Seed Demo Data:**
```bash
cd backend
node seed.js
# Creates demo users with test credentials
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm start
# App starts on http://localhost:3000
```

## 🔐 Demo Credentials

| Role    | Email              | Password    |
|---------|-------------------|-------------|
| Admin   | admin@test.com    | password123 |
| Manager | manager@test.com  | password123 |
| User    | user@test.com     | password123 |

## 📊 Expected Output

### ✅ Admin-Only Dashboard
- Login as admin → Full system access
- View system statistics (total users, role distribution)
- Manage all users and their roles
- Access audit logs

### ✅ Unauthorized Users Blocked
- Login as user → Can't access /admin/users
- Direct URL access → Redirected to /unauthorized
- API call without token → 401 Unauthorized
- API call with insufficient permissions → 403 Forbidden

### ✅ Role-Based Menus
- Admin → "Manage Users", "Analytics"
- Manager → "Reports", "Team"
- User → "Profile"
- Navigation updates dynamically

### ✅ Permission-Controlled APIs
- Each endpoint validates JWT token
- Checks user role
- Verifies required permissions
- Returns appropriate error codes

## 🔑 Key Features

### Authentication System
- User registration and login
- JWT token generation
- Password hashing with bcrypt
- Session persistence

### Role Hierarchy
```
Admin (Full Access)
  ├── manage_users
  ├── manage_roles
  ├── view_reports
  ├── write & delete
  └── read

Manager (Limited Admin)
  ├── view_reports
  ├── write & delete
  └── read

User (Read Only)
  └── read
```

### API Security
- Token validation middleware
- Role-based route protection
- Permission-level authorization
- CORS protection

### Frontend Protection
- Protected routes component
- Token-based authentication
- Role checks before rendering
- Unauthorized error handling

## 📡 API Endpoints

### Auth (`/api/auth`)
- `POST /register` - Create account
- `POST /login` - Login user
- `GET /me` - Current user info

### Users (`/api/users`)
- `GET /` - All users (admin)
- `GET /:id` - User details
- `PUT /:id` - Update user (admin)
- `DELETE /:id` - Delete user (admin)

### Admin (`/api/admin`)
- `GET /stats` - System stats (admin)
- `POST /assign-role` - Change role (admin)
- `POST /toggle-status` - User active/inactive (admin)
- `GET /audit-log` - Login history (admin)

### Dashboard (`/api/dashboard`)
- `GET /user` - User dashboard
- `GET /manager` - Manager dashboard
- `GET /admin` - Admin dashboard

## 🎨 UI Components

- **Login/Register Pages** - Auth forms with validation
- **User Dashboard** - Personal information and permissions
- **Manager Dashboard** - Team stats and reports
- **Admin Dashboard** - System statistics and user list
- **User Management** - Admin panel for user control
- **Navigation Bar** - Dynamic menu based on role
- **Error Pages** - 403 Unauthorized, 404 Not Found

## 🔄 Authentication Flow

```
User Input
    ↓
POST /auth/login or /auth/register
    ↓
Backend validates credentials
    ↓
Generate JWT token
    ↓
Return token + user data
    ↓
Store in localStorage
    ↓
Include in every API request
    ↓
Frontend checks role
    ↓
Route guard validates
    ↓
Dashboard rendered
```

## 🛡️ Security Features

✅ Password hashing (bcrypt 10 rounds)
✅ JWT token validation
✅ Role-based access control
✅ Permission-level authorization
✅ CORS enabled
✅ Token in Authorization header
✅ Secure error messages
✅ No password in responses

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rbac_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

### Frontend (src/api.js)
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🧪 Testing Scenarios

1. **Register New User**
   - Fill registration form
   - Auto-login after success
   - Redirect to user dashboard

2. **Login Different Roles**
   - Admin → Full access dashboard
   - Manager → Limited admin dashboard
   - User → Basic dashboard

3. **Route Protection**
   - Try accessing admin routes as user → Redirected
   - Try accessing manager routes as user → Redirected
   - Try accessing without token → Redirected to login

4. **Permission Testing**
   - User tries delete action → API returns 403
   - Manager tries manage_users → API returns 403
   - Admin performs any action → 200 Success

5. **Logout & Session**
   - Click logout → Clear token & user
   - Redirect to login page
   - Try back button → Still need login

## 📚 Documentation

- [Backend README](./backend/README.md) - API documentation
- [Frontend README](./frontend/README.md) - UI documentation
- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions

## 🚀 Deployment

### Backend (Heroku)
```bash
cd backend
heroku create
git push heroku main
```

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect to backend | Ensure backend running on :5000 |
| MongoDB connection error | Check connection string in .env |
| Routes not working | Verify role hierarchy in models |
| Login failing | Check demo credentials |
| Frontend CORS error | Verify CORS enabled in server.js |

## ✨ Future Enhancements

- [ ] Refresh token implementation
- [ ] Role creation UI
- [ ] Permission management UI
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] User profile editing
- [ ] Export user data
- [ ] Notification system
- [ ] Dark mode
- [ ] Pagination for users list

## 📄 License

Educational project - College Assignment

## ✅ Objectives Completion

| Objective | Status | Implementation |
|-----------|--------|-----------------|
| 1. Define role hierarchy | ✅ | Admin, Manager, User with clear hierarchy |
| 2. Assign permissions | ✅ | 6 permission types assigned to roles |
| 3. Enforce API-level restrictions | ✅ | Middleware validates token & permissions |
| 4. Guard frontend routes | ✅ | ProtectedRoute component protects all pages |
| 5. Create role-based UI | ✅ | Dynamic menus, dashboards, and components |

---

**Status**: ✅ Complete and Ready for Submission
**Version**: 1.0.0
**Last Updated**: April 20, 2026
