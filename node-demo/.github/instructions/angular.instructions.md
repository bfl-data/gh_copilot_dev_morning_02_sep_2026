---
applyTo: "apps/admin/**/*.ts"
description: "Instructions for Angular frontend code (no Angular app exists in this repo yet — path is a placeholder, adjust applyTo to the real app directory once one is added)"
---

## General Principles
- Use standalone components, directives, and pipes; avoid `NgModule` for new features.
- Use TypeScript strict mode. No `any`. Prefer `unknown` and narrow.
- Keep components small and focused on one responsibility.
- Colocate a component's template, styles, and tests with its `.ts` file.

## Component Structure
- One component per file; file name matches the component selector (`kebab-case.component.ts`).
- Use `input()` / `output()` signal-based APIs instead of `@Input()` / `@Output()` decorators in new code.
- Type all inputs/outputs explicitly — no `any`.
- Prefer composition (content projection via `ng-content`, host directives) over deep `@Input()` chains.
- Keep presentational (dumb) components free of data-fetching; push fetching to smart/container components or services.

## State & Reactivity
- Prefer the signals API (`signal`, `computed`, `effect`) for local component state over manually managed `RxJS` `Subject`/`BehaviorSubject`.
- Use `computed()` for derived state instead of recalculating in the template or syncing with `effect()`.
- Use `effect()` only for side effects (logging, DOM sync, syncing to non-reactive APIs) — not to derive state.
- Keep state as local as possible; lift it only as high as the components that need it.
- Use RxJS for genuinely async event streams (websockets, debounced input, HTTP with cancellation) where signals don't fit naturally.

## Dependency Injection
- Use `inject()` at field-initializer time instead of constructor injection in new code.
- Scope services with `providedIn: 'root'` unless the service must be instance-per-component/route.
- Avoid injecting services just to reach into their internals; expose a clear public API from the service.

## Data Fetching
- Wrap `HttpClient` calls in dedicated services (`*.service.ts`), never call `HttpClient` directly from components.
- Convert HTTP `Observable`s to signals with `toSignal()` for template consumption instead of using `async` pipe everywhere by default.
- Handle loading, error, and empty states explicitly in the template — never assume data is present.
- Use `HttpInterceptor`s for cross-cutting concerns (auth headers, error normalization, logging), not per-call boilerplate.

## Templates & Control Flow
- Use Angular's built-in control flow (`@if`, `@for`, `@switch`) instead of `*ngIf` / `*ngFor` / `*ngSwitch` structural directives.
- Always provide a `track` expression on `@for` loops — never track by index unless the list is static.
- Keep templates free of complex logic; move it into the component class as a `computed()` or method.

## Styling
- Use Tailwind utility classes. No inline `[style]` bindings and no component-scoped CSS for one-off styling.
- Use `[class.foo]="condition"` or `ngClass`-free conditional Tailwind class helpers instead of string concatenation.
- Follow existing design tokens (spacing, color, typography scale) rather than arbitrary values unless there is no equivalent token.

## Accessibility
- Always add basic accessibility attributes (`aria-*`, roles) where semantic HTML doesn't already convey them.
- Prefer semantic HTML elements (`button`, `nav`, `label`) over `div`/`span` with `(click)` handlers.
- Ensure interactive elements are keyboard-operable and have visible focus states.
- Associate form inputs with labels (`<label for>` or `aria-labelledby`).

## Forms
- Use Reactive Forms (`FormGroup`/`FormControl`) over Template-Driven Forms for anything beyond a trivial single-field form.
- Validate form input with the same schema library used on the backend where the shape overlaps (Zod), bridged via a custom validator, not duplicated ad hoc validators.
- Show field-level error messages next to the relevant control, not only as a global banner.
- Disable submit buttons while a submission is in flight; show pending state.

## Performance
- Use `ChangeDetectionStrategy.OnPush` for all new components.
- Avoid creating new object/array/function literals inline in templates; hoist them to class fields or `computed()`.
- Use `@defer` blocks for route- or view-level code splitting of heavy components.
- Virtualize long lists (`@angular/cdk/scrolling`) instead of rendering hundreds of DOM nodes.

## Error Handling
- Implement an `ErrorHandler` for uncaught errors; don't let a single component crash the whole app.
- Surface HTTP/mutation errors to the user with actionable messaging, not raw error objects or stack traces.

## Testing
- Use `TestBed` with standalone component imports; avoid declaring components in ad hoc `NgModule`s just for tests.
- Query the DOM by accessible role/label/text (via `@testing-library/angular` if available) or `data-testid` as a fallback, not fragile CSS selectors.
- Test behavior (what the user sees/does), not internal component state or private methods.

## Code Organization
- Group by feature/domain (`features/orders/`), not by file type (`components/`, `services/`, `pipes/` split across the whole app).
- Keep a feature's components, services, routes, and types together.
- Export a feature's public API from a single `index.ts`; don't reach into another feature's internal files.
- Use the Angular Router's lazy-loaded routes (`loadComponent`/`loadChildren`) per feature instead of one large eagerly-loaded route table.
