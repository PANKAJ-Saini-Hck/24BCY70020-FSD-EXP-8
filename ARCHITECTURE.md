# RBAC System - Architecture & Implementation Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     RBAC System Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  FRONTEND (React)          API LAYER (Express)    DATABASE   │
│  ┌────────────────┐        ┌──────────────┐      ┌────────┐ │
│  │ Login/Register │◄──────►│ /auth        │      │        │ │
│  │                │        │              │      │        │ │
│  │ Navigation     │        ├──────────────┤      │MongoDB │ │
│  │ (Role Menu)    │        │ /users       │      │        │ │
│  │                │        │ (Role Check) │──────┤        │ │
│  │ Dashboards     │        │              │      │        │ │
│  │ (User/Mgr/Ad)  │        ├──────────────┤      │        │ │
│  │                │◄──────►│ /admin       │      │        │ │
│  │ ProtectedRoute │        │ (Auth)       │      │        │ │
│  │ (Role Guards)  │        │              │      │        │ │
│  │                │        ├──────────────┤      │        │ │
│  │ UI Elements    │        │ /dashboard   │      │        │ │
│  │ (Permission)   │        │ (JWT Val)    │      │        │ │
│  │                │        │              │      │        │ │
│  └────────────────┘        └──────────────┘      └────────┘ │
│                                   ▲                          │
│                                   │                          │
│                           ┌────────┴──────────┐              │
│                           │  MIDDLEWARE STACK │              │
│                           ├───────────────────┤              │
│                           │ 1. authMiddleware │              │
│                           │    (JWT validate) │              │
│                           │ 2. authorize()    │              │
│                           │    (Role check)   │              │
│                           │ 3. checkPermission│              │
│                           │    (Perm check)   │              │
│                           └───────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Authentication Flow
```
User submits credentials
         ↓
POST /auth/login
         ↓
Backend validates email/password
         ↓
Generate JWT = { id, role, expiresIn }
         ↓
Return token + user data
         ↓
Store token in localStorage
         ↓
Store user in localStorage
         ↓
Redirect to role-specific dashboard
```

### API Call Flow with RBAC
```
Frontend makes API call
         ↓
Include Authorization: Bearer <token>
         ↓
authMiddleware extracts & verifies token
         ↓
Extract userId & role from token
         ↓
authorize(role) checks if allowed
         ↓
checkPermission(perm) validates specific permission
         ↓
Route handler executes
         ↓
Return response or error (401/403)
```

### Route Protection Flow
```
User navigates to /admin/users
         ↓
React Router checks route guards
         ↓
ProtectedRoute component checks:
  - Is user logged in?
  - Does user have required role?
         ↓
Yes → Render component
No → Redirect to /login or /unauthorized
```

## Role Hierarchy Model

```
ADMIN (Super User)
├── Permissions: read, write, delete, manage_users, view_reports, manage_roles
├── Features: Full system access
├── Can: Create/delete users, change roles, view all data
└── Cannot: Nothing restricted

    │
    ▼

MANAGER (Team Lead)
├── Permissions: read, write, delete, view_reports
├── Features: Team management
├── Can: View/create/delete content, generate reports
└── Cannot: Manage users, change roles

    │
    ▼

USER (Employee)
├── Permissions: read
├── Features: Personal dashboard
├── Can: View assigned content
└── Cannot: Modify, delete, or access admin features
```

## Permission Matrix

```
┌──────────────────┬────────┬─────────┬──────┐
│ Permission       │ Admin  │ Manager │ User │
├──────────────────┼────────┼─────────┼──────┤
│ read             │   ✓    │    ✓    │  ✓   │
│ write            │   ✓    │    ✓    │  ✗   │
│ delete           │   ✓    │    ✓    │  ✗   │
│ manage_users     │   ✓    │    ✗    │  ✗   │
│ view_reports     │   ✓    │    ✓    │  ✗   │
│ manage_roles     │   ✓    │    ✗    │  ✗   │
└──────────────────┴────────┴─────────┴──────┘
```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,         // unique
  password: String,      // hashed with bcrypt
  role: String,          // enum: admin, manager, user
  permissions: Array,    // assigned based on role
  isActive: Boolean,
  createdAt: Date,
  lastLogin: Date
}
```

### Role Collection
```javascript
{
  _id: ObjectId,
  name: String,          // enum: admin, manager, user
  description: String,
  permissions: Array,    // array of permission strings
  createdAt: Date
}
```

## Middleware Implementation

### 1. Authentication Middleware
```
Request Header: Authorization: Bearer <token>
         ↓
Extract token from header
         ↓
Verify token with JWT_SECRET
         ↓
Extract payload { id, role }
         ↓
Attach to req.userId & req.userRole
         ↓
Call next()
```

### 2. Authorization Middleware
```
Check: allowedRoles.includes(req.userRole)
         ↓
If YES: Call next()
If NO: Return 403 Forbidden
```

### 3. Permission Middleware
```
Fetch user from database
         ↓
