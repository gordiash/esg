# 📋 Reguły Pracy - Projekt ESG SaaS Platform

## 🔄 1. Struktura Iteracji

### Sprint Planning
- **Długość sprintu**: 1 tydzień (zgodnie z harmonogramem PLAN.md)
- **Sprint backlog**: Wszystkie zadania z bieżącego tygodnia fazy (np. T1.1.* w Tygodniu 1)
- **Warunek rozpoczęcia nowego sprintu**: Wszystkie taski poprzedniego sprintu muszą osiągnąć status "Done"

### Nazewnictwo Zadań
- **Format klucza**: `T{Faza}.{Podfaza}.{Numer}`
- **Przykład**: `T2.1.2` (Faza 2, Podfaza 1, Zadanie 2)

---

## 🌿 2. Zarządzanie Kodem

### Struktura Branchy
```
main/
├── dev/
├── feature/T{X}.{Y}.{Z}-{krótki-opis}
├── hotfix/{opis}
└── release/v{X}.{Y}.{Z}
```

**Przykłady nazw branchy:**
- `feature/T2.1.2-jwt-middleware`
- `feature/T4.1.1-emission-factors-db`
- `hotfix/auth-token-validation`

### Konwencje Commitów
**Format**: `{typ}({scope}): {opis} (#T{X}.{Y}.{Z})`

**Przykłady:**
```
feat(auth): dodano weryfikację tokenu JWT (#T2.1.2)
fix(dashboard): naprawiono wyświetlanie metryk ESG (#T3.3.2)
docs(api): zaktualizowano dokumentację endpoints (#T2.3.1)
```

**Typy commitów:**
- `feat`: nowa funkcjonalność
- `fix`: naprawa błędu
- `docs`: dokumentacja
- `style`: formatowanie kodu
- `refactor`: refaktoryzacja
- `test`: testy
- `chore`: zadania maintenance

---

## 🔍 3. Code Review

### Wymagania
- **Minimum 2 approval** przed merge
- **Składy review**: 
  - Backend/DevOps reviewer + Frontend reviewer (dla zmian UI)
  - Lub odwrotnie w zależności od charakteru zmian

### Blokujące Checki
- ✅ ESLint/Prettier (frontend)
- ✅ Testy jednostkowe (≥90% coverage backend, ≥80% frontend)
- ✅ Testy integracyjne
- ✅ SAST (Static Application Security Testing)
- ✅ Audit dependencies

### Proces Review
1. Reviewer wpisuje "LGTM" + uwagi
2. Autor musi odnieść się do każdej uwagi
3. Wszystkie konwersacje muszą być resolved przed merge

---

## ✅ 4. Definition of Done

### Kryteria Zakończenia Zadania
- [ ] Kod zmergowany do `main`/`dev`
- [ ] Wszystkie testy przechodzą
- [ ] Coverage requirements spełnione
- [ ] Dokumentacja zaktualizowana:
  - README modułu
  - Schemat DB (jeśli dotyczy)
  - ADR (Architecture Decision Record) dla decyzji architektonicznych
- [ ] Automatyczny deployment na środowisko dev/staging wykonany

---

## 🚀 5. CI/CD Pipeline

### Workflow
```
Commit → Lint → Unit Tests → Integration Tests → Build → Deploy
```

### Środowiska
- **`dev` branch**: Automatyczny deploy do środowiska dev
- **`main` branch**: Deploy do staging
- **Tag `vX.Y.Z`**: Deploy do produkcji

### Pipeline Stages
1. **Lint**: Code quality check
2. **Test Unit**: Testy jednostkowe
3. **Test Integration**: Testy integracyjne
4. **Build**: Kompilacja aplikacji
5. **Deploy**: Wdrożenie na odpowiednie środowisko

---

## ☁️ 6. Zarządzanie Środowiskami

### AWS Infrastructure (Faza 1.2)
- **IAM**: Zasada "least privilege"
- **Secrets**: AWS Secrets Manager (brak plików `.env` w repo)
- **Monitoring**: CloudWatch + Alerty Slack dla błędów ≥ P2

### Środowiska
- **Development**: Dla daily development
- **Staging**: Pre-production testing
- **Production**: Live environment

---

## 🔐 7. Bezpieczeństwo

### Wymagania
- **Szyfrowanie**: Dane w spoczynku (RDS/S3) i w transporcie (TLS 1.2+)
- **Dependency Audit**: Regularny `npm audit` w CI
- **Penetration Testing**: Po Fazie 6 (Governance) przed startem Fazy 7

### Security Checklist
- [ ] Wszystkie API endpoints wymagają autentykacji
- [ ] Walidacja input data
- [ ] Rate limiting
- [ ] CORS properly configured
- [ ] Sensitive data encrypted

---

## 📚 8. Dokumentacja i Design

