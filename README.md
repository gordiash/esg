# 🌱 ESG Platform - Comprehensive ESG Management System

Platforma ESG SaaS do zarządzania wskaźnikami środowiskowych, społecznych i zarządzania (Environmental, Social, Governance) dla przedsiębiorstw.

## 🎯 Funkcjonalności

### 🌍 Moduł Środowiskowy
- Kalkulator śladu węglowego
- Monitoring zużycia energii
- Zarządzanie odpadami
- Śledzenie emisji CO2

### 👥 Moduł Społeczny
- Ankiety pracowników
- Metryki różnorodności i inkluzywności
- Monitoring bezpieczeństwa pracy
- Zarządzanie szkołeniami

### ⚖️ Moduł Zarządzania
- Zgodność z przepisami
- Zarządzanie politykami
- Rejestr ryzyk
- Audyty wewnętrzne

### 📊 System Raportowania
- Raporty GRI, SASB, TCFD
- Niestandardowe raporty
- Eksport do PDF/Excel
- Automatyczne generowanie

## 🏗️ Architektura

### Stack Technologiczny
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: NestJS 10, TypeScript, Prisma ORM
- **Database**: MySQL 8.0
- **Cache**: Redis 7
- **Authentication**: Auth0
- **Deployment**: Railway (backend), Vercel (frontend)

### Struktura Projektu
```
esg-platform/
├── frontend/           # Next.js aplikacja
├── backend/           # NestJS API
├── shared/            # Wspólne typy i utilities
├── docs/              # Dokumentacja
├── scripts/           # Skrypty deployment
└── docker-compose.yml # Środowisko dev
```

## 🚀 Quick Start

### Wymagania
- Node.js 18+
- npm 9+
- Docker & Docker Compose

### Instalacja

1. **Klonowanie repozytorium**
```bash
git clone https://github.com/your-org/esg-platform.git
cd esg-platform
```

2. **Instalacja dependencies**
```bash
npm install
npm run install:all
```

3. **Uruchomienie infrastruktury**
```bash
npm run docker:dev
```

4. **Konfiguracja bazy danych**
```bash
cd backend
cp env.example .env
# Edytuj .env z właściwymi wartościami
npm run prisma:migrate
npm run prisma:seed
```

5. **Uruchomienie aplikacji**
```bash
# W terminalu 1 - Backend
cd backend
npm run start:dev

# W terminalu 2 - Frontend
cd frontend
npm run dev
```

6. **Dostęp do aplikacji**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api/v1
- API Docs: http://localhost:3000/api/docs
- PhpMyAdmin: http://localhost:8080

## 📋 Dostępne Skrypty

### Główne skrypty
```bash
npm run dev              # Uruchom frontend i backend
npm run build           # Build wszystkich projektów
npm run test            # Uruchom wszystkie testy
npm run lint            # Linting wszystkich projektów
npm run clean           # Wyczyść node_modules
```

### Backend
```bash
cd backend
npm run start:dev       # Development server
npm run build          # Build produkcyjny
npm run test           # Testy jednostkowe
npm run test:e2e       # Testy E2E
npm run prisma:studio  # Prisma Studio
```

### Frontend
```bash
cd frontend
npm run dev            # Development server
npm run build         # Build produkcyjny
npm run test          # Testy jednostkowe
npm run storybook     # Storybook UI
```

## 🔧 Konfiguracja

### Environment Variables

#### Backend (.env)
```bash
DATABASE_URL="mysql://esg_user:esg_password@localhost:3306/esg_platform_dev"
JWT_SECRET="your-jwt-secret"
AUTH0_DOMAIN="your-auth0-domain.auth0.com"
AUTH0_CLIENT_ID="your-auth0-client-id"
AUTH0_CLIENT_SECRET="your-auth0-client-secret"
REDIS_URL="redis://localhost:6379"
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL="http://localhost:3000/api/v1"
NEXT_PUBLIC_AUTH0_DOMAIN="your-auth0-domain.auth0.com"
NEXT_PUBLIC_AUTH0_CLIENT_ID="your-auth0-client-id"
AUTH0_CLIENT_SECRET="your-auth0-client-secret"
AUTH0_BASE_URL="http://localhost:3001"
AUTH0_SECRET="your-auth0-secret"
```

## 📊 Baza Danych

### Schema
Baza danych zawiera następujące główne tabele:
- `users` - Użytkownicy systemu
- `companies` - Firmy
- `esg_metrics` - Metryki ESG
- `reports` - Raporty
- `surveys` - Ankiety
- `policies` - Polityki
- `tasks` - Zadania
- `audit_logs` - Logi audytu

### Migracje
```bash
cd backend
npm run prisma:migrate      # Uruchom migracje
npm run prisma:generate     # Generuj Prisma Client
npm run prisma:seed         # Załaduj dane testowe
npm run prisma:studio       # Otwórz Prisma Studio
```

## 🧪 Testowanie

### Testy jednostkowe
```bash
npm run test               # Wszystkie testy
npm run test:backend      # Testy backend
npm run test:frontend     # Testy frontend
npm run test:coverage     # Pokrycie testów
```

### Testy E2E
```bash
cd frontend
npm run cypress:open      # Otwórz Cypress
npm run cypress:run       # Uruchom testy E2E
```

## 🚀 Deployment

### Development
```bash
npm run docker:dev        # Uruchom środowisko dev
```

### Production
```bash
# Backend na Railway
railway login
railway deploy

# Frontend na Vercel
vercel login
vercel deploy
```

## 📚 Dokumentacja

- [API Documentation](./docs/api.md)
- [Frontend Guide](./frontend/README.md)
- [Backend Guide](./backend/README.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Wkład w Projekt

### Zasady
1. Sprawdź [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Utwórz branch: `feature/T{X}.{Y}.{Z}-{opis}`
3. Commit zgodnie z [Conventional Commits](https://www.conventionalcommits.org/)
4. Utwórz Pull Request

### Code Style
- ESLint + Prettier
- TypeScript strict mode
- 90% test coverage (backend)
- 80% test coverage (frontend)

## 📄 Licencja

Ten projekt jest objęty licencją [MIT](./LICENSE).

## 🆘 Pomoc

### Często zadawane pytania
1. **Problem z połączeniem do bazy danych**
   - Sprawdź czy Docker jest uruchomiony
   - Zweryfikuj zmienne środowiskowe

2. **Błędy podczas instalacji**
   - Sprawdź wersję Node.js (wymagana 18+)
   - Wyczyść cache: `npm cache clean --force`

3. **Problemy z autoryzacją**
   - Sprawdź konfigurację Auth0
   - Zweryfikuj tokeny JWT

### Wsparcie
- 📧 Email: support@esg-platform.com
- 💬 Slack: #esg-platform-support
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/esg-platform/issues)

## 🎉 Zespół

- **Frontend**: React/Next.js Team
- **Backend**: NestJS Team
- **DevOps**: Infrastructure Team
- **QA**: Testing Team

---

**Wersja**: 1.0.0  
**Ostatnia aktualizacja**: Grudzień 2024 