# Graph Report - backoffice-ui  (2026-11-22)

## Corpus Check
- 89 files · ~24,759 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: .css 14, (none) 1, .log 1)

## Summary
- 667 nodes · 1433 edges · 53 communities (30 shown, 23 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f428933d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- @angular/core
- notification-api.ts
- journal-edit.ts
- datepicker.ts
- api-interceptor.ts
- development
- package.json
- FieldBase
- Account class association page
- MoneyInputDirective
- detail-class template
- accounting-settings.service.ts
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
- notification.ts
- @angular/router
- array.utils.ts
- account-form-modal.ts
- shell.ts
- @angular/core
- date-pipe.ts
- AccountSettingsPage
- FiscalPeriodPage

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 56 edges
2. `SearchSelect` - 26 edges
3. `Datepicker` - 26 edges
4. `JournalEditPage` - 23 edges
5. `rxjs` - 22 edges
6. `Icon` - 21 edges
7. `Account` - 20 edges
8. `AccountListBase` - 19 edges
9. `FieldBase` - 19 edges
10. `NotificationApi` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Account class associations` --semantically_similar_to--> `Account class association page`  [INFERRED] [semantically similar]
  README.md → prds/DetailClass.MD
- `DetailClassPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/detail-class/detail-class.ts → src/app/shared/components/data-table/data-table.ts
- `FiscalPeriodPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/fiscal-period/fiscal-period.ts → src/app/shared/components/data-table/data-table.ts
- `Account` --references--> `NormalBalance`  [EXTRACTED]
  src/app/features/accounting/models/account.model.ts → src/app/features/accounting/models/normal-balance.model.ts
- `JournalsPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/journals/journals.ts → src/app/shared/components/data-table/data-table.ts

## Import Cycles
- None detected.

## Communities (53 total, 23 thin omitted)

### Community 0 - "@angular/core"
Cohesion: 0.09
Nodes (22): ACCOUNTING_ROUTES, RowEdit, AccountFormModal, setRequired(), AccountListBase, Account, ACCOUNT_TYPE_LABEL, AccountLevel (+14 more)

### Community 1 - "notification-api.ts"
Cohesion: 0.23
Nodes (5): @angular/core, Login, NotificationKind, Toast, TextField

### Community 2 - "journal-edit.ts"
Cohesion: 0.05
Nodes (22): ItemForm, ItemGroup, JournalEditPage, JournalsPage, BRANCH_OPTIONS, Journal, JOURNAL_STATE_LABEL, JOURNAL_TYPE_LABEL (+14 more)

### Community 3 - "datepicker.ts"
Cohesion: 0.09
Nodes (24): Datepicker, fromIso(), Host, toIso(), FloatingPosition, floatingPosition(), BREAKS, d2g() (+16 more)

### Community 4 - "api-interceptor.ts"
Cohesion: 0.27
Nodes (5): @angular/platform-browser@^22.2.0, @angular/platform-browser, appConfig, routes, PageTitleStrategy

### Community 5 - "development"
Cohesion: 0.05
Nodes (39): build, serve, test, architect, prefix, projectType, root, schematics (+31 more)

### Community 6 - "package.json"
Cohesion: 0.07
Nodes (37): dependencies, @angular/common@^22.2.0, @angular/compiler@^22.2.0, @angular/core@^22.2.0, @angular/forms@^22.2.0, @angular/router@^22.2.0, @fontsource-variable/vazirmatn@^5.3.0, rxjs@~7.8.0 (+29 more)

### Community 7 - "FieldBase"
Cohesion: 0.08
Nodes (7): @angular/forms, FieldBase, ToggleField, Host, Item, ITEMS, fieldErrorMessage()

### Community 8 - "Account class association page"
Cohesion: 0.20
Nodes (10): Account class association page, Account and detail class assignments, Detail class columns, GET /api/v1/account-classes, PUT /api/v1/account-classes, Save changed assignments, Account class associations, Accounting settings (+2 more)

### Community 9 - "MoneyInputDirective"
Cohesion: 0.08
Nodes (13): AccountClassPage, sameSet(), toSet(), AccountClass, MoneyInputDirective, Host, toEnDigits(), toFaDigits() (+5 more)

### Community 10 - "detail-class template"
Cohesion: 0.25
Nodes (8): app-confirm-dialog, app-data-table, app-icon, app-modal, app-page-header, app-select-field, app-text-field, detail-class template

### Community 12 - "accounting-settings.service.ts"
Cohesion: 0.31
Nodes (4): AccountingSettings, UpdateAccountingSettingsRequest, AccountingSettingsService, environment

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
Cohesion: 0.24
Nodes (5): AuthUser, LoginRequest, AuthStore, apiInterceptor(), describeHttpError()

### Community 35 - "coming-soon.ts"
Cohesion: 0.21
Nodes (7): EmptyState, IconName, ICONS, Menu, MenuGroup, MenuLeaf, without()

### Community 40 - "@angular/router"
Cohesion: 0.31
Nodes (5): @angular/router, authGuard(), AUTH_ROUTES, menuLabelFor(), ComingSoon

### Community 42 - "account-form-modal.ts"
Cohesion: 0.08
Nodes (20): @angular/common, rxjs, DetailClassPage, AssignAccountClassRequest, ACCOUNT_LEVEL_LABEL, ACCOUNT_TYPE_OPTIONS, AccountType, ModifyAccountRequest (+12 more)

### Community 43 - "shell.ts"
Cohesion: 0.18
Nodes (3): Footer, LayoutStore, MENU

### Community 44 - "@angular/core"
Cohesion: 0.16
Nodes (4): Navbar, Theme, ThemeStore, BrandLogo

### Community 46 - "date-pipe.ts"
Cohesion: 0.33
Nodes (4): formatters, JalaliDatePipe, longDate(), longParts

### Community 48 - "FiscalPeriodPage"
Cohesion: 0.12
Nodes (6): FiscalPeriodPage, rangeValidator(), CreateFiscalPeriodRequest, FiscalPeriod, isValidPeriodRange(), FiscalPeriodService

## Knowledge Gaps
- **60 isolated node(s):** `app-confirm-dialog`, `app-data-table`, `app-icon`, `app-modal`, `app-page-header` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 254 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `notification-api.ts` to `@angular/core`, `navbar.ts`, `journal-edit.ts`, `api-interceptor.ts`, `notification.ts`, `package.json`, `datepicker.ts`, `@angular/router`, `coming-soon.ts`, `account-form-modal.ts`, `shell.ts`, `@angular/core`, `accounting-settings.service.ts`, `FieldBase`, `MoneyInputDirective`, `date-pipe.ts`?**
  _High betweenness centrality (0.183) - this node is a cross-community bridge._
- **What connects `app-confirm-dialog`, `app-data-table`, `app-icon` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `@angular/core` be split into smaller, more focused modules?**
  _Cohesion score 0.08933601609657947 - nodes in this community are weakly interconnected._
- **Why does `SearchSelect` connect `SearchSelect` to `journal-edit.ts`, `datepicker.ts`, `FieldBase`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `journal-edit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0504828797190518 - nodes in this community are weakly interconnected._
- **Why does `Datepicker` connect `datepicker.ts` to `@angular/core`, `journal-edit.ts`, `FieldBase`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `datepicker.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08944793850454227 - nodes in this community are weakly interconnected._