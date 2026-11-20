# Graph Report - backoffice-ui  (2026-11-18)

## Corpus Check
- 80 files · ~20,428 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: .css 14, (none) 1, .log 1)

## Summary
- 609 nodes · 1317 edges · 39 communities (24 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cf40fc52`
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
- FieldBase
- Account class association page
- accounting-api.ts
- detail-class template
- AccountPicker
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
- dependencies
- scripts
- NotificationApi
- @angular/forms
- AccountFormModal
- array.utils.ts

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 52 edges
2. `Datepicker` - 25 edges
3. `Account` - 24 edges
4. `rxjs` - 21 edges
5. `AccountPicker` - 19 edges
6. `Icon` - 19 edges
7. `FieldBase` - 19 edges
8. `AccountingApi` - 18 edges
9. `AccountListBase` - 17 edges
10. `NotificationApi` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Account class associations` --semantically_similar_to--> `Account class association page`  [INFERRED] [semantically similar]
  README.md → prds/DetailClass.MD
- `JournalsPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/journals/journals.ts → src/app/shared/components/data-table/data-table.ts
- `Datepicker` --inherits--> `FieldBase`  [EXTRACTED]
  src/app/shared/components/datepicker/datepicker.ts → src/app/shared/components/fields/field-base.ts
- `DetailAccountsPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/detail-accounts/detail-accounts.ts → src/app/shared/components/data-table/data-table.ts
- `DetailClassPage` --references--> `TableColumn`  [EXTRACTED]
  src/app/features/accounting/components/detail-class/detail-class.ts → src/app/shared/components/data-table/data-table.ts

## Import Cycles
- None detected.

## Communities (39 total, 15 thin omitted)

### Community 0 - "@angular/core"
Cohesion: 0.08
Nodes (31): @angular/core, NotificationKind, Toast, ACCOUNTING_ROUTES, RowEdit, AccountListBase, Account, ACCOUNT_LEVEL_LABEL (+23 more)

### Community 1 - "account-class.ts"
Cohesion: 0.20
Nodes (4): AccountClassPage, sameSet(), toSet(), AccountClass

### Community 2 - "journal-edit.ts"
Cohesion: 0.07
Nodes (15): ItemForm, ItemGroup, JournalEditPage, JournalsPage, BRANCH_OPTIONS, Journal, JOURNAL_STATE_LABEL, JOURNAL_TYPE_LABEL (+7 more)

### Community 3 - "datepicker.ts"
Cohesion: 0.09
Nodes (24): Datepicker, fromIso(), Host, toIso(), FloatingPosition, floatingPosition(), BREAKS, d2g() (+16 more)

### Community 4 - "@angular/router"
Cohesion: 0.05
Nodes (27): @angular/platform-browser@^22.2.0, @angular/platform-browser, @angular/router, App, appConfig, routes, authGuard(), AUTH_ROUTES (+19 more)

### Community 5 - "development"
Cohesion: 0.05
Nodes (39): build, serve, test, architect, prefix, projectType, root, schematics (+31 more)

### Community 6 - "package.json"
Cohesion: 0.14
Nodes (19): devDependencies, @angular/build@^22.2.6, @angular/cli@^22.2.6, @angular/compiler-cli@^22.2.0, jsdom@^30.0.0, prettier@^3.8.1, typescript@~6.0.2, vitest@^5.0.0 (+11 more)

### Community 8 - "Account class association page"
Cohesion: 0.20
Nodes (10): Account class association page, Account and detail class assignments, Detail class columns, GET /api/v1/account-classes, PUT /api/v1/account-classes, Save changed assignments, Account class associations, Accounting settings (+2 more)

### Community 9 - "accounting-api.ts"
Cohesion: 0.05
Nodes (22): @angular/common, rxjs, apiInterceptor(), describeHttpError(), AccountingApi, normalizeAccountClasses(), DetailClassPage, AssignAccountClassRequest (+14 more)

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

### Community 32 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, @angular/common@^22.2.0, @angular/compiler@^22.2.0, @angular/core@^22.2.0, @angular/forms@^22.2.0, @angular/router@^22.2.0, @fontsource-variable/vazirmatn@^5.3.0, rxjs@~7.8.0 (+4 more)

### Community 33 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, ng, start, test, watch

### Community 34 - "NotificationApi"
Cohesion: 0.06
Nodes (10): AuthUser, LoginRequest, AuthStore, Login, LayoutStore, Navbar, Theme, ThemeStore (+2 more)

## Knowledge Gaps
- **60 isolated node(s):** `app-confirm-dialog`, `app-data-table`, `app-icon`, `app-modal`, `app-page-header` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 219 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `dependencies`, `NotificationApi`, `datepicker.ts`, `@angular/router`, `journal-edit.ts`, `package.json`, `@angular/forms`, `accounting-api.ts`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **What connects `app-confirm-dialog`, `app-data-table`, `app-icon` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `@angular/core` be split into smaller, more focused modules?**
  _Cohesion score 0.07784743991640543 - nodes in this community are weakly interconnected._
- **Why does `Datepicker` connect `datepicker.ts` to `journal-edit.ts`, `FieldBase`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `journal-edit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06871035940803383 - nodes in this community are weakly interconnected._
- **Why does `AccountPicker` connect `AccountPicker` to `journal-edit.ts`, `datepicker.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `datepicker.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09143686502177069 - nodes in this community are weakly interconnected._