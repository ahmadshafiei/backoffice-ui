# Graph Report - backoffice-ui  (2026-11-14)

## Corpus Check
- 74 files · ~17,211 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: .css 13, (none) 1)

## Summary
- 534 nodes · 1128 edges · 43 communities (27 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f1499b7c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- @angular/core
- account-class.ts
- menu.ts
- datepicker.ts
- NotificationApi
- development
- package.json
- FieldBase
- Account class association page
- accounting-api.ts
- detail-class template
- date-pipe.ts
- AccountSettingsPage
- general-accounts template
- group-accounts template
- subsidiary-accounts template
- shell template
- account-form-modal template
- account-class template
- account-settings template
- DetailAccountsPage
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
- Shell
- Account
- shell.ts
- @angular/router
- app.routes.ts
- auth-store.ts
- DetailClassPage
- theme-store.ts
- AccountFormModal
- array.utils.ts

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 48 edges
2. `Account` - 21 edges
3. `FieldBase` - 19 edges
4. `AccountingApi` - 18 edges
5. `Datepicker` - 18 edges
6. `AccountListBase` - 17 edges
7. `Icon` - 17 edges
8. `rxjs` - 17 edges
9. `NotificationApi` - 16 edges
10. `AccountLevel` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Account class associations` --semantically_similar_to--> `Account class association page`  [INFERRED] [semantically similar]
  README.md → prds/DetailClass.MD
- `DetailAccountsPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/detail-accounts/detail-accounts.ts → src/app/shared/components/data-table/data-table.ts
- `DetailClassPage` --references--> `DetailClass`  [EXTRACTED]
  src/app/features/accounting/components/detail-class/detail-class.ts → src/app/features/accounting/models/detail-class.model.ts
- `DetailClassPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/detail-class/detail-class.ts → src/app/shared/components/data-table/data-table.ts
- `GeneralAccounts` --inherits--> `AccountListBase`  [EXTRACTED]
  src/app/features/accounting/pages/general-accounts/general-accounts.ts → src/app/features/accounting/components/accounts/account-list-base.ts

## Import Cycles
- None detected.

## Communities (43 total, 16 thin omitted)

### Community 0 - "@angular/core"
Cohesion: 0.09
Nodes (28): @angular/core, @angular/forms, NotificationKind, Toast, RowEdit, ACCOUNT_LEVEL_LABEL, ACCOUNT_TYPE_LABEL, ACCOUNT_TYPE_OPTIONS (+20 more)

### Community 1 - "account-class.ts"
Cohesion: 0.17
Nodes (4): AccountClassPage, sameSet(), toSet(), toEnDigits()

### Community 2 - "menu.ts"
Cohesion: 0.26
Nodes (6): IconName, ICONS, Menu, MenuGroup, MenuLeaf, without()

### Community 3 - "datepicker.ts"
Cohesion: 0.11
Nodes (22): Datepicker, fromIso(), Host, toIso(), BREAKS, d2g(), d2j(), div() (+14 more)

### Community 4 - "NotificationApi"
Cohesion: 0.11
Nodes (10): @angular/platform-browser@^22.2.0, @angular/platform-browser, App, appConfig, routes, apiInterceptor(), describeHttpError(), NotificationApi (+2 more)

### Community 5 - "development"
Cohesion: 0.05
Nodes (39): build, serve, test, architect, prefix, projectType, root, schematics (+31 more)

### Community 6 - "package.json"
Cohesion: 0.07
Nodes (37): dependencies, @angular/common@^22.2.0, @angular/compiler@^22.2.0, @angular/core@^22.2.0, @angular/forms@^22.2.0, @angular/router@^22.2.0, @fontsource-variable/vazirmatn@^5.3.0, rxjs@~7.8.0 (+29 more)

### Community 8 - "Account class association page"
Cohesion: 0.20
Nodes (10): Account class association page, Account and detail class assignments, Detail class columns, GET /api/v1/account-classes, PUT /api/v1/account-classes, Save changed assignments, Account class associations, Accounting settings (+2 more)

### Community 9 - "accounting-api.ts"
Cohesion: 0.08
Nodes (19): @angular/common, rxjs, AccountingApi, normalizeAccountClasses(), AccountClass, AssignAccountClassRequest, ModifyAccountRequest, RegisterAccountRequest (+11 more)

### Community 10 - "detail-class template"
Cohesion: 0.25
Nodes (8): app-confirm-dialog, app-data-table, app-icon, app-modal, app-page-header, app-select-field, app-text-field, detail-class template

### Community 11 - "date-pipe.ts"
Cohesion: 0.24
Nodes (5): Footer, formatters, JalaliDatePipe, longDate(), longParts

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

### Community 20 - "DetailAccountsPage"
Cohesion: 0.13
Nodes (5): DetailAccountsPage, DetailAccount, ModifyDetailAccountRequest, RegisterDetailAccountRequest, DetailAccountService

### Community 21 - "login template"
Cohesion: 0.67
Nodes (3): app-brand-logo, app-text-field, login template

### Community 22 - "navbar template"
Cohesion: 0.67
Nodes (3): app-brand-logo, app-icon, navbar template

### Community 23 - "data-table template"
Cohesion: 0.67
Nodes (3): app-empty-state, app-icon, data-table template

### Community 33 - "Account"
Cohesion: 0.14
Nodes (4): AccountListBase, Account, AccountLevel, AccountService

### Community 34 - "shell.ts"
Cohesion: 0.17
Nodes (3): LayoutStore, MENU, Navbar

### Community 35 - "@angular/router"
Cohesion: 0.25
Nodes (4): @angular/router, AUTH_ROUTES, Login, BrandLogo

### Community 36 - "app.routes.ts"
Cohesion: 0.27
Nodes (5): menuLabelFor(), ComingSoon, ACCOUNTING_ROUTES, comingSoon(), EmptyState

### Community 37 - "auth-store.ts"
Cohesion: 0.25
Nodes (4): authGuard(), AuthUser, LoginRequest, AuthStore

## Knowledge Gaps
- **60 isolated node(s):** `app-confirm-dialog`, `app-data-table`, `app-icon`, `app-modal`, `app-page-header` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 199 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `shell.ts`, `@angular/router`, `NotificationApi`, `auth-store.ts`, `package.json`, `theme-store.ts`, `app.routes.ts`, `accounting-api.ts`, `datepicker.ts`, `date-pipe.ts`, `menu.ts`?**
  _High betweenness centrality (0.218) - this node is a cross-community bridge._
- **What connects `app-confirm-dialog`, `app-data-table`, `app-icon` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `@angular/core` be split into smaller, more focused modules?**
  _Cohesion score 0.09428794992175274 - nodes in this community are weakly interconnected._
- **Why does `FieldBase` connect `FieldBase` to `@angular/core`, `datepicker.ts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `datepicker.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11074197120708748 - nodes in this community are weakly interconnected._
- **Why does `rxjs` connect `accounting-api.ts` to `@angular/core`, `menu.ts`, `NotificationApi`, `package.json`, `date-pipe.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `NotificationApi` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._