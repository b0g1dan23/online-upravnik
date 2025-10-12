# Online Upravnik 🏢

Moderni sistem za upravljanje kvarovima u zgradama koje upravnik održava. Aplikacija omogućava stanarima da prijavljuju kvarove, upravniku da dodeljuje zaposlene za rešavanje problema, i prati ceo životni ciklus kvara od prijave do rešenja.

## 📋 Opis projekta

Online Upravnik je full-stack aplikacija koja digitalizuje proces upravljanja kvarovima u stambenim zgradama. Sistem omogućava:

- **Stanarima** - prijavu kvarova, praćenje statusa, dodavanje fotografija problema (USKORO)
- **Zaposlenima** - pregled dodeljenih kvarova, ažuriranje statusa, dodavanje fotografija rešenja (USKORO)
- **Upravniku** - upravljanje zgradama, zaposlenima, dodela kvarova, pregled statistika

## 🏗️ Arhitektura

Projekat je organizovan kao **monorepo** sa sledećom strukturom:

```
online-upravnik/
├── backend/          # NestJS REST API
├── frontend/         # Angular aplikacija
└── README.md
```

### Backend (NestJS)
- **Framework**: NestJS sa TypeScript
- **Baza podataka**: PostgreSQL sa TypeORM
- **Autentifikacija**: JWT sa Passport.js
- **Validacija**: class-validator
- **WebSocket**: RxJS Websockets za real-time notifikacije

### Frontend (Angular)
- **Framework**: Angular 20+ sa TypeScript
- **UI**: Angular Material + TailwindCSS
- **State Management**: NgRx (Store, Effects)
- **Routing**: Angular Router sa guard-ovima
- **HTTP Client**: Angular HttpClient sa interceptor-ima

## 🚀 Pokretanje projekta

### Preduslovi
- **Docker** i **Docker Compose**
- **Node.js** v20+
- **Bun** package manager (opciono)

### Brzo pokretanje sa Docker Compose

1. **Kloniraj repository**
```bash
git clone https://github.com/b0g1dan23/online-upravnik.git
cd online-upravnik
```

2. **Pokreni backend servise**
```bash
cd backend
docker-compose up --build -d
```

3. **Pokreni frontend**
```bash
cd frontend
npm install
npm start
```

4. **Pristupi aplikaciji**
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:9999

> **Napomena**: Backend mora biti pokrenut pre frontend-a jer frontend zavisi od backend API-ja.

### Manuelno pokretanje

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

## 🗄️ Baza podataka

### Entiteti i relacije

```
Users (stanari)
├── Employee (zaposleni) - extends User
├── Building (zgrade)
├── Issue (kvarovi)
├── IssueStatus (istorija statusa)
├── IssuePicture (fotografije)
└── Notification (obaveštenja)
```

#### User (Korisnik)
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

#### Issue (Kvar)
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

## 🎯 Funkcionalnosti

### 👤 Stanari (TENANT)
- ✅ Registracija i prijava
- ✅ Prijava novih kvarova
- ✅ Prijava novih kvarova sa fotografijama (USKORO)
- ✅ Real-time obaveštenja o promenama

### 🔧 Zaposleni (EMPLOYEE)
- ✅ Pregled dodeljenih kvarova
- ✅ Ažuriranje statusa kvarova
- ✅ Dodavanje fotografija rešenja (USKORO)
- ✅ Real-time obaveštenja o novim kvarovima

### 👨‍💼 Upravnik (MANAGER)
- ✅ Upravljanje zgradama i stanarima
- ✅ Upravljanje zaposlenima
- ✅ Dodela kvarova zaposlenima

## 🔐 Autentifikacija i autorizacija

- **JWT tokeni** za sesiju korisnika
- **Role-based access control** (RBAC)
- **Route guards** na frontend-u
- **Decorator-based authorization** na backend-u

## 📡 Real-time komunikacija

Aplikacija koristi **WebSocket** (RxJS Websockets) za:
- 🔄 Live ažuriranje statusa kvarova
- 🔄 Live prijavljivanje novog kvara

## 🚀 Deployment
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
# Serve dist/ folder sa nginx/apache
```

## 👨‍💻 Autor

**Bogdan** - [b0g1dan23](https://github.com/b0g1dan23)

*Poslednje ažurirano: 12. oktobar 2025.*