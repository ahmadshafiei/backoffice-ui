# Graph Report - backoffice-ui  (2026-11-21)

## Corpus Check
- 81 files · ~21,297 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: .css 14, (none) 1, .log 1)

## Summary
- 612 nodes · 1286 edges · 52 communities (28 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8fb30314`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- @angular/core
- account-class.ts
- journal-edit.ts
- datepicker.ts
- @angular/router
- development
- package.json
- AccountListBase
- Account class association page
- account-form-modal.ts
- detail-class template
- AccountSettingsPage
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
- JournalEditPage
- navbar.ts
- api-interceptor.ts
- shell.ts
- journal.utils.ts
- JournalsPage
- menu.ts
- notification.ts
- array.utils.ts
- DetailClassPage
- LayoutStore
- theme-store.ts
- journal-edit.spec.ts
- NotificationApi
- Login

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 52 edges
2. `SearchSelect` - 26 edges
3. `Datepicker` - 25 edges
4. `JournalEditPage` - 21 edges
5. `Account` - 20 edges
6. `Icon` - 20 edges
7. `rxjs` - 20 edges
8. `AccountListBase` - 19 edges
9. `FieldBase` - 19 edges
10. `@angular/router` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Account class associations` --semantically_similar_to--> `Account class association page`  [INFERRED] [semantically similar]
  README.md → prds/DetailClass.MD
- `JournalsPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/journals/journals.ts → src/app/shared/components/data-table/data-table.ts
- `AccountListBase` --references--> `AccountLevel`  [EXTRACTED]
  src/app/features/accounting/components/accounts/account-list-base.ts → src/app/features/accounting/models/account.model.ts
- `DetailAccounts` --references--> `Account`  [EXTRACTED]
  src/app/features/accounting/pages/detail-accounts/detail-accounts.ts → src/app/features/accounting/models/account.model.ts
- `GeneralAccounts` --references--> `Account`  [EXTRACTED]
  src/app/features/accounting/pages/general-accounts/general-accounts.ts → src/app/features/accounting/models/account.model.ts

## Import Cycles
- None detected.

## Communities (52 total, 24 thin omitted)

### Community 0 - "@angular/core"
Cohesion: 0.11
Nodes (22): @angular/core, ComingSoon, ACCOUNTING_ROUTES, comingSoon(), RowEdit, ACCOUNT_TYPE_LABEL, NORMAL_BALANCE_LABEL, DetailAccounts (+14 more)

### Community 1 - "account-class.ts"
Cohesion: 0.13
Nodes (6): AccountClassPage, sameSet(), toSet(), AccountClass, AssignAccountClassRequest, AccountClassService

### Community 2 - "journal-edit.ts"
Cohesion: 0.16
Nodes (12): ItemForm, ItemGroup, BRANCH_OPTIONS, JOURNAL_STATE_LABEL, JOURNAL_TYPE_LABEL, JOURNAL_TYPE_OPTIONS, JournalItem, JournalState (+4 more)

### Community 3 - "datepicker.ts"
Cohesion: 0.08
Nodes (26): Datepicker, fromIso(), Host, toIso(), formatters, JalaliDatePipe, longDate(), longParts (+18 more)

### Community 4 - "@angular/router"
Cohesion: 0.27
Nodes (5): @angular/router, routes, authGuard(), AUTH_ROUTES, PageTitleStrategy

### Community 5 - "development"
Cohesion: 0.05
Nodes (39): build, serve, test, architect, prefix, projectType, root, schematics (+31 more)

### Community 6 - "package.json"
Cohesion: 0.07
Nodes (37): dependencies, @angular/common@^22.2.0, @angular/compiler@^22.2.0, @angular/core@^22.2.0, @angular/forms@^22.2.0, @angular/router@^22.2.0, @fontsource-variable/vazirmatn@^5.3.0, rxjs@~7.8.0 (+29 more)

### Community 7 - "AccountListBase"
Cohesion: 0.08
Nodes (7): @angular/forms, AccountListBase, FieldBase, TextField, ToggleField, toEnDigits(), fieldErrorMessage()

### Community 8 - "Account class association page"
Cohesion: 0.20
Nodes (10): Account class association page, Account and detail class assignments, Detail class columns, GET /api/v1/account-classes, PUT /api/v1/account-classes, Save changed assignments, Account class associations, Accounting settings (+2 more)

### Community 9 - "account-form-modal.ts"
Cohesion: 0.09
Nodes (21): @angular/common, rxjs, AccountFormModal, setRequired(), Account, ACCOUNT_LEVEL_LABEL, ACCOUNT_TYPE_OPTIONS, AccountLevel (+13 more)

### Community 10 - "detail-class template"
Cohesion: 0.25
Nodes (8): app-confirm-dialog, app-data-table, app-icon, app-modal, app-page-header, app-select-field, app-text-field, detail-class template

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

### Community 32 - "SearchSelect"
Cohesion: 0.08
Nodes (6): SearchSelect, Host, Item, ITEMS, FloatingPosition, floatingPosition()

### Community 34 - "navbar.ts"
Cohesion: 0.23
Nodes (4): AuthUser, LoginRequest, AuthStore, BrandLogo

### Community 35 - "api-interceptor.ts"
Cohesion: 0.24
Nodes (6): apiInterceptor(), describeHttpError(), AccountingSettings, UpdateAccountingSettingsRequest, AccountingSettingsService, environment

### Community 36 - "shell.ts"
Cohesion: 0.17
Nodes (5): Footer, MENU, menuLabelFor(), Navbar, Shell

### Community 37 - "journal.utils.ts"
Cohesion: 0.24
Nodes (7): amountOf(), JOURNAL_VALIDATION_MESSAGES, JournalAmountField, JournalSideRow, oppositeSide(), toNonNegativeAmount(), validateJournalItems()

### Community 39 - "menu.ts"
Cohesion: 0.27
Nodes (6): IconName, ICONS, Menu, MenuGroup, MenuLeaf, without()

### Community 40 - "notification.ts"
Cohesion: 0.22
Nodes (5): @angular/platform-browser@^22.2.0, @angular/platform-browser, App, appConfig, Notification

## Knowledge Gaps
- **60 isolated node(s):** `app-confirm-dialog`, `app-data-table`, `app-icon`, `app-modal`, `app-page-header` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 238 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `SearchSelect`, `navbar.ts`, `api-interceptor.ts`, `@angular/router`, `datepicker.ts`, `package.json`, `shell.ts`, `notification.ts`, `account-form-modal.ts`, `journal-edit.ts`, `LayoutStore`, `theme-store.ts`, `journal-edit.spec.ts`, `AccountListBase`, `menu.ts`?**
  _High betweenness centrality (0.194) - this node is a cross-community bridge._
- **What connects `app-confirm-dialog`, `app-data-table`, `app-icon` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `@angular/core` be split into smaller, more focused modules?**
  _Cohesion score 0.11010284331518451 - nodes in this community are weakly interconnected._
- **Why does `SearchSelect` connect `SearchSelect` to `journal-edit.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `account-class.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Why does `Datepicker` connect `datepicker.ts` to `journal-edit.ts`, `AccountListBase`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `datepicker.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08181818181818182 - nodes in this community are weakly interconnected._