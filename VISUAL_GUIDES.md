# RBAC System - Visual Guides & Diagrams

## 1. System Overview Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                    RBAC SYSTEM OVERVIEW                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  USER                  BROWSER                   SERVER         │
│  ┌──────────┐         ┌──────────┐              ┌──────────┐   │
│  │ Enters   │ ──────► │ React    │              │ Express  │   │
│  │ Creds    │         │ Frontend │ ◄────────► │ Backend  │   │
│  └──────────┘         └──────────┘              └──────────┘   │
│                            │                         │          │
│                            │ JWT Token               │          │
│                            │ + User Data             │          │
│                            │◄────────────────────────┘          │
│                            │                                    │
│                       ┌────▼────────┐                           │
│                       │ localStorage │                           │
│                       │ - token      │                           │
│                       │ - user       │                           │
│                       └──────────────┘                           │
│                            │                                    │
│        ┌───────────────────┼───────────────────┐               │
│        ▼                   ▼                   ▼               │
│   ┌─────────┐         ┌────────┐         ┌──────────┐         │
│   │ Admin   │         │Manager │         │   User   │         │
│   │Dashboard│         │Dashboard         │Dashboard │         │
│   └─────────┘         └────────┘         └──────────┘         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## 2. Authentication & Authorization Flow

```
START
  │
  ▼
User visits /login
  │
  ▼
Enters email & password
  │
  ▼
POST /auth/login
  │
  ├─────────────────────────┐
  ▼                         ▼
VALID              INVALID
CREDENTIALS        CREDENTIALS
  │                  │
  ▼                  ▼
Find User        Return 401
  │              Unauthorized
  ├─────────┬────┘
  ▼         ▼
Compare   (Invalid
Password   credentials
  │        error)
  ├─────────┬─────┐
  ▼         ▼     ▼
MATCH    NO MATCH
  │         │
  ▼         ▼
Create    Return
JWT       401 Error
Token       │
  │         ▼
  ▼       STOP
Include
user data
  │
  ▼
Store in localStorage
  │
  ▼
Set Authorization header
  │
  ├─────────────────┬──────────────────────┐
  ▼                 ▼                      ▼
Admin           Manager                 User
Dashboard       Dashboard               Dashboard
  │               │                      │
  ├───────────────┴──────────────────────┘
  │
  ▼
Protected by ProtectedRoute
  │
  ├─ Has token? YES ─► Has role? YES ─► Render ✓
  │                        │
  │                        NO
  │                        ▼
  │                   Redirect to /unauthorized
  │
  NO
  ▼
Redirect to /login

END
```

## 3. Role-Based Access Matrix

```
                    ┌─────────────────────────────────────┐
                    │      PERMISSIONS BY ROLE            │
                    ├─────────────────────────────────────┤
                    │                                     │
    READ            │  ADMIN  │ MANAGER │  USER          │
    ┌───────────┐   │   ✅    │   ✅    │  ✅            │
    │ ✅ Admin  │   ├─────────────────────────────────────┤
    │ ✅ Manager│   │  WRITE  │  ✅    │  ✅   │  ❌     │
    │ ✅ User   │   ├─────────────────────────────────────┤
    └───────────┘   │  DELETE │  ✅    │  ✅   │  ❌     │
                    ├─────────────────────────────────────┤
    WRITE           │MANAGE   │  ✅    │  ❌   │  ❌     │
    ┌───────────┐   │USERS    │        │       │         │
    │ ✅ Admin  │   ├─────────────────────────────────────┤
    │ ✅ Manager│   │MANAGE   │  ✅    │  ❌   │  ❌     │
    │ ❌ User   │   │ROLES    │        │       │         │
    └───────────┘   ├─────────────────────────────────────┤
                    │VIEW     │  ✅    │  ✅   │  ❌     │
    DELETE          │REPORTS  │        │       │         │
    ┌───────────┐   └─────────────────────────────────────┘
    │ ✅ Admin  │
    │ ✅ Manager│
    │ ❌ User   │
    └───────────┘
```

## 4. Request Processing Pipeline

