# 🖥️ Stack Technologiczny & Standardy Kodowania – ESG SaaS Platform

## 📋 1. FRONTEND STACK

### 1.1 Technologie Podstawowe
- **React 18** + **Next.js 14** (App Router)
- **TypeScript 5** (`strict: true`)
- **Tailwind CSS 3** + **Headless UI**
- **Zustand** (zarządzanie stanem prostym) / **Redux Toolkit** (domeny złożone)
- **TanStack Query** (cache HTTP + synchronizacja)
- **React Hook Form** + **Zod** (walidacja formularzy)
- **Chart.js** + **react-chartjs-2** (wizualizacje ESG)
- **react-i18next** (internacjonalizacja)

### 1.2 Konwencje Nazewnictwa Frontend
```
Komponenty:     PascalCase.tsx
Hooki:          use-nazwa.ts
Utilities:      kebab-case.ts
Typy:           PascalCase.types.ts
Stałe:          UPPER_SNAKE_CASE
```

### 1.3 Struktura Komponentów
```
/components/
  /ComponentName/
    ├── ComponentName.tsx
    ├── ComponentName.test.tsx
    ├── ComponentName.stories.tsx
    ├── ComponentName.module.css
    └── index.ts
```

### 1.4 Standardy Kodowania Frontend
- **Wyłącznie komponenty funkcyjne** + React Hooks
- **Brak `any`** - dopuszczalne tylko z `// FIXME: uzasadnienie`
- **Aliasy importów**: `@/components/*`, `@/lib/*`, `@/types/*`
- **Atomic Design**: `atoms → molecules → organisms → templates → pages`
- **Lazy loading**: komponenty > 50KB w dynamic imports
- **Memoizacja**: `React.memo` dla komponentów renderowanych > 10x

### 1.5 ESLint & Prettier Frontend
```json
{
  "extends": [
    "airbnb-typescript",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:tailwindcss/recommended"
  ],
  "rules": {
    "no-console": "error",
    "prefer-const": "error",
    "react/jsx-props-no-spreading": "off"
  }
}
```

**Prettier Config:**
```json
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true
}
```

---

## 🔧 2. BACKEND STACK

### 2.1 Technologie Podstawowe
- **Node.js 20 LTS** + **NestJS 10**
- **TypeScript 5** (`strict: true`)
- **Prisma ORM 5** + **PostgreSQL 15**
- **Auth0 OIDC** + **Passport.js**
- **Redis 7** + **BullMQ** (kolejki zadań)
- **AWS SQS** (integracje asynchroniczne)
- **Pino** (strukturalne logowanie)

### 2.2 Struktura Modułów Backend
```
src/
├── modules/
│   └── <domain>/
│       ├── dto/
│       │   ├── create-<domain>.dto.ts
│       │   └── update-<domain>.dto.ts
│       ├── entities/
│       │   └── <domain>.entity.ts
│       ├── <domain>.controller.ts
│       ├── <domain>.service.ts
│       ├── <domain>.repository.ts
│       ├── <domain>.module.ts
│       └── __tests__/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
└── database/
    ├── migrations/
    └── seeds/
```

### 2.3 Konwencje Nazewnictwa Backend
```
Klasy:          PascalCase
Metody:         camelCase
Zmienne:        camelCase
Stałe:          UPPER_SNAKE_CASE
Pliki:          kebab-case.ts
Interfejsy:     IPascalCase
Enumy:          EPascalCase
```

### 2.4 Standardy Kodowania Backend
- **Maksymalnie 3 linie w kontrolerze** - reszta w serwisie
- **Dependency Injection** - wszystkie zależności przez konstruktor
- **DTO validation** - `class-validator` + `class-transformer`
- **Logowanie strukturalne** - Pino z `requestId`
- **Obsługa błędów** - własne klasy w `src/common/errors/`
- **Zero `console.log`** w produkcji

### 2.5 Przykład Kontrolera
```typescript
@Controller('esg-metrics')
@UseGuards(JwtAuthGuard)
@ApiTags('ESG Metrics')
export class EsgMetricsController {
  constructor(private readonly esgMetricsService: EsgMetricsService) {}

  @Post()
  @ApiOperation({ summary: 'Create ESG metric' })
  async create(@Body() createDto: CreateEsgMetricDto): Promise<EsgMetric> {
    return this.esgMetricsService.create(createDto);
  }
}
```

### 2.6 Przykład Serwisu
```typescript
@Injectable()
export class EsgMetricsService {
  constructor(
    private readonly esgMetricsRepository: EsgMetricsRepository,
    private readonly logger: LoggerService
  ) {}

  async create(createDto: CreateEsgMetricDto): Promise<EsgMetric> {
    this.logger.log('Creating ESG metric', { dto: createDto });
    
    try {
      const metric = await this.esgMetricsRepository.create(createDto);
      this.logger.log('ESG metric created successfully', { id: metric.id });
      return metric;
    } catch (error) {
      this.logger.error('Failed to create ESG metric', error);
      throw new BadRequestException('Failed to create ESG metric');
    }
  }
}
```

---

## 🗄️ 3. BAZA DANYCH

