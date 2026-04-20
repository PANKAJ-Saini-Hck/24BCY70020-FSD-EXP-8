# RBAC System - Quick Reference Guide

## 🚀 30-Second Setup

```bash
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Database Seeding (optional)
cd backend && node seed.js

# Terminal 3: Frontend
cd frontend && npm install && npm start

# Open http://localhost:3000 in browser
```

## 🔐 Login Credentials

Copy these to quickly test different roles:

```
Admin:
  Email: admin@test.com
  Password: password123
  Role: ADMIN
  Permissions: All

Manager:
  Email: manager@test.com
  Password: password123
  Role: MANAGER
  Permissions: read, write, delete, view_reports

User:
  Email: user@test.com
  Password: password123
  Role: USER
  Permissions: read only
```

## 📍 Application Routes

### Public Routes
```
/login              - User login page
/register           - User registration page
```

### Protected Routes (User Level)
```
/dashboard/user     - User personal dashboard
/user/profile       - User profile page
```

### Protected Routes (Manager Level)
```
/dashboard/manager  - Manager dashboard with stats
/manager/reports    - Reports page
/manager/team       - Team overview
```

### Protected Routes (Admin Level)
```
/dashboard/admin    - Admin dashboard with system stats
/admin/users        - User management page
/admin/analytics    - Analytics page
```

### Error Routes
```
/unauthorized       - 403 Forbidden page
404                 - Page not found
```

## 🔌 API Endpoints Reference

### Authentication
```
POST /api/auth/register
  Body: { name, email, password, role }
  Response: { token, user }

POST /api/auth/login
  Body: { email, password }
  Response: { token, user }

GET /api/auth/me
  Auth: Required (Bearer token)
  Response: { user }
```

### Users Management
```
GET /api/users
  Auth: Required (Admin only)
  Response: { users: [...] }

GET /api/users/:id
  Auth: Required
  Response: { user }

PUT /api/users/:id
  Auth: Required (Admin only)
  Body: { name, email, role }
  Response: { user }

DELETE /api/users/:id
  Auth: Required (Admin only)
  Response: { message }
```

### Admin Functions
```
GET /api/admin/stats
  Auth: Required (Admin only)
  Response: { stats: { totalUsers, adminCount, etc } }

POST /api/admin/assign-role
  Auth: Required (Admin only)
  Body: { userId, newRole }
  Response: { user }

POST /api/admin/toggle-status
  Auth: Required (Admin only)
  Body: { userId }
  Response: { user }

GET /api/admin/audit-log
  Auth: Required (Admin only)
  Response: { log: [...] }
```

### Dashboard
```
GET /api/dashboard/user
  Auth: Required
  Response: { dashboard: { user, content, features } }

GET /api/dashboard/manager
  Auth: Required (Manager+)
  Response: { dashboard: { stats, recentUsers, features } }

GET /api/dashboard/admin
  Auth: Required (Admin)
  Response: { dashboard: { stats, recentUsers, features } }
```

## 🧪 Testing Scenarios

### Test 1: Role-Based Dashboard Access
```
1. Login as admin@test.com
   → See Admin Dashboard with full stats
2. Login as manager@test.com
   → See Manager Dashboard with limited stats
3. Login as user@test.com
   → See User Dashboard with only personal info
```

### Test 2: Permission Denial
```
1. Login as user@test.com
2. Try to access /admin/users
   → Redirected to /unauthorized (403)
3. Try to make DELETE request
   → API returns 403 Forbidden
```

### Test 3: Token Validation
```
1. Login and copy token from localStorage
2. Open DevTools → Network tab
3. Make API call without token
   → 401 Unauthorized
4. Make API call with wrong token
   → 401 Invalid token
5. Make API call with valid token
   → Success
```

### Test 4: Admin User Management
```
1. Login as admin@test.com
2. Go to /admin/users
3. View all users in the system
4. Click Delete on any user
   → User removed from system
5. Can change roles via API calls
```

### Test 5: Session Management
```
1. Login as any user
2. Check localStorage:
   - token: JWT token
   - user: User JSON
3. Refresh page
   → Still logged in (persistent session)
4. Click Logout
   → localStorage cleared
   → Redirected to login
5. Try accessing dashboard
   → Redirected to login
```

## 🎯 Role Permissions Matrix

| Feature | Admin | Manager | User |
|---------|-------|---------|------|
| View Personal Data | ✅ | ✅ | ✅ |
| View Other Users | ✅ | ❌ | ❌ |
| Edit Content | ✅ | ✅ | ❌ |
| Delete Content | ✅ | ✅ | ❌ |
| View Reports | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| Manage Roles | ✅ | ❌ | ❌ |
| Access Dashboard | ✅ | ✅ | ✅ |
| Access Admin Panel | ✅ | ❌ | ❌ |

## 🔍 Debugging Tips

### Frontend Issues