Check: user.permissions.includes(requiredPermission)
         ↓
If YES: Call next()
If NO: Return 403 Forbidden
```

## Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Navigate (Router)
│       ├── Navigation (Layout)
│       └── Routes
│           ├── Login (Public)
│           ├── Register (Public)
│           ├── ProtectedRoute
│           │   ├── UserDashboard
│           │   ├── ManagerDashboard
│           │   ├── AdminDashboard
│           │   └── ManageUsers
│           ├── Unauthorized
│           └── NotFound
```

## State Management (Context API)

### AuthContext
```javascript
{
  user: {
    id: String,
    name: String,
    email: String,
    role: String,
    permissions: Array
  },
  isLoading: Boolean,
  login: Function,      // (user, token) => void
  logout: Function,     // () => void
  updateUser: Function  // (user) => void
}
```

## API Response Formats

### Success Response (200/201)
```json
{
  "message": "Operation successful",
  "data": { /* endpoint specific data */ }
}
```

### Error Response (4xx/5xx)
```json
{
  "message": "Error description"
}
```

## Security Implementation

### Password Security
```
User enters password
         ↓
bcrypt.genSalt(10) → salt
         ↓
bcrypt.hash(password, salt) → hashed
         ↓
Store hashed password in database
         ↓
Never store or transmit plain password
```

### JWT Token Security
```
Token created with:
  - userId (identifier)
  - role (access level)
  - expiresIn (time limit)
  - JWT_SECRET (signature)

         ↓

Stored in localStorage (client-side)

         ↓

Sent in Authorization header
  Authorization: Bearer <token>

         ↓

Verified with same JWT_SECRET on backend
```

### CORS Protection
```
Backend allows requests from frontend domain
         ↓
Credentials included when needed
         ↓
Only specific headers allowed
```

## Error Handling

### HTTP Status Codes
```
200 OK               - Request successful
201 Created          - Resource created
400 Bad Request      - Invalid input
401 Unauthorized     - Missing/invalid token
403 Forbidden        - Insufficient permissions
404 Not Found        - Resource not found
500 Internal Error   - Server error
```

### Frontend Error Handling
```
Try {
  Make API call
} Catch {
  Check error.response.status
    ├─ 401 → Redirect to login
    ├─ 403 → Redirect to unauthorized
    ├─ 404 → Show 404 page
    └─ 5xx → Show error message
}
```

## Key Implementation Files

| File | Purpose |
|------|---------|
| backend/models/User.js | User schema with password hashing |
| backend/models/Role.js | Role definitions with permissions |
| backend/middleware/auth.js | RBAC middleware stack |
| backend/routes/auth.js | Login/register endpoints |
| backend/routes/admin.js | Admin-only endpoints |
| frontend/context/AuthContext.jsx | Global auth state |
| frontend/components/ProtectedRoute.jsx | Route guards |
| frontend/components/Dashboard.jsx | Role dashboards |
| frontend/src/api.js | API client with interceptors |

## Testing Checklist

### Functionality Tests
- [ ] User can register and auto-login
- [ ] User can login with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Token stored in localStorage after login
- [ ] User logged out clears localStorage
- [ ] Admin can view all users
- [ ] Admin can change user roles
- [ ] Manager cannot access admin features
- [ ] User cannot access manager features

### Security Tests
- [ ] Cannot access API without token
- [ ] Cannot access protected routes without login
- [ ] Cannot access admin routes as non-admin
- [ ] Invalid token returns 401
- [ ] Expired token requires re-login
- [ ] Password is hashed in database
- [ ] Password not visible in API responses

### UI/UX Tests
- [ ] Navigation menu changes by role
- [ ] Dashboard content matches role
- [ ] Unauthorized access redirects properly
- [ ] Error messages display correctly
- [ ] Loading states show during API calls
- [ ] Responsive design on mobile

## Performance Optimization

### Frontend
- [ ] Lazy load route components
- [ ] Cache dashboard data
- [ ] Minimize API calls
- [ ] Debounce search inputs
- [ ] Optimize re-renders

### Backend
- [ ] Use indexes on User.email
- [ ] Cache role permissions
- [ ] Implement pagination
- [ ] Use query projections
- [ ] Connection pooling

## Scaling Considerations

1. **Database**: Add indexes on frequently queried fields
2. **API**: Implement rate limiting and caching
3. **Auth**: Consider OAuth2/OpenID Connect
4. **Tokens**: Implement refresh token rotation
5. **Audit**: Archive old audit logs
6. **Sessions**: Use Redis for session storage

## Integration Points

### With External Services
- Email service for password reset
- SMS for two-factor authentication
- OAuth providers for social login
- Analytics services for tracking

### With Frontend Frameworks
- Redux for complex state (alternative to Context)
- GraphQL instead of REST API
- Next.js for SSR
- TypeScript for type safety

---

**Document Version**: 1.0
**Last Updated**: April 20, 2026
**Status**: Complete and Documented ✅