### 3.1 Prisma Schema Conventions
```prisma
model Company {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("companies")
}
```

### 3.2 Standardy Bazy Danych
- **Nazwy tabel**: `snake_case` (plural)
- **Kolumny**: `snake_case`
- **Klucze główne**: `id` (cuid)
- **Timestamps**: `created_at`, `updated_at`
- **Indeksy**: na wszystkich kolumnach używanych w `WHERE`
- **Migracje**: opisowe nazwy `YYYYMMDD_hhmmss_description`

### 3.3 Przykład Migracji
```sql
-- CreateTable
CREATE TABLE "esg_metrics" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "metric_type" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "esg_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "esg_metrics_company_id_idx" ON "esg_metrics"("company_id");
CREATE INDEX "esg_metrics_metric_type_idx" ON "esg_metrics"("metric_type");
```

---

## 🔐 4. BEZPIECZEŃSTWO

### 4.1 Wymagania Bezpieczeństwa
- **Helmet.js** - zabezpieczenia HTTP headers
- **CSRF Protection** dla publicznych endpointów
- **Rate Limiting** - 100 req/min per IP
- **Input Validation** - wszystkie DTO z walidacją
- **SQL Injection Prevention** - tylko Prisma queries
- **XSS Protection** - sanityzacja wszystkich inputów

### 4.2 Autoryzacja
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.COMPANY_MANAGER)
@ApiSecurity('bearer')
export class CompanyController {
  // endpoints
}
```

### 4.3 Logowanie Bezpieczeństwa
```typescript
// Security events logging
this.logger.warn('Unauthorized access attempt', {
  userId: req.user?.id,
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  endpoint: req.path
});
```

---

## 🧪 5. TESTY

### 5.1 Frontend Testing
```typescript
// Component test example
describe('EsgMetricCard', () => {
  it('should display metric value correctly', () => {
    render(<EsgMetricCard metric={mockMetric} />);
    expect(screen.getByText('1,234.56')).toBeInTheDocument();
  });
});
```

### 5.2 Backend Testing
```typescript
// Service test example
describe('EsgMetricsService', () => {
  it('should create metric successfully', async () => {
    const createDto = { companyId: '123', type: 'CARBON', value: 100 };
    const result = await service.create(createDto);
    expect(result.id).toBeDefined();
  });
});
```

### 5.3 E2E Testing
```typescript
// Cypress test example
describe('ESG Dashboard', () => {
  it('should display metrics after login', () => {
    cy.login('user@example.com', 'password');
    cy.visit('/dashboard');
    cy.get('[data-testid="esg-metrics"]').should('be.visible');
  });
});
```

### 5.4 Pokrycie Testów
- **Backend**: ≥ 90% coverage
- **Frontend**: ≥ 80% coverage
- **E2E**: Krytyczne user journeys
- **Testy obowiązkowe**: wszystkie serwisy i komponenty

---

## 🚀 6. DEPLOYMENT & DEVOPS

### 6.1 Docker Configuration
```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 6.2 CI/CD Pipeline
```yaml
# GitHub Actions example
name: CI/CD Pipeline
on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run tests
        run: npm run test:coverage
      - name: Build application
        run: npm run build
```

### 6.3 Infrastruktura AWS
- **ECS Fargate** - konteneryzacja aplikacji
- **RDS PostgreSQL** - baza danych
- **ElastiCache Redis** - cache i kolejki
- **S3** - pliki statyczne
- **CloudFront** - CDN
- **Route 53** - DNS
- **ALB** - load balancer

---

## 📊 7. MONITORING & LOGGING

### 7.1 Strukturalne Logowanie
```typescript
// Pino logger configuration
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Usage example
logger.info('User action completed', {
  userId: user.id,
  action: 'CREATE_METRIC',
  resourceId: metric.id,
  duration: Date.now() - startTime
});
```

### 7.2 Metryki Aplikacji
- **Response Time**: < 200ms (95th percentile)
- **Error Rate**: < 1%
- **Uptime**: > 99.9%
- **Database Queries**: < 100ms average
- **Memory Usage**: < 80% container limit

### 7.3 Alerty
```typescript
// Health check endpoint
@Get('health')
@ApiOperation({ summary: 'Health check' })
async health(): Promise<HealthStatus> {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: await this.databaseService.isHealthy(),
    redis: await this.redisService.isHealthy()
  };
}
```

---

## 🔄 8. WORKFLOW & BRANCHING

### 8.1 Git Flow
```
main/
├── dev/
├── feature/T{X}.{Y}.{Z}-{opis}
├── hotfix/{opis}
└── release/v{X}.{Y}.{Z}
```

### 8.2 Commit Messages
```
feat(auth): implementacja JWT middleware (#T2.1.2)
fix(dashboard): naprawa wyświetlania metryk ESG (#T3.3.2)
docs(api): aktualizacja dokumentacji endpoints (#T2.3.1)
test(metrics): dodanie testów jednostkowych (#T2.3.1)
```