```
CLIENT SENDS REQUEST
        │
        ▼
┌────────────────────────────────────────┐
│ Step 1: authMiddleware                 │
│ ─────────────────────────────────────  │
│ • Extract token from header            │
│ • Verify JWT signature                 │
│ • Extract user ID & role               │
│ • Attach to req.userId & req.userRole  │
└────────────────────────────────────────┘
        │
        ├─ NO TOKEN ─► 401 Unauthorized ◄─ STOP
        │
        ├─ INVALID TOKEN ─► 401 Invalid ◄─ STOP
        │
        ▼
┌────────────────────────────────────────┐
│ Step 2: authorize(requiredRoles)       │
│ ─────────────────────────────────────  │
│ • Check if req.userRole in allowed    │
│ • Example: authorize('admin')          │
└────────────────────────────────────────┘
        │
        ├─ ROLE MISMATCH ─► 403 Forbidden ◄─ STOP
        │
        ▼
┌────────────────────────────────────────┐
│ Step 3: checkPermission(perm)          │
│ ─────────────────────────────────────  │
│ • Fetch user from DB                   │
│ • Check permissions array               │
│ • Example: checkPermission('write')     │
└────────────────────────────────────────┘
        │
        ├─ NO PERMISSION ─► 403 Forbidden ◄─ STOP
        │
        ▼
┌────────────────────────────────────────┐
│ Step 4: Route Handler                  │
│ ─────────────────────────────────────  │
│ • Execute business logic                │
│ • Access database                       │
│ • Return response                       │
└────────────────────────────────────────┘
        │
        ▼
RETURN RESPONSE TO CLIENT
        │
        ├─ 200 OK
        ├─ 201 Created
        ├─ 400 Bad Request
        ├─ 401 Unauthorized
        ├─ 403 Forbidden
        ├─ 404 Not Found
        └─ 500 Server Error
```

## 5. Frontend Route Protection

```
┌──────────────────────────────────┐
│ User clicks link                 │
│ Navigate to /admin/users         │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ React Router matches route       │
│ Found: <ProtectedRoute>          │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ ProtectedRoute checks:           │
│ 1. Is user logged in?            │
│ 2. Does user have role?          │
└──────────────────────────────────┘
        │
        ├─ NO USER ────────────► Redirect to /login
        │
        ├─ WRONG ROLE ─────────► Redirect to /unauthorized
        │
        ▼
┌──────────────────────────────────┐
│ YES: Render Component            │
│ <AdminDashboard />               │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ Component Mounts                 │
│ • useEffect called               │
│ • Fetch data from API            │
│ • Render UI                      │
└──────────────────────────────────┘
```

## 6. Database Schema Relationship

```
┌──────────────────────────────────────────┐
│            ROLES COLLECTION              │
├──────────────────────────────────────────┤
│ _id: ObjectId                            │
│ name: "admin" | "manager" | "user"      │
│ description: String                      │
│ permissions: [                           │
│   "read", "write", "delete", ...        │
│ ]                                        │
│ createdAt: Date                          │
└────────────────────┬──────────────────────┘
                     │
                     │ Referenced by
                     │
┌────────────────────▼──────────────────────┐
│            USERS COLLECTION              │
├──────────────────────────────────────────┤
│ _id: ObjectId                            │
│ name: String                             │
│ email: String (unique)                   │
│ password: String (hashed)                │
│ role: "admin" | "manager" | "user"      │
│ permissions: [String]                    │
│ isActive: Boolean                        │
│ createdAt: Date                          │
│ lastLogin: Date                          │
└──────────────────────────────────────────┘
```

## 7. Login Session Lifecycle

```
SESSION LIFECYCLE
─────────────────

T=0: User Opens App
    └─► Check localStorage
        ├─ Token found? ──► isLoading = false ──► Render Dashboard
        └─ Not found? ───► isLoading = false ──► Render Login

T=1: User Logs In
    ├─► POST /auth/login
    ├─► Receive token + user
    ├─► localStorage.setItem('token', token)
    ├─► localStorage.setItem('user', userData)
    └─► Render Dashboard

T=2-N: User Browsing
    ├─► Every API call includes token
    ├─► Authorization: Bearer <token>
    ├─► Backend validates token
    └─► Request succeeds or fails

T=LOGOUT: User Logs Out
    ├─► localStorage.removeItem('token')
    ├─► localStorage.removeItem('user')
    ├─► Render Login Page
    └─► Session ends

PERSISTENCE
───────────
On Page Refresh:
    ├─ localStorage still has token
    ├─ AuthProvider detects it on mount
    ├─ User stays logged in
    └─ No need to login again

After Browser Close:
    ├─ localStorage persists (unless cleared)
    ├─ User still logged in next time
    └─ Token expires after 7 days
```

## 8. Role Hierarchy Tree

