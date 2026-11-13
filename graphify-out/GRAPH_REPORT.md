# Graph Report - backoffice-ui  (2026-11-13)

## Corpus Check
- Corpus is ~15,745 words - fits in a single context window. You may not need a graph.

## Summary
- 507 nodes · 1041 edges · 32 communities (21 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.89)
- Token cost: unavailable (agent usage was not reported)

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 46 edges
2. `Account` - 21 edges
3. `FieldBase` - 19 edges
4. `AccountingApi` - 18 edges
5. `Datepicker` - 18 edges
6. `AccountListBase` - 17 edges
7. `Icon` - 16 edges
8. `@angular/router` - 15 edges
9. `rxjs` - 15 edges
10. `NotificationApi` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Account class associations` --semantically_similar_to--> `Account class association page`  [INFERRED] [semantically similar]
  README.md → prds/DetailClass.MD
- `AccountListBase` --references--> `AccountLevel`  [EXTRACTED]
  src/app/features/accounting/components/accounts/account-list-base.ts → src/app/features/accounting/models/account.model.ts
- `GeneralAccounts` --inherits--> `AccountListBase`  [EXTRACTED]
  src/app/features/accounting/pages/general-accounts/general-accounts.ts → src/app/features/accounting/components/accounts/account-list-base.ts
- `GroupAccounts` --inherits--> `AccountListBase`  [EXTRACTED]
  src/app/features/accounting/pages/group-accounts/group-accounts.ts → src/app/features/accounting/components/accounts/account-list-base.ts
- `SubsidiaryAccounts` --inherits--> `AccountListBase`  [EXTRACTED]
  src/app/features/accounting/pages/subsidiary-accounts/subsidiary-accounts.ts → src/app/features/accounting/components/accounts/account-list-base.ts

## Import Cycles
- None detected.

## Communities (32 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (29): @angular/core, NotificationKind, Toast, AccountFormModal, setRequired(), Account, ACCOUNT_LEVEL_LABEL, ACCOUNT_TYPE_LABEL (+21 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (21): @angular/common, rxjs, AccountingApi, normalizeAccountClasses(), AccountClassPage, RowEdit, sameSet(), toSet() (+13 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (24): @angular/platform-browser@^22.2.0, @angular/platform-browser, @angular/router, App, appConfig, routes, authGuard(), AUTH_ROUTES (+16 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (24): Datepicker, fromIso(), Host, toIso(), FaNumberPipe, toFaDigits(), BREAKS, d2g() (+16 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (12): AuthUser, LoginRequest, AuthStore, Login, apiInterceptor(), describeHttpError(), LayoutStore, Navbar (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (39): build, serve, test, architect, prefix, projectType, root, schematics (+31 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (37): dependencies, @angular/common@^22.2.0, @angular/compiler@^22.2.0, @angular/core@^22.2.0, @angular/forms@^22.2.0, @angular/router@^22.2.0, @fontsource-variable/vazirmatn@^5.3.0, rxjs@~7.8.0 (+29 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (7): @angular/forms, AccountListBase, FieldBase, TextField, ToggleField, toEnDigits(), fieldErrorMessage()

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (10): Account class association page, Account and detail class assignments, Detail class columns, GET /api/v1/account-classes, PUT /api/v1/account-classes, Save changed assignments, Account class associations, Accounting settings (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (8): app-confirm-dialog, app-data-table, app-icon, app-modal, app-page-header, app-select-field, app-text-field, detail-class template

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (4): formatters, JalaliDatePipe, longDate(), longParts

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (6): app-account-form-modal, app-confirm-dialog, app-data-table, app-icon, app-page-header, general-accounts template

### Community 14 - "Community 14"
Cohesion: 0.33
Nodes (6): app-account-form-modal, app-confirm-dialog, app-data-table, app-icon, app-page-header, group-accounts template

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (6): app-account-form-modal, app-confirm-dialog, app-data-table, app-icon, app-page-header, subsidiary-accounts template

### Community 16 - "Community 16"
Cohesion: 0.40
Nodes (5): app-footer, app-menu, app-navbar, router-outlet, shell template

### Community 17 - "Community 17"
Cohesion: 0.40
Nodes (5): app-modal, app-select-field, app-text-field, app-toggle-field, account-form-modal template

### Community 18 - "Community 18"
Cohesion: 0.50
Nodes (4): app-data-table, app-icon, app-page-header, account-class template

### Community 19 - "Community 19"
Cohesion: 0.50
Nodes (4): app-icon, app-page-header, app-text-field, account-settings template

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (3): app-brand-logo, app-text-field, login template

### Community 22 - "Community 22"
Cohesion: 0.67
Nodes (3): app-brand-logo, app-icon, navbar template

### Community 23 - "Community 23"
Cohesion: 0.67
Nodes (3): app-empty-state, app-icon, data-table template

## Knowledge Gaps
- **60 isolated node(s):** `Graphify project workflow`, `Brokerage back office`, `Authentication stub`, `Accounting settings`, `GET /api/v1/account-classes` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 193 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 6`, `Community 7`, `Community 11`?**
  _High betweenness centrality (0.229) - this node is a cross-community bridge._
- **What connects `Graphify project workflow`, `Brokerage back office`, `Authentication stub` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07614035087719298 - nodes in this community are weakly interconnected._
- **Why does `FieldBase` connect `Community 7` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06277436347673397 - nodes in this community are weakly interconnected._
- **Why does `Datepicker` connect `Community 3` to `Community 7`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06386066763425254 - nodes in this community are weakly interconnected._