### 8.3 Pull Request Checklist
- [ ] Kod przechodzi wszystkie testy
- [ ] ESLint/Prettier bez błędów
- [ ] Pokrycie testów ≥ wymaganych progów
- [ ] Dokumentacja zaktualizowana
- [ ] Brak `TODO`/`FIXME` bez uzasadnienia
- [ ] API endpoints udokumentowane w Swagger
- [ ] Migracje bazy danych przetestowane

---

## 📚 9. DOKUMENTACJA

### 9.1 Komentarze w Kodzie
```typescript
/**
 * Calculates carbon footprint for given company
 * @param companyId - Unique company identifier
 * @param period - Calculation period
 * @returns Carbon footprint data with breakdown
 */
async calculateCarbonFootprint(
  companyId: string,
  period: DatePeriod
): Promise<CarbonFootprintData> {
  // Implementation
}
```

### 9.2 API Documentation
- **OpenAPI 3.0** generowane automatycznie
- **Swagger UI** dostępne na `/api/docs`
- **Przykłady requestów/responses**
- **Kody błędów** z opisami

### 9.3 Storybook
```typescript
// Component story example
export default {
  title: 'Components/EsgMetricCard',
  component: EsgMetricCard,
} as ComponentMeta<typeof EsgMetricCard>;

export const Default: ComponentStory<typeof EsgMetricCard> = (args) => (
  <EsgMetricCard {...args} />
);

Default.args = {
  metric: {
    id: '1',
    type: 'CARBON',
    value: 1234.56,
    unit: 'tCO2e'
  }
};
```

---

## ⚡ 10. WYDAJNOŚĆ

### 10.1 Frontend Performance
- **Code Splitting**: każda strona w osobnym chunku
- **Lazy Loading**: komponenty > 50KB
- **Image Optimization**: Next.js Image component
- **Bundle Size**: < 250KB gzipped
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1

### 10.2 Backend Performance
- **Database Indexing**: wszystkie kolumny w WHERE
- **Query Optimization**: EXPLAIN ANALYZE dla slow queries
- **Caching**: Redis TTL 5min dla read-only data
- **Connection Pooling**: max 20 connections
- **Response Compression**: gzip dla responses > 1KB

### 10.3 Monitoring Performance
```typescript
// Performance interceptor
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        if (duration > 1000) {
          this.logger.warn('Slow endpoint detected', {
            endpoint: context.getHandler().name,
            duration
          });
        }
      })
    );
  }
}
```

---

## 🛡️ 11. JAKOŚĆ KODU

### 11.1 Linting Configuration
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:security/recommended"
  ],
  "rules": {
    "no-console": "error",
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

### 11.2 Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### 11.3 SonarQube Rules
- **Cognitive Complexity**: < 15 per function
- **Cyclomatic Complexity**: < 10 per function
- **Duplicated Lines**: < 3%
- **Technical Debt**: < 5%

---

## 🔧 12. NARZĘDZIA DEWELOPERSKIE

### 12.1 VS Code Extensions
- TypeScript Hero
- ESLint
- Prettier
- Auto Rename Tag
- GitLens
- Thunder Client
- Prisma

### 12.2 Debugowanie
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug NestJS",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/main.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "runtimeArgs": ["--nolazy", "-r", "ts-node/register"]
    }
  ]
}
```

### 12.3 Package Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run"
  }
}
```

---

## 📝 13. COMPLIANCE & AUDYT

### 13.1 Security Scanning
```bash
# Dependency scanning
npm audit --audit-level=high
snyk test

# SAST scanning
eslint --ext .ts,.tsx src/
semgrep --config=auto src/
```

### 13.2 GDPR Compliance
- **Data Minimization**: tylko niezbędne dane
- **Consent Management**: explicit opt-in
- **Right to Erasure**: soft delete z anonymizacją
- **Data Export**: JSON format dla user data

### 13.3 Audit Logging
```typescript
// Audit log example
@Injectable()
export class AuditService {
  async logUserAction(action: AuditAction): Promise<void> {
    await this.auditRepository.create({
      userId: action.userId,
      action: action.type,
      resourceId: action.resourceId,
      ipAddress: action.ipAddress,
      userAgent: action.userAgent,
      timestamp: new Date()
    });
  }
}
```

---

## 🎯 14. ZAKOŃCZENIE

**Te standardy obowiązują wszystkich deweloperów w projekcie ESG SaaS Platform.**

### 14.1 Egzekwowanie Reguł
- **Automatyczne**: ESLint, Prettier, testy w CI/CD
- **Code Review**: sprawdzanie zgodności podczas PR
- **Monitoring**: alerty dla naruszeń performance

### 14.2 Aktualizacje
- **Quarterly Review**: przegląd i aktualizacja standardów
- **RFC Process**: propozycje zmian przez GitHub Issues
- **Team Approval**: 2/3 głosów zespołu dla major changes

### 14.3 Kontakt
- **Pytania**: GitHub Issues z labelką `tech-standards`
- **Sugestie**: RFC w folderze `docs/rfc/`
- **Urgent**: Slack channel `#tech-standards`

---

*Dokument utworzony: 2024*  
*Wersja: 1.0*  
*Ostatnia aktualizacja: 2024* 