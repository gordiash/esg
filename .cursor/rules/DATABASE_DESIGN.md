# 🗄️ Projekt Bazy Danych – ESG SaaS Platform

## 📋 Informacje Ogólne

**Zadanie**: T1.1.3 - Projekt bazy danych  
**Faza**: 1.1 Projekt i Planowanie (Tydzień 1)  
**DBMS**: PostgreSQL 15  
**ORM**: Prisma 5  
**Encoding**: UTF-8  
**Timezone**: UTC  

---

## 🏗️ Architektura Bazy Danych

### Główne Domeny
1. **User Management** - użytkownicy, role, autoryzacja
2. **Company Management** - firmy, multi-tenancy
3. **ESG Metrics** - metryki środowiskowe, społeczne, zarządzania
4. **Reporting** - raporty, szablony, eksport
5. **Audit & Compliance** - logi, zgodność, bezpieczeństwo

### Strategia Partycjonowania
- **Metryki ESG**: partycjonowanie po `company_id` i `period_start`
- **Logi audytu**: partycjonowanie po dacie (`created_at`)
- **Raporty**: archiwizacja po 2 latach

---

## 📊 Model Danych - Prisma Schema

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ===== USER MANAGEMENT =====

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  firstName String   @map("first_name")
  lastName  String   @map("last_name")
  avatar    String?
  isActive  Boolean  @default(true) @map("is_active")
  lastLogin DateTime? @map("last_login")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  userRoles    UserRole[]
  companyUsers CompanyUser[]
  auditLogs    AuditLog[]
  createdReports Report[] @relation("ReportCreator")

  @@map("users")
}

model Role {
  id          String @id @default(cuid())
  name        String @unique
  description String?
  permissions Json   // JSON array of permissions
  isSystem    Boolean @default(false) @map("is_system")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  userRoles UserRole[]

  @@map("roles")
}

model UserRole {
  id     String @id @default(cuid())
  userId String @map("user_id")
  roleId String @map("role_id")
  
  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@unique([userId, roleId])
  @@map("user_roles")
}

// ===== COMPANY MANAGEMENT =====

model Company {
  id          String  @id @default(cuid())
  name        String
  slug        String  @unique
  description String?
  industry    String?
  size        CompanySize?
  website     String?
  logo        String?
  address     Json?   // JSON object with address details
  isActive    Boolean @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  companyUsers CompanyUser[]
  esgMetrics   EsgMetric[]
  reports      Report[]
  goals        EsgGoal[]
  surveys      Survey[]
  policies     Policy[]

  @@map("companies")
}

model CompanyUser {
  id        String @id @default(cuid())
  companyId String @map("company_id")
  userId    String @map("user_id")
  role      CompanyUserRole
  isActive  Boolean @default(true) @map("is_active")
  joinedAt  DateTime @default(now()) @map("joined_at")

  // Relations
  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([companyId, userId])
  @@map("company_users")
}

// ===== ESG METRICS SYSTEM =====

model EsgMetric {
  id          String     @id @default(cuid())
  companyId   String     @map("company_id")
  category    EsgCategory
  metricType  String     @map("metric_type")
  name        String
  description String?
  value       Decimal    @db.Decimal(15, 4)
  unit        String
  periodStart DateTime   @map("period_start")
  periodEnd   DateTime   @map("period_end")
  dataSource  String?    @map("data_source")
  methodology String?
  isVerified  Boolean    @default(false) @map("is_verified")
  verifiedAt  DateTime?  @map("verified_at")
  verifiedBy  String?    @map("verified_by")
  metadata    Json?      // Additional metric-specific data
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  // Relations
  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([companyId])
  @@index([category])
  @@index([metricType])
  @@index([periodStart, periodEnd])
  @@map("esg_metrics")
}

model EsgGoal {
  id          String      @id @default(cuid())
  companyId   String      @map("company_id")
  category    EsgCategory
  name        String
  description String?
  targetValue Decimal     @map("target_value") @db.Decimal(15, 4)
  unit        String
  targetDate  DateTime    @map("target_date")
  status      GoalStatus  @default(ACTIVE)
  progress    Decimal?    @db.Decimal(5, 2) // Percentage 0-100
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  // Relations
  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([companyId])
  @@index([category])
  @@index([status])
  @@map("esg_goals")
}

