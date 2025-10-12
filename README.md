# Online Upravnik 🏢

Modern system for managing issues in buildings maintained by property managers. The application allows tenants to report issues, managers to assign employees to solve problems, and tracks the entire lifecycle of an issue from report to resolution.

## 📋 Project Description

Online Upravnik is a full-stack application that digitizes the process of managing issues in residential buildings. The system enables:

- **Tenants** - report issues, track status, add problem photos (COMING SOON)
- **Employees** - view assigned issues, update status, add solution photos (COMING SOON)
- **Manager** - manage buildings and tenants, assign issues to employees, view statistics

## 🏗️ Architecture

The project is organized as a **monorepo** with the following structure:

```
online-upravnik/
├── backend/          # NestJS REST API
├── frontend/         # Angular application
└── README.md
```

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator
- **WebSocket**: RxJS Websockets for real-time notifications

### Frontend (Angular)
- **Framework**: Angular 20+ with TypeScript
- **UI**: Angular Material + TailwindCSS
- **State Management**: NgRx (Store, Effects)
- **Routing**: Angular Router with guards
- **HTTP Client**: Angular HttpClient with interceptors

## 🚀 Running the Project

### Prerequisites
- **Docker** and **Docker Compose**
- **Node.js** v20+
- **Bun** package manager (optional)

### Quick Start with Docker Compose

1. **Clone the repository**
```bash
git clone https://github.com/b0g1dan23/online-upravnik.git
cd online-upravnik
```

2. **Start backend services**
```bash
cd backend
docker-compose up --build -d
```

3. **Start frontend**
```bash
cd frontend
npm install
npm start
```

4. **Access the application**
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:9999

> **Note**: Backend must be running before frontend as the frontend depends on the backend API.

### Manual Start

#### Backend
```bash
cd backend
npm install
docker-compose up -d 
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 🗄️ Database

### Entities and Relations

```
Users (tenants)
├── Employee (employees) - extends User
├── Building (buildings)
├── Issue (issues)
├── IssueStatus (status history)
├── IssuePicture (photos)
└── Notification (notifications)
```

#### User
```typescript
class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRoleEnum;
    phoneNumber: string;
    issues: Issue[];
    buildingLivingIn?: Building;
    issuePictures: IssuePicture[];
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
}
```

#### Issue
```typescript
class Issue {
    id: string;
    problemDescription: string;
    user: User;
    building: Building;
    employeeResponsible: Employee;
    statusHistory: IssueStatus[];
    pictures: IssuePicture[];
    notifications: Notification[];
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
}
```

## 🎯 Features

### 👤 Tenants (TENANT)
- ✅ Registration and login
- ✅ Report new issues
- ✅ Report new issues with photos (COMING SOON)
- ✅ Real-time notifications about changes

### 🔧 Employees (EMPLOYEE)
- ✅ View assigned issues
- ✅ Update issue status
- ✅ Add solution photos (COMING SOON)
- ✅ Real-time notifications about new issues

### 👨‍💼 Manager (MANAGER)
- ✅ Manage buildings and tenants
- ✅ Manage employees
- ✅ Assign issues to employees

## 🔐 Authentication and Authorization

- **JWT tokens** for user sessions
- **Role-based access control** (RBAC)
- **Route guards** on frontend
- **Decorator-based authorization** on backend

## 📡 Real-time Communication

The application uses **WebSocket** (RxJS Websockets) for:
- 🔄 Live issue status updates
- 🔄 Live new issue reporting

## 🚀 Deployment
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
# Serve dist/ folder with nginx/apache
```

## 👨‍💻 Author

**Bogdan** - [b0g1dan23](https://github.com/b0g1dan23)

*Last updated: October 12, 2025.*