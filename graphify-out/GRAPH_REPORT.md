# Graph Report - backoffice-ui  (2026-11-24)

## Corpus Check
- 94 files · ~26,750 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: .css 15, (none) 1, .log 1)

## Summary
- 706 nodes · 1552 edges · 50 communities (25 shown, 25 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `70fce0e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- @angular/core
- JournalEditPage
- journal-edit.ts
- datepicker.ts
- @angular/router
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
- Login
- navbar.ts
- AccountClassPage
- array.utils.ts
- NotificationApi
- AccountSettingsPage
- general-ledger-result.ts

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 59 edges
2. `Datepicker` - 27 edges
3. `SearchSelect` - 26 edges
4. `rxjs` - 25 edges
5. `JournalEditPage` - 23 edges
6. `Icon` - 22 edges
7. `Account` - 20 edges
8. `@angular/router` - 20 edges
9. `AccountListBase` - 19 edges
10. `FieldBase` - 19 edges

## Surprising Connections (you probably didn't know these)
- `Account class associations` --semantically_similar_to--> `Account class association page`  [INFERRED] [semantically similar]
  README.md → prds/DetailClass.MD
- `FiscalPeriodPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/fiscal-period/fiscal-period.ts → src/app/shared/components/data-table/data-table.ts
- `LedgerRow` --inherits--> `GeneralLedgerItem`  [EXTRACTED]
  src/app/features/accounting/components/ledgers/general-ledger/general-ledger-result.ts → src/app/features/accounting/models/general-ledger.model.ts
- `GeneralLedgerResultPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/ledgers/general-ledger/general-ledger-result.ts → src/app/shared/components/data-table/data-table.ts
- `jalaliLabel()` --calls--> `toFaDigits()`  [EXTRACTED]
  src/app/features/accounting/components/ledgers/general-ledger/general-ledger-result.ts → src/app/shared/utils/digits.utils.ts

## Import Cycles
- None detected.

## Communities (50 total, 25 thin omitted)

### Community 0 - "@angular/core"
Cohesion: 0.06
Nodes (40): @angular/core, @angular/forms, NotificationKind, Toast, ACCOUNTING_ROUTES, RowEdit, AccountListBase, Account (+32 more)

### Community 1 - "JournalEditPage"
Cohesion: 0.10
Nodes (8): JournalEditPage, amountOf(), JOURNAL_VALIDATION_MESSAGES, JournalAmountField, JournalSideRow, oppositeSide(), toNonNegativeAmount(), validateJournalItems()

### Community 2 - "journal-edit.ts"
Cohesion: 0.08
Nodes (19): rxjs, ItemForm, ItemGroup, JournalsPage, BRANCH_OPTIONS, Journal, JOURNAL_STATE_LABEL, JOURNAL_TYPE_LABEL (+11 more)

### Community 3 - "datepicker.ts"
Cohesion: 0.07
Nodes (26): jalaliLabel(), Datepicker, fromIso(), toIso(), FieldBase, ToggleField, FloatingPosition, floatingPosition() (+18 more)

### Community 4 - "@angular/router"
Cohesion: 0.06
Nodes (23): @angular/platform-browser@^22.2.0, @angular/platform-browser, @angular/router, App, appConfig, routes, authGuard(), AUTH_ROUTES (+15 more)

### Community 5 - "development"
Cohesion: 0.05
Nodes (39): build, serve, test, architect, prefix, projectType, root, schematics (+31 more)

### Community 6 - "package.json"
Cohesion: 0.07
Nodes (37): dependencies, @angular/common@^22.2.0, @angular/compiler@^22.2.0, @angular/core@^22.2.0, @angular/forms@^22.2.0, @angular/router@^22.2.0, @fontsource-variable/vazirmatn@^5.3.0, rxjs@~7.8.0 (+29 more)

### Community 8 - "Account class association page"
Cohesion: 0.20
Nodes (10): Account class association page, Account and detail class assignments, Detail class columns, GET /api/v1/account-classes, PUT /api/v1/account-classes, Save changed assignments, Account class associations, Accounting settings (+2 more)

### Community 9 - "MoneyInputDirective"
Cohesion: 0.10
Nodes (9): MoneyInputDirective, Host, toEnDigits(), toFaDigits(), DECIMAL_SEPARATOR, formatGroupedNumber(), GROUP_SEPARATOR, parseGroupedNumber() (+1 more)

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
Cohesion: 0.09
Nodes (4): SearchSelect, Host, Item, ITEMS

### Community 34 - "navbar.ts"
Cohesion: 0.08
Nodes (8): AuthUser, LoginRequest, AuthStore, LayoutStore, Navbar, Theme, ThemeStore, BrandLogo

### Community 40 - "AccountClassPage"
Cohesion: 0.20
Nodes (4): AccountClassPage, sameSet(), toSet(), AccountClass

### Community 42 - "NotificationApi"
Cohesion: 0.16
Nodes (7): apiInterceptor(), describeHttpError(), NotificationApi, AccountingSettings, UpdateAccountingSettingsRequest, AccountingSettingsService, environment

### Community 48 - "general-ledger-result.ts"
Cohesion: 0.05
Nodes (20): @angular/common, FiscalPeriodPage, rangeValidator(), GeneralLedgerFilterPage, GeneralLedgerResultPage, LedgerRow, AssignAccountClassRequest, CreateFiscalPeriodRequest (+12 more)

## Knowledge Gaps
- **60 isolated node(s):** `app-confirm-dialog`, `app-data-table`, `app-icon`, `app-modal`, `app-page-header` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 265 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `SearchSelect`, `navbar.ts`, `journal-edit.ts`, `@angular/router`, `datepicker.ts`, `package.json`, `MoneyInputDirective`, `NotificationApi`, `general-ledger-result.ts`?**
  _High betweenness centrality (0.183) - this node is a cross-community bridge._
- **What connects `app-confirm-dialog`, `app-data-table`, `app-icon` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `@angular/core` be split into smaller, more focused modules?**
  _Cohesion score 0.06355296080066722 - nodes in this community are weakly interconnected._
- **Why does `SearchSelect` connect `SearchSelect` to `journal-edit.ts`, `datepicker.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `JournalEditPage` be split into smaller, more focused modules?**
  _Cohesion score 0.10080645161290322 - nodes in this community are weakly interconnected._
- **Why does `Datepicker` connect `datepicker.ts` to `@angular/core`, `journal-edit.ts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `journal-edit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07922705314009662 - nodes in this community are weakly interconnected._