**Problem: Not logged in after page refresh**
```javascript
// Check AuthContext loading
// localStorage should have 'token' and 'user'
localStorage.getItem('token')
localStorage.getItem('user')

// Clear and try again
localStorage.clear()
// Then login
```

**Problem: Routes not working**
```javascript
// Check React Router paths in App.jsx
// Verify role matches required role
// Check browser console for errors
// Open DevTools → React tab to inspect context
```

**Problem: Navigation menu not updating**
```javascript
// AuthContext might not be updating
// Check Navigation.jsx uses context value
// Verify role is set in user object
```

### Backend Issues

**Problem: Cannot login**
```bash
# Check if MongoDB is running
# Check connection string in .env
# Verify user exists in database
# Check password is correct (demo: password123)
```

**Problem: 403 Forbidden on API**
```bash
# Verify token is sent in header
# Check role matches required role
# Verify permissions assigned to role
# Check middleware order in routes
```

**Problem: CORS errors**
```javascript
// Backend has CORS enabled
// Check API_BASE_URL in frontend/src/api.js
// Verify backend port is 5000
```

## 📊 Database Commands

### View Data with MongoDB CLI

```bash
# Connect to database
mongo mongodb://localhost:27017/rbac_db

# View all users
db.users.find()

# View specific user
db.users.findOne({ email: "admin@test.com" })

# View all roles
db.roles.find()

# Count users by role
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])

# Update user role
db.users.updateOne(
  { email: "user@test.com" },
  { $set: { role: "manager" } }
)

# Delete user
db.users.deleteOne({ email: "test@test.com" })
```

## 🛠️ Common Tasks

### Add New User Programmatically

```bash
# Through API
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "email": "new@test.com",
    "password": "password123",
    "role": "user"
  }'
```

### Change User Role

```bash
# As Admin, call this API
curl -X POST http://localhost:5000/api/admin/assign-role \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "newRole": "manager"
  }'
```

### Get System Stats

```bash
# As Admin only
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer <TOKEN>"
```

## 📱 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | ✅ Success | GET successful |
| 201 | ✅ Created | User registered |
| 400 | ❌ Bad Request | Missing email |
| 401 | ❌ Unauthorized | No/invalid token |
| 403 | ❌ Forbidden | Wrong role |
| 404 | ❌ Not Found | User not found |
| 500 | ❌ Server Error | DB connection failed |

## 🚀 Production Checklist

Before deploying:

- [ ] Change JWT_SECRET in .env
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV=production
- [ ] Disable console.logs
- [ ] Enable HTTPS only
- [ ] Set secure password requirements
- [ ] Configure email notifications
- [ ] Setup logging/monitoring
- [ ] Test all routes thoroughly
- [ ] Setup CI/CD pipeline
- [ ] Configure domain/SSL
- [ ] Backup database strategy

## 📚 Key Files to Understand

### Must Read
1. `backend/middleware/auth.js` - Core RBAC logic
2. `frontend/context/AuthContext.jsx` - State management
3. `frontend/components/ProtectedRoute.jsx` - Route guards
4. `backend/models/User.js` - User schema

### Important
5. `backend/routes/auth.js` - Auth endpoints
6. `backend/routes/admin.js` - Admin features
7. `frontend/components/Dashboard.jsx` - UI components
8. `frontend/src/api.js` - API client

## 🎓 Learning Resources

### Concepts to Study
1. **JWT (JSON Web Tokens)** - Stateless authentication
2. **Bcrypt** - Password hashing algorithm
3. **Middleware** - Express request pipeline
4. **React Context** - State management
5. **MongoDB** - NoSQL database
6. **REST API** - API design principles

### Recommended Reading
- JWT.io documentation
- Express middleware guide
- React Context API docs
- MongoDB schema design
- OWASP Security guidelines

## 🆘 Quick Help

| Question | Answer |
|----------|--------|
| How do I login? | Go to /login and enter demo credentials |
| Where is my token? | localStorage.getItem('token') |
| How do I add a role? | Edit backend/models/Role.js |
| How do I check permissions? | Look at user.permissions array |
| Is password hashed? | Yes, using bcryptjs |
| Can I use OAuth? | Yes, extend auth routes |
| How are dashboards different? | Different data based on role |
| How do I deploy? | See Production Checklist |

## 🎯 Project Goals Summary

✅ **Role Hierarchy**: Admin > Manager > User
✅ **Permissions**: Assigned based on role
✅ **API Security**: JWT + Role validation
✅ **Frontend Guards**: Protected routes by role
✅ **Role-Based UI**: Dynamic content by role

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Setup & Installation | 5 min |
| First login | 2 min |
| Test all 3 roles | 10 min |
| View API docs | 5 min |
| Understand architecture | 15 min |
| Make code changes | 10 min |
| Test changes | 5 min |
| **Total** | **~50 min** |

---

**Quick Reference v1.0**
**Perfect for students and developers**
**Created: April 20, 2026** ✅