```
                         SYSTEM
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
             ADMIN       MANAGER      USER
              100%         60%         20%
                │           │           │
         ┌──────┴──────┐    │      ┌────┘
         ▼             ▼    │      ▼
      Create        Modify  │    Read
      Delete        View    │    Profile
      Assign        Reports │    Dashboard
      Manage        Metrics │    Data
      Stats         Team     │
      Audit         History  │

PERMISSION INHERITANCE
─────────────────────

Admin has all Manager permissions + Admin permissions
Manager has all User permissions + Manager permissions
User has only User permissions
```

## 9. API Call Sequence Diagram

```
┌─────────┐                    ┌────────┐                   ┌────────┐
│ BROWSER │                    │BACKEND │                   │MongoDB │
└────┬────┘                    └───┬────┘                   └───┬────┘
     │                             │                            │
     │ POST /auth/login            │                            │
     │ {email, password}           │                            │
     ├────────────────────────────►│                            │
     │                             │ Find user by email         │
     │                             ├───────────────────────────►│
     │                             │ {email: admin@test.com}   │
     │                             │◄───────────────────────────┤
     │                             │ User document              │
     │                             │                            │
     │                      [Verify Password]                   │
     │                      [Generate JWT]                      │
     │                             │                            │
     │    {token, user}            │                            │
     │◄────────────────────────────┤                            │
     │                             │                            │
     [Store in localStorage]       │                            │
     │                             │                            │
     │ GET /api/dashboard/admin    │                            │
     │ Authorization: Bearer token │                            │
     ├────────────────────────────►│                            │
     │                       [Verify JWT]                       │
     │                             │ Find admin stats          │
     │                             ├───────────────────────────►│
     │                             │ {role: "admin"}           │
     │                             │◄───────────────────────────┤
     │                             │ {totalUsers: 5, ...}      │
     │    {dashboard data}         │                            │
     │◄────────────────────────────┤                            │
     │                             │                            │
     [Render Dashboard]            │                            │
     │                             │                            │

TIME SEQUENCE:
 T=0ms ┤ Request sent
 T=50ms ┤ Database query
 T=60ms ┤ Response received
 T=65ms ┤ Rendered to user
```

## 10. State Management Flow (Context API)

```
┌─────────────────────────────────────────────────────────┐
│                   AUTHCONTEXT                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  STATE:                                                 │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ user: {      │  │isLoading:│  │    ACTIONS:      │ │
│  │  id,         │  │Boolean   │  │ ┌──────────────┐ │ │
│  │  name,       │  │          │  │ │ login()      │ │ │
│  │  email,      │  │          │  │ │ logout()     │ │ │
│  │  role,       │  │          │  │ │ updateUser() │ │ │
│  │  permissions │  │          │  │ └──────────────┘ │ │
│  │ }            │  │          │  │                  │ │
│  └──────────────┘  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────┘
               │
               │ Provider wraps App
               │
        ┌──────┴──────┐
        │             │
    Components    useContext(AuthContext)
        │             │
   can access all context values
```

## 11. Component Hierarchy

```
                        <App />
                          │
                    ┌─────┴─────┐
                    │           │
            <Router>            │
              │                 │
         <Routes>               │
              │                 │
    ┌─────────┼─────────┬──────┘
    │         │         │
    ▼         ▼         ▼
 <Login>  <Register>  <ProtectedRoute>
    │         │              │
    │         │         ┌────┴────┬──────┬────────┐
    │         │         │         │      │        │
    │         │         ▼         ▼      ▼        ▼
    │         │      <UserDB> <MgrDB> <AdminDB> <ManageUsers>
    │         │
    └─────────┴──► <Navigation />
                   (Shown on all protected routes)

AuthContext wraps entire App
    │
    └─► Available in all components
```

## 12. Error Response Flowchart

```
┌─ API REQUEST FAILS
│
└─► Check Error Status Code
    │
    ├─ 401 Unauthorized
    │   ├─ No token provided
    │   ├─ Invalid token
    │   └─► Action: Redirect to /login
    │
    ├─ 403 Forbidden
    │   ├─ Insufficient role
    │   ├─ Missing permission
    │   └─► Action: Redirect to /unauthorized
    │
    ├─ 404 Not Found
    │   ├─ User not found
    │   ├─ Resource deleted
    │   └─► Action: Show 404 page
    │
    ├─ 400 Bad Request
    │   ├─ Invalid email format
    │   ├─ Missing required field
    │   └─► Action: Show validation message
    │
    └─ 5xx Server Error
        ├─ Database connection lost
        ├─ Server crashed
        └─► Action: Show error message
```

---

**Visual Guides v1.0**
**Easy to understand diagrams**
**Created: April 20, 2026** ✅
