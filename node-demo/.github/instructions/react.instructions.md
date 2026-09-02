---
applyTo: "apps/web/**/*.{ts,tsx}"
description: "Instructions for React frontend code (no frontend app exists in this repo yet — path is a placeholder, adjust applyTo to the real app directory once one is added)"
---

## General Principles
- Use React functional components with hooks. No class components.
- Use TypeScript strict mode. No `any`. Prefer `unknown` and narrow.
- Keep components small and focused on one responsibility.
- Colocate a component, its styles, and its tests in the same folder.

## Component Structure
- One component per file; file name matches the component name (`PascalCase.tsx`).
- Destructure props in the function signature; type props with an explicit `interface`/`type`, never inline object literals for anything non-trivial.
- Prefer composition (children, render props, slots) over deeply nested prop drilling.
- Extract repeated JSX into subcomponents rather than duplicating markup.
- Keep presentational components free of data-fetching; push fetching to container/page components or hooks.

## Hooks
- Follow the Rules of Hooks — only call hooks at the top level, never conditionally or in loops.
- Extract reusable stateful logic into custom hooks (`useXyz`), not utility functions that call hooks internally without the `use` prefix.
- Always provide complete, correct dependency arrays for `useEffect`/`useMemo`/`useCallback`; do not suppress the exhaustive-deps lint rule.
- Prefer derived state (computed during render) over syncing state with `useEffect`.
- Use `useRef` for values that don't affect rendering; never mutate state directly.

## State Management
- Keep state as local as possible; lift it only as high as the components that need it.
- Use React Query (`useQuery` / `useMutation`) for server state — do not duplicate server data into local `useState`/context.
- Use context only for cross-cutting, rarely-changing state (theme, auth session); avoid it for frequently updated data.
- Invalidate/refetch React Query cache keys explicitly after mutations rather than manually patching cached data, unless optimistic updates are required.

## Data Fetching (React Query)
- Define query keys as typed constants/factories, not inline arrays scattered across components.
- Handle `isLoading`, `isError`, and empty-data states explicitly in the UI — never assume data is present.
- Set sensible `staleTime`/`gcTime` per query instead of relying on defaults for data that rarely changes.
- Put fetch functions in a dedicated `api`/`queries` module, not inline inside components.

## Styling
- Use Tailwind utility classes. No inline `style` props and no separate CSS files for one-off styling.
- Use `clsx`/`cn`-style helpers for conditional class names instead of string concatenation or template literals.
- Follow existing design tokens (spacing, color, typography scale) rather than arbitrary values (`w-[137px]`) unless there is no equivalent token.

## Accessibility
- Always add basic accessibility attributes (`aria-*`, roles) where semantic HTML doesn't already convey them.
- Prefer semantic HTML elements (`button`, `nav`, `label`) over `div`/`span` with click handlers.
- Ensure interactive elements are keyboard-operable and have visible focus states.
- Associate form inputs with labels (`<label htmlFor>` or `aria-labelledby`).

## Forms
- Validate form input with the same schema library used on the backend where the shape overlaps (Zod), not ad hoc manual checks.
- Show field-level error messages next to the relevant input, not only as a global banner.
- Disable submit buttons while a mutation is in flight; show pending state.

## Performance
- Memoize expensive computations with `useMemo` and stable callbacks passed to memoized children with `useCallback` — but don't memoize by default; only when profiling shows a need.
- Use `React.lazy` + `Suspense` for route-level code splitting.
- Avoid creating new object/array/function literals inline as props to memoized children.
- Virtualize long lists instead of rendering hundreds of DOM nodes.

## Error Handling
- Wrap route/page-level trees in error boundaries; don't let a single component crash the whole app.
- Surface mutation/query errors to the user with actionable messaging, not raw error objects or stack traces.

## Testing
- Use `@testing-library/react`. Query by accessible role/label/text, not by test IDs or CSS classes, unless no accessible query is possible.
- Prefer user-event simulation (`@testing-library/user-event`) over firing raw DOM events.
- Test behavior (what the user sees/does), not internal component state or implementation details.

## Code Organization
- Group by feature/domain (`features/orders/`), not by file type (`components/`, `hooks/`, `utils/` split across the whole app).
- Keep API/query definitions, types, and components for a feature together.
- Export a feature's public API from a single `index.ts`; don't reach into another feature's internal files.