### Przed Rozpoczęciem Epiku
- **ADR**: Architecture Decision Record
- **Diagram C4**: Context, Container, Component, Code
- **DB Schema**: Aktualizacja `db/schema.prisma`
- **ER Diagram**: W folderze `docs/`

### Dokumentacja Wymagana
- API Documentation (OpenAPI/Swagger)
- README dla każdego modułu
- Setup instructions
- Deployment guide

---

## 🤝 9. Spotkania i Komunikacja

### Regularne Spotkania
- **Daily Stand-up**: 15 min, codziennie
- **Weekly Sprint Review**: Piątki, demo ukończonych zadań
- **Retrospective**: Po każdej Fazie (7 faz → 7 retros)
- **Architecture Design Session**: Na start każdego dużego modułu (4.x, 5.x, 6.x, 7.x)

### Stand-up Format
1. Co zrobiłem wczoraj?
2. Co planuję dziś?
3. Jakie mam blokery?

---

## 🎯 10. Priorytetyzacja i Zależności

### Blokery Między Fazami
- **Faza 1 (Infrastruktura)**: Musi być w 100% ukończona przed łączeniem kodu innych faz do `main`
- **Faza 2 (Backend)**: Musi wystawić stabilne API (OpenAPI) przed rozpoczęciem Fazy 3
- **Fazy 4,5,6**: Wymagają gotowej autentykacji/autoryzacji (2.1) i panelu podstawowego (3.3)

### Dependency Matrix
```
Faza 1 → Wszystkie inne fazy
Faza 2 → Faza 3, 4, 5, 6, 7
Faza 3 → Faza 4, 5, 6, 7
```

---

## 📊 11. Metryki Jakości

### KPI Zespołu
- **Lead Time for Changes**: ≤ 2 dni
- **Change Failure Rate**: ≤ 5%
- **Deployment Frequency**: Minimum 1x dziennie (dev), 1x tydzień (staging)
- **Mean Time to Recovery**: ≤ 4 godziny

### Code Quality
- **Backend Coverage**: ≥ 90%
- **Frontend Coverage**: ≥ 80%
- **Lint Errors**: 0 (blokujące)
- **Security Vulnerabilities**: 0 high/critical

---

## 🔧 12. Narzędzia i Stack

### Frontend
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library
- **E2E**: Cypress/Playwright (od Fazy 3)

### Backend
- **Linting**: Zależnie od stacku (golangci-lint, pylint, etc.)
- **Testing**: Framework specyficzny dla języka
- **API Documentation**: OpenAPI/Swagger

---

## 📦 13. Zarządzanie Wersjami

### Semantic Versioning (SemVer)
- **Format**: `vMAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes
- **MINOR**: Nowe funkcjonalności (backward compatible)
- **PATCH**: Bug fixes

### Release Process
1. Create release branch: `release/vX.Y.Z`
2. Final testing
3. Tag: `git tag vX.Y.Z`
4. Merge to main
5. Deploy to production
6. Generate release notes (automatic from Conventional Commits)

---

## 🚨 14. Eskalacja i Support

### Priorytety Błędów
- **P1 (Critical)**: Czas reakcji 4h, system down
- **P2 (High)**: Czas reakcji 1 dzień, funkcjonalność nie działa
- **P3 (Medium)**: Czas reakcji 3 dni
- **P4 (Low)**: Czas reakcji 1 tydzień

### Hotfix Process
1. Create branch: `hotfix/{opis}`
2. Fix issue
3. Test thoroughly
4. Merge to `main` AND `dev`
5. Deploy immediately
6. Post-mortem (dla P1)

---

## 🔄 15. Zarządzanie Zmianami

### Odchylenia od Planu
Każda zmiana zakresu zadania musi być:
1. **Zgłoszona**: Przez GitHub Issue
2. **Zaaprobowana**: Tech Lead + Product Owner
3. **Udokumentowana**: Aktualizacja PLAN.md

### Change Request Process
1. Identyfikacja potrzeby zmiany
2. Impact analysis
3. Approval workflow
4. Implementation
5. Verification
6. Documentation update

---

## 📝 16. Compliance i Audyt

### Wymagania Regulacyjne
- Zgodność z GDPR (dane osobowe)
- SOC 2 Type II (security controls)
- ISO 27001 (information security)

### Audit Trail
- Wszystkie zmiany w kodzie (Git history)
- Deployment logs
- Access logs
- Change requests

---

## 🎯 17. Zakończenie

**Te reguły obowiązują wszystkich członków zespołu od chwili publikacji.**

**Pytania i sugestie**: Zgłaszaj przez GitHub Issues z labelką `process-improvement`

**Aktualizacje**: Dokument może być aktualizowany po aprobacie zespołu podczas retrospektyw

---

*Dokument utworzony: {{ current_date }}*  
*Wersja: 1.0*  
*Ostatnia aktualizacja: {{ current_date }}* 