# Graph Report - backoffice-ui  (2026-11-26)

## Corpus Check
- 94 files · ~27,055 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: .css 15, (none) 1, .log 1)

## Summary
- 710 nodes · 1563 edges · 60 communities (29 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4daf38bb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- @angular/core
- JournalEditPage
- JournalsPage
- datepicker.ts
- menu.ts
- development
- package.json
- DetailClassPage
- Account class association page
- MoneyInputDirective
- detail-class template
- AccountFormModal
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
- @angular/router
- navbar.ts
- general-ledger-result.ts
- FieldBase
- api-interceptor.ts
- shell.ts
- array.utils.ts
- accounting-settings.service.ts
- journal.utils.ts
- journal-edit.spec.ts
- auth-store.ts
- AccountSettingsPage
- general-ledger-result.ts
- app.ts
- app.routes.ts
- NotificationApi
- Shell

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 59 edges
2. `Datepicker` - 27 edges
3. `JournalEditPage` - 26 edges
4. `SearchSelect` - 26 edges
5. `rxjs` - 25 edges
6. `Icon` - 22 edges
7. `Account` - 21 edges
8. `@angular/router` - 20 edges
9. `AccountListBase` - 19 edges
10. `FieldBase` - 19 edges

## Surprising Connections (you probably didn't know these)
- `Account class associations` --semantically_similar_to--> `Account class association page`  [INFERRED] [semantically similar]
  README.md → prds/DetailClass.MD
- `GeneralLedgerResultPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/ledgers/general-ledger/general-ledger-result.ts → src/app/shared/components/data-table/data-table.ts
- `FiscalPeriodPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/fiscal-period/fiscal-period.ts → src/app/shared/components/data-table/data-table.ts
- `DetailClassPage` --references--> `DetailClass`  [EXTRACTED]
  src/app/features/accounting/components/detail-class/detail-class.ts → src/app/features/accounting/models/detail-class.model.ts
- `DetailClassPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/detail-class/detail-class.ts → src/app/shared/components/data-table/data-table.ts

## Import Cycles
- None detected.

## Communities (60 total, 31 thin omitted)

### Community 0 - "@angular/core"
Cohesion: 0.07
Nodes (48): @angular/core, rxjs, NotificationKind, Toast, ACCOUNTING_ROUTES, RowEdit, ItemForm, ItemGroup (+40 more)

### Community 3 - "datepicker.ts"
Cohesion: 0.09
Nodes (24): Datepicker, fromIso(), Host, toIso(), FloatingPosition, floatingPosition(), BREAKS, d2g() (+16 more)

### Community 4 - "menu.ts"
Cohesion: 0.21
Nodes (7): EmptyState, IconName, ICONS, Menu, MenuGroup, MenuLeaf, without()

### Community 5 - "development"
Cohesion: 0.05
Nodes (39): build, serve, test, architect, prefix, projectType, root, schematics (+31 more)

### Community 6 - "package.json"
Cohesion: 0.07
Nodes (36): dependencies, @angular/compiler@^22.2.0, @angular/core@^22.2.0, @angular/forms@^22.2.0, @angular/router@^22.2.0, @fontsource-variable/vazirmatn@^5.3.0, rxjs@~7.8.0, tslib@^2.3.0 (+28 more)

### Community 8 - "Account class association page"
Cohesion: 0.20
Nodes (10): Account class association page, Account and detail class assignments, Detail class columns, GET /api/v1/account-classes, PUT /api/v1/account-classes, Save changed assignments, Account class associations, Accounting settings (+2 more)

### Community 9 - "MoneyInputDirective"
Cohesion: 0.09
Nodes (10): AccountListBase, MoneyInputDirective, Host, toEnDigits(), toFaDigits(), DECIMAL_SEPARATOR, formatGroupedNumber(), GROUP_SEPARATOR (+2 more)

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

### Community 33 - "@angular/router"
Cohesion: 0.33
Nodes (3): @angular/router, AUTH_ROUTES, Login

### Community 34 - "navbar.ts"
Cohesion: 0.16
Nodes (4): Navbar, Theme, ThemeStore, BrandLogo

### Community 36 - "general-ledger-result.ts"
Cohesion: 0.10
Nodes (14): GeneralLedgerFilterPage, GeneralLedgerResultPage, jalaliLabel(), LedgerRow, GeneralLedgerFilters, GeneralLedgerItem, GeneralLedgerSummary, readLedgerFilters() (+6 more)

### Community 37 - "FieldBase"
Cohesion: 0.08
Nodes (7): @angular/forms, FieldBase, ToggleField, Host, Item, ITEMS, fieldErrorMessage()

### Community 38 - "api-interceptor.ts"
Cohesion: 0.19
Nodes (9): @angular/common@^22.2.0, @angular/platform-browser@^22.2.0, @angular/common, @angular/platform-browser, appConfig, routes, apiInterceptor(), describeHttpError() (+1 more)

### Community 40 - "shell.ts"
Cohesion: 0.16
Nodes (3): Footer, LayoutStore, MENU

### Community 42 - "accounting-settings.service.ts"
Cohesion: 0.31
Nodes (4): AccountingSettings, UpdateAccountingSettingsRequest, AccountingSettingsService, environment

### Community 43 - "journal.utils.ts"
Cohesion: 0.22
Nodes (8): amountOf(), JOURNAL_VALIDATION_MESSAGES, JournalAmountField, JournalSideRow, oppositeSide(), RowOptions, toNonNegativeAmount(), validateJournalItems()

### Community 45 - "auth-store.ts"
Cohesion: 0.25
Nodes (4): authGuard(), AuthUser, LoginRequest, AuthStore

### Community 48 - "general-ledger-result.ts"
Cohesion: 0.06
Nodes (13): AccountClassPage, sameSet(), toSet(), FiscalPeriodPage, rangeValidator(), AccountClass, AssignAccountClassRequest, CreateFiscalPeriodRequest (+5 more)

### Community 56 - "app.routes.ts"
Cohesion: 0.48
Nodes (3): labelIn(), menuLabelFor(), ComingSoon

## Knowledge Gaps
- **60 isolated node(s):** `app-confirm-dialog`, `app-data-table`, `app-icon`, `app-modal`, `app-page-header` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 265 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `@angular/router`, `navbar.ts`, `datepicker.ts`, `general-ledger-result.ts`, `menu.ts`, `api-interceptor.ts`, `package.json`, `shell.ts`, `FieldBase`, `accounting-settings.service.ts`, `MoneyInputDirective`, `journal-edit.spec.ts`, `auth-store.ts`, `general-ledger-result.ts`, `app.ts`, `app.routes.ts`?**
  _High betweenness centrality (0.181) - this node is a cross-community bridge._
- **What connects `app-confirm-dialog`, `app-data-table`, `app-icon` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `@angular/core` be split into smaller, more focused modules?**
  _Cohesion score 0.06781326781326781 - nodes in this community are weakly interconnected._
- **Why does `SearchSelect` connect `SearchSelect` to `@angular/core`, `datepicker.ts`, `FieldBase`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `JournalEditPage` be split into smaller, more focused modules?**
  _Cohesion score 0.13852813852813853 - nodes in this community are weakly interconnected._
- **Why does `JournalEditPage` connect `JournalEditPage` to `@angular/core`, `journal.utils.ts`, `journal-edit.spec.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `datepicker.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09143686502177069 - nodes in this community are weakly interconnected._