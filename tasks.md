# Tasks

- [x] **1 · List from local JSON** — `PokemonList` and `PokemonCard` render sample Pokémon from `src/data/samplePokemon.json` with `map` and a unique `key`.
      *Done when:* I see the sample cards with picture, number and name, and no warnings in the console.
- [x] **2 · Click shows details** — `selectedId` state lives in `App`; the selected Pokémon goes down to `PokemonDetails` in props.
      *Done when:* clicking a card shows its name and number in the details panel and highlights the card; before a click I see a message.
- [x] **3 · Real list with loading and error** — replace the JSON file with `fetch` inside `useEffect`; `StatusMessage` shows loading and error.
      *Done when:* I see "Loading Pokémon...", then 151 cards; with the network off I see an error (not a white screen), and "Try again" reloads.
- [x] **4 · Details from the API** — `PokemonDetails` fetches `/pokemon/{id}` when the selected id changes, with its own loading and error states.
      *Done when:* picking a Pokémon shows its types, height, weight, abilities and stats; clicking fast between cards never shows the wrong Pokémon.
- [x] **5 · Search** — `SearchBar` component; the search text lives in `App`; the list is filtered by name or number before rendering.
      *Done when:* "char" shows Charmander, Charmeleon and Charizard; "25" shows Pikachu; "xyz" shows "No Pokémon found".
- [x] **6 · Styling and narrow screens** — own CSS, type colors, stat bars; two columns on wide screens, stacked on narrow ones.
      *Done when:* the app looks tidy at 1280px and at 375px with no horizontal scroll.
- [x] **7 · README and tests** — README with what the app does, how to run it and which API; Vitest tests for the helper functions.
      *Done when:* a new person can run the app from the README alone, and `npm test` passes.
- [x] **8 · Upgrade: more features and a new design** — filter by type (`/type/{name}`), sort, favorites saved in `localStorage` (`useFavorites` hook), richer details (`/pokemon-species/{id}`: description, category, habitat; stat total; previous/next; evolution chain from `/evolution-chain/{id}`; shiny toggle), Surprise me, Clear filters, dark mode, skeleton loading, type-colored details, full-screen details on phones. Fixed after testing: fast clicks on the type buttons could leave the list on "loading" forever.
      *Done when:* "Fire" shows only Fire Pokémon; a favorite stays after refresh; the details show the Pokédex text and "← / →" move between Pokémon; clicking an evolution stage opens it; fast clicks on types never get stuck; dark mode stays after refresh; at 375px the details open full screen and × closes them.
- [x] **9 · TypeScript** — move the project to TypeScript: types for the API data and for the props of every component, no `any`, and `npm run build` runs the type check.
      *Done when:* there are no `.js`/`.jsx` files left in `src/`, `npm run build` and `npm test` pass, and the app works exactly as before.
- [x] **10 · React Router** — replace the side panel with real pages: `/items` (list), `/items/:id` (details, the id is read with `useParams`), a navigation menu with `NavLink`, and a 404 page for addresses that do not exist.
      *Done when:* clicking a card changes the address to `/items/25`; refreshing that address shows Pikachu; Back returns to the list with my filters still on; `/items/999` and `/nothing` show the 404 page.
- [x] **11 · Two more pages** — `/favorites` (the Pokémon I saved) and `/compare?a=1&b=25` (two Pokémon side by side, with the higher stat marked).
      *Done when:* a heart I tap shows up on `/favorites` and stays after refresh; on `/compare` choosing two Pokémon shows their stats and the address changes, so refreshing keeps the choice; the compare page has loading and error states.
- [ ] **12 · Tests and documents** — Vitest UI (`npm run test:ui`), tests for the new logic and component tests with React Testing Library, `docs/architecture.md`, an updated README.
      *Done when:* `npm test`, `npm run build` and `npm run lint` pass; `npm run test:ui` opens the tests in the browser; a new person can run the app and its tests from the README alone.