// ===== ENVIRONMENTAL MODULE =====

model CarbonFootprint {
  id               String   @id @default(cuid())
  companyId        String   @map("company_id")
  scope1Emissions  Decimal  @map("scope1_emissions") @db.Decimal(15, 4)
  scope2Emissions  Decimal  @map("scope2_emissions") @db.Decimal(15, 4)
  scope3Emissions  Decimal? @map("scope3_emissions") @db.Decimal(15, 4)
  totalEmissions   Decimal  @map("total_emissions") @db.Decimal(15, 4)
  unit             String   @default("tCO2e")
  calculationDate  DateTime @map("calculation_date")
  periodStart      DateTime @map("period_start")
  periodEnd        DateTime @map("period_end")
  methodology      String?
  emissionFactors  Json?    @map("emission_factors")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@index([companyId])
  @@index([calculationDate])
  @@map("carbon_footprints")
}

model EnergyConsumption {
  id           String      @id @default(cuid())
  companyId    String      @map("company_id")
  energyType   EnergyType  @map("energy_type")
  consumption  Decimal     @db.Decimal(15, 4)
  unit         String
  cost         Decimal?    @db.Decimal(12, 2)
  currency     String?     @default("USD")
  renewablePercent Decimal? @map("renewable_percent") @db.Decimal(5, 2)
  periodStart  DateTime    @map("period_start")
  periodEnd    DateTime    @map("period_end")
  facility     String?
  createdAt    DateTime    @default(now()) @map("created_at")
  updatedAt    DateTime    @updatedAt @map("updated_at")

  @@index([companyId])
  @@index([energyType])
  @@index([periodStart, periodEnd])
  @@map("energy_consumption")
}

// ===== SOCIAL MODULE =====

model Survey {
  id          String       @id @default(cuid())
  companyId   String       @map("company_id")
  title       String
  description String?
  type        SurveyType
  questions   Json         // JSON array of questions
  isActive    Boolean      @default(true) @map("is_active")
  isAnonymous Boolean      @default(true) @map("is_anonymous")
  startDate   DateTime     @map("start_date")
  endDate     DateTime     @map("end_date")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  // Relations
  company   Company         @relation(fields: [companyId], references: [id], onDelete: Cascade)
  responses SurveyResponse[]

  @@index([companyId])
  @@index([type])
  @@index([isActive])
  @@map("surveys")
}

model SurveyResponse {
  id         String   @id @default(cuid())
  surveyId   String   @map("survey_id")
  respondent String?  // Optional if anonymous
  responses  Json     // JSON object with question_id: answer
  ipAddress  String?  @map("ip_address")
  userAgent  String?  @map("user_agent")
  createdAt  DateTime @default(now()) @map("created_at")

  // Relations
  survey Survey @relation(fields: [surveyId], references: [id], onDelete: Cascade)

  @@index([surveyId])
  @@index([createdAt])
  @@map("survey_responses")
}

model DiversityMetric {
  id          String   @id @default(cuid())
  companyId   String   @map("company_id")
  category    String   // e.g., "gender", "ethnicity", "age"
  subcategory String?  // e.g., "leadership", "board"
  value       Decimal  @db.Decimal(10, 4)
  unit        String   @default("percentage")
  periodStart DateTime @map("period_start")
  periodEnd   DateTime @map("period_end")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([companyId])
  @@index([category])
  @@index([periodStart, periodEnd])
  @@map("diversity_metrics")
}

// ===== GOVERNANCE MODULE =====

model Policy {
  id          String       @id @default(cuid())
  companyId   String       @map("company_id")
  title       String
  description String?
  content     String       // Policy document content
  category    PolicyCategory
  version     String       @default("1.0")
  status      PolicyStatus @default(DRAFT)
  effectiveDate DateTime?  @map("effective_date")
  reviewDate  DateTime?    @map("review_date")
  approvedBy  String?      @map("approved_by")
  approvedAt  DateTime?    @map("approved_at")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  // Relations
  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([companyId])
  @@index([category])
  @@index([status])
  @@map("policies")
}

