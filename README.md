## Freashmen learning platform

## Development

- run `npm install` and `npm run dev` for the frontend
- run `cd backend && npm install && npm run dev` for the backend

## Dynamic page titles (pageTitle store)

This project exposes a small UI store to control the top-panel title across pages:

- `src/lib/stores/uiStore.ts` exports `pageTitle` (a writable store), `setPageTitle(t: string)` and `resetPageTitle()`.
- Use `setPageTitle('My Title')` in a page's `onMount` to change the TopPanel title. The layout reads `$pageTitle` and forwards it to the `TopPanel`.

Example:

```ts
import { onMount } from 'svelte';
import { setPageTitle } from '../lib/stores/uiStore';

onMount(() => setPageTitle('Courses'));
```

Call `resetPageTitle()` to return to the default title.

## Auth overlay

- A lightweight auth store lives at `src/lib/stores/auth.ts` exposing `isAuthenticated`, `loginDemo()`, and `logout()`.
- The `AuthOverlay` component dispatches `success` on successful login; pages can show it and react to events.
