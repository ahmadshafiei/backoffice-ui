# Graph Report - backoffice-ui  (2026-11-21)

## Corpus Check
- 85 files · ~22,809 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: .css 14, (none) 1, .log 1)

## Summary
- 637 nodes · 1369 edges · 51 communities (26 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c7a0f0b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- @angular/core
- Login
- journal-edit.ts
- datepicker.ts
- api-interceptor.ts
- development
- package.json
- FieldBase
- Account class association page
- AccountClassPage
- detail-class template
- notification-api.ts
- general-accounts template
- group-accounts template
- subsidiary-accounts template
- shell template
- account-form-modal template
- account-class template
- account-settings template
- login template
- navbar template
- data-table template
- Farabi Financial Group logo
- app-icon
- app-icon
- app-icon
- environment.development.ts
- app-root
- Graphify project workflow
- Authentication stub
- SearchSelect
- NotificationApi
- navbar.ts
- coming-soon.ts
- Shell
- Navbar
- @angular/router
- array.utils.ts
- DetailClassPage
- LayoutStore
- theme-store.ts
- AccountFormModal
- date-pipe.ts
- rxjs

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 54 edges
2. `SearchSelect` - 26 edges
3. `Datepicker` - 26 edges
4. `rxjs` - 22 edges
5. `JournalEditPage` - 21 edges
6. `Icon` - 21 edges
7. `Account` - 20 edges
8. `AccountListBase` - 19 edges
9. `FieldBase` - 19 edges
10. `NotificationApi` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Account class associations` --semantically_similar_to--> `Account class association page`  [INFERRED] [semantically similar]
  README.md → prds/DetailClass.MD
- `DetailClassPage` --references--> `DetailClass`  [EXTRACTED]
  src/app/features/accounting/components/detail-class/detail-class.ts → src/app/features/accounting/models/detail-class.model.ts
- `DetailClassPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/detail-class/detail-class.ts → src/app/shared/components/data-table/data-table.ts
- `FiscalPeriodPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/fiscal-period/fiscal-period.ts → src/app/shared/components/data-table/data-table.ts
- `CreateDetailClassRequest` --references--> `NormalBalance`  [EXTRACTED]
  src/app/features/accounting/models/detail-class.model.ts → src/app/features/accounting/models/normal-balance.model.ts

## Import Cycles
- None detected.

## Communities (51 total, 25 thin omitted)

### Community 0 - "@angular/core"
Cohesion: 0.09
Nodes (32): @angular/core, ACCOUNTING_ROUTES, RowEdit, AccountListBase, Account, ACCOUNT_LEVEL_LABEL, ACCOUNT_TYPE_LABEL, ACCOUNT_TYPE_OPTIONS (+24 more)

### Community 2 - "journal-edit.ts"
Cohesion: 0.05
Nodes (22): ItemForm, ItemGroup, JournalEditPage, JournalsPage, BRANCH_OPTIONS, Journal, JOURNAL_STATE_LABEL, JOURNAL_TYPE_LABEL (+14 more)

### Community 3 - "datepicker.ts"
Cohesion: 0.09
Nodes (24): Datepicker, fromIso(), Host, toIso(), FloatingPosition, floatingPosition(), BREAKS, d2g() (+16 more)

### Community 4 - "api-interceptor.ts"
Cohesion: 0.22
Nodes (7): @angular/platform-browser@^22.2.0, @angular/platform-browser, appConfig, routes, apiInterceptor(), describeHttpError(), PageTitleStrategy

### Community 5 - "development"
Cohesion: 0.05
Nodes (39): build, serve, test, architect, prefix, projectType, root, schematics (+31 more)

### Community 6 - "package.json"
Cohesion: 0.07
Nodes (36): dependencies, @angular/compiler@^22.2.0, @angular/core@^22.2.0, @angular/forms@^22.2.0, @angular/router@^22.2.0, @fontsource-variable/vazirmatn@^5.3.0, rxjs@~7.8.0, tslib@^2.3.0 (+28 more)

### Community 7 - "FieldBase"
Cohesion: 0.07
Nodes (8): @angular/forms, FieldBase, SelectField, ToggleField, Host, Item, ITEMS, fieldErrorMessage()

### Community 8 - "Account class association page"
Cohesion: 0.20
Nodes (10): Account class association page, Account and detail class assignments, Detail class columns, GET /api/v1/account-classes, PUT /api/v1/account-classes, Save changed assignments, Account class associations, Accounting settings (+2 more)

### Community 9 - "AccountClassPage"
Cohesion: 0.12
Nodes (6): AccountClassPage, sameSet(), toSet(), AccountClass, TextField, toEnDigits()

### Community 10 - "detail-class template"
Cohesion: 0.25
Nodes (8): app-confirm-dialog, app-data-table, app-icon, app-modal, app-page-header, app-select-field, app-text-field, detail-class template

### Community 12 - "notification-api.ts"
Cohesion: 0.22
Nodes (4): App, NotificationKind, Toast, Notification

### Community 13 - "general-accounts template"
Cohesion: 0.33
Nodes (6): app-account-form-modal, app-confirm-dialog, app-data-table, app-icon, app-page-header, general-accounts template

### Community 14 - "group-accounts template"
Cohesion: 0.33
Nodes (6): app-account-form-modal, app-confirm-dialog, app-data-table, app-icon, app-page-header, group-accounts template

### Community 15 - "subsidiary-accounts template"
Cohesion: 0.33
Nodes (6): app-account-form-modal, app-confirm-dialog, app-data-table, app-icon, app-page-header, subsidiary-accounts template

### Community 16 - "shell template"
Cohesion: 0.40
Nodes (5): app-footer, app-menu, app-navbar, router-outlet, shell template

### Community 17 - "account-form-modal template"
Cohesion: 0.40
Nodes (5): app-modal, app-select-field, app-text-field, app-toggle-field, account-form-modal template

### Community 18 - "account-class template"
Cohesion: 0.50
Nodes (4): app-data-table, app-icon, app-page-header, account-class template

### Community 19 - "account-settings template"
Cohesion: 0.50
Nodes (4): app-icon, app-page-header, app-text-field, account-settings template

### Community 21 - "login template"
Cohesion: 0.67
Nodes (3): app-brand-logo, app-text-field, login template

### Community 22 - "navbar template"
Cohesion: 0.67
Nodes (3): app-brand-logo, app-icon, navbar template

### Community 23 - "data-table template"
Cohesion: 0.67
Nodes (3): app-empty-state, app-icon, data-table template

### Community 34 - "navbar.ts"
Cohesion: 0.23
Nodes (4): AuthUser, LoginRequest, AuthStore, BrandLogo

### Community 35 - "coming-soon.ts"
Cohesion: 0.21
Nodes (7): EmptyState, IconName, ICONS, Menu, MenuGroup, MenuLeaf, without()

### Community 40 - "@angular/router"
Cohesion: 0.28
Nodes (6): @angular/router, authGuard(), AUTH_ROUTES, MENU, menuLabelFor(), ComingSoon

### Community 47 - "date-pipe.ts"
Cohesion: 0.24
Nodes (5): Footer, formatters, JalaliDatePipe, longDate(), longParts

### Community 48 - "rxjs"
Cohesion: 0.05
Nodes (20): @angular/common@^22.2.0, @angular/common, rxjs, AccountSettingsPage, FiscalPeriodPage, rangeValidator(), AssignAccountClassRequest, AccountingSettings (+12 more)

## Knowledge Gaps
- **60 isolated node(s):** `app-confirm-dialog`, `app-data-table`, `app-icon`, `app-modal`, `app-page-header` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 240 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `navbar.ts`, `journal-edit.ts`, `api-interceptor.ts`, `datepicker.ts`, `package.json`, `coming-soon.ts`, `@angular/router`, `FieldBase`, `LayoutStore`, `notification-api.ts`, `theme-store.ts`, `date-pipe.ts`, `rxjs`?**
  _High betweenness centrality (0.185) - this node is a cross-community bridge._
- **What connects `app-confirm-dialog`, `app-data-table`, `app-icon` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `@angular/core` be split into smaller, more focused modules?**
  _Cohesion score 0.08590971272229822 - nodes in this community are weakly interconnected._
- **Why does `SearchSelect` connect `SearchSelect` to `journal-edit.ts`, `datepicker.ts`, `FieldBase`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `journal-edit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05174825174825175 - nodes in this community are weakly interconnected._
- **Why does `Datepicker` connect `datepicker.ts` to `@angular/core`, `journal-edit.ts`, `FieldBase`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `datepicker.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09143686502177069 - nodes in this community are weakly interconnected._