model ComplianceChecklist {
  id          String            @id @default(cuid())
  companyId   String            @map("company_id")
  framework   String            // e.g., "GRI", "SASB", "TCFD"
  title       String
  description String?
  items       Json              // JSON array of checklist items
  status      ComplianceStatus  @default(PENDING)
  dueDate     DateTime?         @map("due_date")
  completedAt DateTime?         @map("completed_at")
  assignedTo  String?           @map("assigned_to")
  createdAt   DateTime          @default(now()) @map("created_at")
  updatedAt   DateTime          @updatedAt @map("updated_at")

  @@index([companyId])
  @@index([framework])
  @@index([status])
  @@map("compliance_checklists")
}

model RiskRegister {
  id          String     @id @default(cuid())
  companyId   String     @map("company_id")
  title       String
  description String
  category    RiskCategory
  probability RiskLevel
  impact      RiskLevel
  riskScore   Int        @map("risk_score") // Calculated: probability * impact
  mitigation  String?    // Mitigation strategy
  owner       String?    // Risk owner
  status      RiskStatus @default(IDENTIFIED)
  reviewDate  DateTime?  @map("review_date")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  @@index([companyId])
  @@index([category])
  @@index([riskScore])
  @@index([status])
  @@map("risk_register")
}

// ===== REPORTING ENGINE =====

model Report {
  id          String       @id @default(cuid())
  companyId   String       @map("company_id")
  title       String
  description String?
  type        ReportType
  framework   String?      // e.g., "GRI", "SASB", "TCFD"
  periodStart DateTime     @map("period_start")
  periodEnd   DateTime     @map("period_end")
  status      ReportStatus @default(DRAFT)
  content     Json?        // Report structure and data
  fileUrl     String?      @map("file_url")
  createdBy   String       @map("created_by")
  publishedAt DateTime?    @map("published_at")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  // Relations
  company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)
  creator   User    @relation("ReportCreator", fields: [createdBy], references: [id])

  @@index([companyId])
  @@index([type])
  @@index([status])
  @@index([periodStart, periodEnd])
  @@map("reports")
}

model ReportTemplate {
  id          String     @id @default(cuid())
  name        String
  description String?
  framework   String     // e.g., "GRI", "SASB", "TCFD"
  version     String     @default("1.0")
  template    Json       // Template structure
  isActive    Boolean    @default(true) @map("is_active")
  isSystem    Boolean    @default(false) @map("is_system")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  @@index([framework])
  @@index([isActive])
  @@map("report_templates")
}

// ===== AUDIT & COMPLIANCE =====

model AuditLog {
  id         String    @id @default(cuid())
  userId     String?   @map("user_id")
  companyId  String?   @map("company_id")
  action     String    // e.g., "CREATE", "UPDATE", "DELETE"
  resource   String    // e.g., "esg_metric", "report"
  resourceId String?   @map("resource_id")
  oldValues  Json?     @map("old_values")
  newValues  Json?     @map("new_values")
  ipAddress  String?   @map("ip_address")
  userAgent  String?   @map("user_agent")
  createdAt  DateTime  @default(now()) @map("created_at")

  // Relations
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([companyId])
  @@index([action])
  @@index([resource])
  @@index([createdAt])
  @@map("audit_logs")
}

// ===== ENUMS =====

enum CompanySize {
  STARTUP
  SMALL
  MEDIUM
  LARGE
  ENTERPRISE
}

enum CompanyUserRole {
  OWNER
  ADMIN
  MANAGER
  EMPLOYEE
  VIEWER
}

enum EsgCategory {
  ENVIRONMENTAL
  SOCIAL
  GOVERNANCE
}

enum GoalStatus {
  ACTIVE
  COMPLETED
  PAUSED
  CANCELLED
}

enum EnergyType {
  ELECTRICITY
  NATURAL_GAS
  DIESEL
  GASOLINE
  RENEWABLE
  SOLAR
  WIND
  HYDRO
  OTHER
}

enum SurveyType {
  EMPLOYEE_SATISFACTION
  DIVERSITY_INCLUSION
  SAFETY_CULTURE
  ETHICS_COMPLIANCE
  CUSTOM
}

enum PolicyCategory {
  ENVIRONMENTAL
  SOCIAL
  GOVERNANCE
  ETHICS
  COMPLIANCE
  SAFETY
  OTHER
}

