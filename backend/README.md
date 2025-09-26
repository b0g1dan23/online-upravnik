# Online Upravnik - Backend API

Sistem za upravljanje kvarovima u zgradama koje upravnik održava.

## 🛠️ Tehnologije

- **NestJS** - Node.js framework
- **TypeScript** - Tipiziran JavaScript
- **PostgreSQL** - Relaciona baza podataka
- **TypeORM** - ORM za TypeScript/JavaScript
- **class-validator** - Validacija podataka

## 📋 Trenutno stanje projekta

Trenutno je implementirana osnovna arhitektura baze podataka kroz TypeORM entitete. Kontroleri, servisi i API endpoints još uvek nisu implementirani.

### ✅ Implementirano

- **Struktura baze podataka** - Krerani TypeORM entiteti
- **Moduli** - Osnovni NestJS moduli za svaki entitet
- **Database schema** - Kompletna struktura tabela i relacija

### 🔄 U razvoju

- Kontroleri i servisi
- API endpoints
- Autentifikacija i autorizacija
- Validacija podataka
- Error handling

## 🗄️ Struktura baze podataka

### Entiteti

#### User
Stanari zgrada koji prijavljuju kvarove
- Osnodni podaci (ime, prezime, email, telefon)
- Povezan sa zgradom u kojoj živi
- Može da prijavljuje kvarove
- Može da upload-uje slike kvarova

#### Employee (nasleđuje User)
Zaposleni upravnika odgovorni za rešavanje kvarova
- Dodatno polje: pozicija
- Dodeljene zgrade za održavanje
- Dodeljeni kvarovi za rešavanje

#### Building
Zgrade koje upravnik održava
- Adresa i naziv
- Lista stanara
- Odgovorni zaposleni
- Povezani kvarovi

#### Issue
Prijavljeni kvarovi u zgradama
- Opis problema
- Status (REPORTED, IN_PROGRESS, RESOLVED, CANCELLED)
- Korisnik koji je prijavio
- Zgrada u kojoj se kvar nalazi
- Odgovorni zaposleni
- Istorija statusa
- Slike problema i rešenja

#### IssueStatus
Istorija promena statusa kvara
- Status kvara
- Vreme promene
- Zaposleni koji je promenio status

#### IssuePicture
Slike vezane za kvarove
- Tip slike (PROBLEM/SOLUTION)
- Putanja do fajla
- Korisnik koji je upload-ovao
- Povezani kvar

#### Notification
Obaveštenja za korisnike
- Različiti tipovi obaveštenja
- Ciljani korisnici
- Status pročitanosti

## 🚀 Pokretanje projekta

### Preduslovi

- Node.js (v18+)
- Bun package manager
- Docker i Docker Compose
- PostgreSQL (preko Docker-a)

### Instaliranje

1. Kloniraj repository
```bash
git clone <repository-url>
cd online-upravnik/backend
```

2. Instaliraj dependencies
```bash
bun install
```

3. Pokreni PostgreSQL bazu podataka
```bash
docker-compose up --build -d
```

4. Postavi environment varijable
Kreiraj `.env` fajl sa sledećim varijablama:
```env
PORT=8080
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=online_upravnik
```

5. Pokreni aplikaciju
```bash
bun run start:dev
```

Aplikacija će biti dostupna na `http://localhost:8080`

## 📁 Struktura projekta

```
src/
├── app.module.ts          # Glavni modul aplikacije
├── main.ts               # Entry point
├── buildings/            # Modul za zgrade
├── employees/            # Modul za zaposlene
├── issues/              # Modul za kvarove
├── notifications/       # Modul za obaveštenja
├── tickets/            # Modul za tikete (u razvoju)
└── users/              # Modul za korisnike
```

## 🔮 Buduće implementacije

- **Kontroleri i servisi** - CRUD operacije za sve entitete
- **Autentifikacija** - JWT autentifikacija
- **Autorizacija** - Role-based access control
- **Guard-ovi** - Zaštita ruta
- **Middleware** - Logovanje, validacija
- **S3 integracija** - Upload slika
- **OAuth** - Autentifikacija preko spoljnih servisa
- **API dokumentacija** - Swagger/OpenAPI
- **Testing** - Unit i integration testovi

## 📝 Napomene

Ovo je backend API deo projekta. Frontend deo će biti implementiran u zasebnom folderu.

---
*Poslednje ažurirano: 14. avgust 2025.*