enum PolicyStatus {
  DRAFT
  REVIEW
  APPROVED
  ACTIVE
  ARCHIVED
}

enum ComplianceStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  OVERDUE
  NOT_APPLICABLE
}

enum RiskCategory {
  ENVIRONMENTAL
  SOCIAL
  GOVERNANCE
  OPERATIONAL
  FINANCIAL
  REGULATORY
  REPUTATIONAL
  STRATEGIC
}

enum RiskLevel {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum RiskStatus {
  IDENTIFIED
  ASSESSED
  MITIGATED
  MONITORED
  CLOSED
}

enum ReportType {
  SUSTAINABILITY
  ESG_SCORECARD
  CARBON_FOOTPRINT
  DIVERSITY_INCLUSION
  GOVERNANCE
  COMPLIANCE
  CUSTOM
}

enum ReportStatus {
  DRAFT
  REVIEW
  APPROVED
  PUBLISHED
  ARCHIVED
}
```

---

## 🔍 Indeksy i Optymalizacja

### Kluczowe Indeksy
```sql
-- Performance indexes
CREATE INDEX CONCURRENTLY idx_esg_metrics_company_period ON esg_metrics(company_id, period_start, period_end);
CREATE INDEX CONCURRENTLY idx_esg_metrics_category_type ON esg_metrics(category, metric_type);
CREATE INDEX CONCURRENTLY idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX CONCURRENTLY idx_reports_company_status ON reports(company_id, status);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_carbon_footprint_company_date ON carbon_footprints(company_id, calculation_date DESC);
CREATE INDEX CONCURRENTLY idx_energy_consumption_company_type_period ON energy_consumption(company_id, energy_type, period_start, period_end);
CREATE INDEX CONCURRENTLY idx_survey_responses_survey_created ON survey_responses(survey_id, created_at DESC);
```

### Partycjonowanie
```sql
-- Partition audit_logs by month
CREATE TABLE audit_logs_y2024m01 PARTITION OF audit_logs
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Partition esg_metrics by company_id hash
CREATE TABLE esg_metrics_part_0 PARTITION OF esg_metrics
FOR VALUES WITH (modulus 4, remainder 0);
```

---

## 🚀 Migracje i Seeding

### Przykład Migracji
```sql
-- 20241201_000001_create_initial_schema.sql
BEGIN;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create initial tables (generated by Prisma)
-- ... (tables created by prisma migrate)

-- Create custom functions
CREATE OR REPLACE FUNCTION calculate_risk_score(probability integer, impact integer)
RETURNS integer AS $$
BEGIN
    RETURN probability * impact;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

### Seed Data
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create system roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'SYSTEM_ADMIN',
      description: 'System administrator with full access',
      permissions: ['*'],
      isSystem: true,
    },
  });

  const companyAdminRole = await prisma.role.create({
    data: {
      name: 'COMPANY_ADMIN',
      description: 'Company administrator',
      permissions: ['company:*', 'metrics:*', 'reports:*'],
      isSystem: true,
    },
  });

  // Create report templates
  await prisma.reportTemplate.createMany({
    data: [
      {
        name: 'GRI Standards Report',
        framework: 'GRI',
        version: '2021',
        template: {
          sections: [
            { id: 'organizational_profile', title: 'Organizational Profile' },
            { id: 'strategy', title: 'Strategy' },
            { id: 'ethics_integrity', title: 'Ethics and Integrity' },
            { id: 'governance', title: 'Governance' },
          ],
        },
        isSystem: true,
      },
      {
        name: 'SASB Standards Report',
        framework: 'SASB',
        version: '2023',
        template: {
          sections: [
            { id: 'industry_metrics', title: 'Industry-Specific Metrics' },
            { id: 'accounting_metrics', title: 'Accounting Metrics' },
          ],
        },
        isSystem: true,
      },
    ],
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 🔐 Bezpieczeństwo Bazy Danych

### Row Level Security (RLS)
```sql
-- Enable RLS on sensitive tables
ALTER TABLE esg_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY company_isolation_esg_metrics ON esg_metrics
USING (company_id = current_setting('app.current_company_id'));

CREATE POLICY company_isolation_reports ON reports
USING (company_id = current_setting('app.current_company_id'));
```

### Szyfrowanie Danych
```sql
-- Encrypt sensitive fields
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Example: Encrypt survey responses
ALTER TABLE survey_responses 
ADD COLUMN encrypted_responses bytea;

-- Function to encrypt/decrypt
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data text)
RETURNS bytea AS $$
BEGIN
    RETURN pgp_sym_encrypt(data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 Monitoring i Maintenance

### Monitoring Queries
```sql
-- Monitor table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor slow queries
SELECT 
    query,
    mean_exec_time,
    calls,
    total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Monitor index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Backup Strategy
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/esg_platform"
DB_NAME="esg_platform_prod"

# Create backup
pg_dump -h localhost -U postgres -d $DB_NAME \
    --format=custom \
    --compress=9 \
    --file="$BACKUP_DIR/backup_$DATE.dump"

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "backup_*.dump" -mtime +30 -delete
```

---

## 🎯 Metryki i KPI

### Database Performance KPIs
- **Query Response Time**: < 100ms (95th percentile)
- **Connection Pool Usage**: < 80%
- **Index Hit Ratio**: > 99%
- **Buffer Hit Ratio**: > 95%
- **Deadlock Rate**: < 1 per hour

### Monitoring Dashboard
```sql
-- Key metrics for monitoring
SELECT 
    'active_connections' as metric,
    count(*) as value
FROM pg_stat_activity
WHERE state = 'active'

UNION ALL

SELECT 
    'database_size' as metric,
    pg_database_size(current_database()) as value

UNION ALL

SELECT 
    'cache_hit_ratio' as metric,
    round(
        (sum(blks_hit) * 100.0 / sum(blks_hit + blks_read))::numeric, 2
    ) as value
FROM pg_stat_database;
```

---

## 📝 Dokumentacja API

### Przykład Entity Model
```typescript
// src/modules/esg-metrics/entities/esg-metric.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { EsgCategory } from '@prisma/client';

export class EsgMetric {
  @ApiProperty({ example: 'clp123abc456' })
  id: string;

  @ApiProperty({ example: 'clp123company' })
  companyId: string;

  @ApiProperty({ enum: EsgCategory })
  category: EsgCategory;

  @ApiProperty({ example: 'carbon_emissions' })
  metricType: string;

  @ApiProperty({ example: 'Total Carbon Emissions' })
  name: string;

  @ApiProperty({ example: 1234.56 })
  value: number;

  @ApiProperty({ example: 'tCO2e' })
  unit: string;

  @ApiProperty()
  periodStart: Date;

  @ApiProperty()
  periodEnd: Date;

  @ApiProperty({ required: false })
  isVerified?: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
```

---

## 🔄 Deployment i Versioning

### Database Versioning
```json
{
  "version": "1.0.0",
  "description": "Initial ESG Platform database schema",
  "migrations": [
    "20241201_000001_create_initial_schema",
    "20241201_000002_add_indexes",
    "20241201_000003_create_functions"
  ],
  "rollback": [
    "20241201_000003_drop_functions",
    "20241201_000002_drop_indexes", 
    "20241201_000001_drop_initial_schema"
  ]
}
```

### Environment Configuration
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/esg_platform_dev"
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=30000

# Encryption
ENCRYPTION_KEY="your-encryption-key-here"

# Monitoring
ENABLE_QUERY_LOGGING=true
SLOW_QUERY_THRESHOLD=1000
```

---

## 🎯 Zakończenie

Ten projekt bazy danych zapewnia:

✅ **Skalowalne rozwiązanie** dla wszystkich modułów ESG  
✅ **Bezpieczeństwo danych** z RLS i szyfrowaniem  
✅ **Wydajność** dzięki indeksom i partycjonowaniu  
✅ **Audytowalność** pełnych logów zmian  
✅ **Zgodność** z standardami ESG (GRI, SASB, TCFD)  
✅ **Multi-tenancy** dla wielu firm  
✅ **Rozszerzalność** dla przyszłych wymagań  

**Status**: Gotowy do implementacji w Fazie 1.3  
**Następny krok**: T1.3.3 - Konfiguracja bazy danych 