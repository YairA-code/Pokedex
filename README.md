# Pokédex

A master-detail React app for the original 151 Pokémon.
Browse a searchable grid of cards, filter by type, save favorites, and click any Pokémon to see its Pokédex entry: artwork, category, types, description, height, weight, habitat, abilities and base stats.

## Features
- **List** of 151 Pokémon loaded from the API, with artwork, number and name
- **Details** on a banner in the Pokémon's type color, with its Pokédex description and category, stat bars and a stat total, the **evolution chain** (click a stage to open it), a **✨ Shiny** button for the rare-color artwork, and **← / →** buttons to move to the previous or next Pokémon
- **Search** by name (`char`) or number (`25`, `#025`)
- **Filter by type** — the colored buttons load the Pokémon of that type from the API
- **Sort** by number or by name, **Clear filters** in one click, and **🎲 Surprise me** to open a random Pokémon from the ones shown
- **Favorites** — tap the heart; favorites are saved in `localStorage`, so they stay after a refresh, and "♥ Favorites" shows only them
- **Loading and error states** everywhere there is a network call: skeleton cards while the list loads, and a "Try again" button on every error
- **Dark mode** — the 🌙 / ☀️ button in the header; follows the system setting at first and remembers your choice
- **Responsive** — two columns on wide screens; on phones the details open full screen (× or Escape closes them)

## How to run
You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

Other commands:

```bash
npm test        # run the Vitest tests
npm run lint    # check the code with oxlint
npm run build   # production build into dist/
```

## API
[PokéAPI](https://pokeapi.co/) — free, public, no API key. Base URL: `https://pokeapi.co/api/v2`

| Endpoint | Used for |
| --- | --- |
| `/pokemon?limit=151` | the list |
| `/pokemon/{id}` | types, height, weight, abilities, stats, artwork |
| `/pokemon-species/{id}` | description, category, habitat, legendary/mythical, link to the evolution chain |
| `/evolution-chain/{id}` | the evolution stages |
| `/type/{name}` | which Pokémon belong to a type |

Artwork images come from the PokéAPI sprites repository on GitHub.

## Project structure
```
src/
  App.jsx                  main component: all list state (list, search, type, sort, favorites, selected id)
  components/
    SearchBar.jsx          controlled search input (in the header)
    TypeFilter.jsx         one button per type
    SortSelect.jsx         sort dropdown
    FavoritesToggle.jsx    "only my favorites" button
    PokemonList.jsx        the list, built with map and key
    PokemonCard.jsx        one card in the list
    FavoriteButton.jsx     the heart button (cards and details)
    PokemonDetails.jsx     fetches and shows one Pokémon's details
    StatBar.jsx            one base-stat bar
    EvolutionChain.jsx     evolution stages with arrows
    ThemeToggle.jsx        light / dark button
    StatusMessage.jsx      loading / error message
    SkeletonList.jsx       placeholder cards while loading
    EmptyDetails.jsx       details panel before anything is chosen
  hooks/
    useFavorites.js        custom hook: favorites state saved in localStorage
    useTheme.js            custom hook: light / dark mode saved in localStorage
  utils/
    pokemon.js             helper functions (id from url, formatting, search, sort, species text, evolution stages)
    pokemon.test.js        Vitest tests for the helpers
```

## How it works (short)
- `App` keeps the state: the list and its loading status, the search text, the selected type, the sort order, the favorites and the selected id.
- The list is loaded with `fetch` inside `useEffect`; the status decides which of the three states is shown: loading, error or the list.
- Choosing a type runs a second `useEffect` that loads `/type/{name}`. The ids are kept in a small cache (`typeResults`), so going back to a type is instant. The type's loading/error status is **calculated** from that cache instead of being stored, so it can never get stuck on "loading".
- The visible list is **calculated on every render** — search, then type, then favorites, then sort — so it is never stored in state and is always up to date.
- Clicking a card calls `onSelect(id)`, which comes down from `App` as a prop and updates `selectedId`.
- `PokemonDetails` gets `key={selectedId}`, so every new pick starts with fresh state. Its effect loads `/pokemon/{id}` and `/pokemon-species/{id}` together with `Promise.all`, then the evolution chain (its URL comes from the species). `getEvolutionStages` walks the chain tree recursively and turns it into stages. An `AbortController` cancels old requests when the selection changes.
- `useFavorites` and `useTheme` read `localStorage` once on start and save again whenever their value changes. Dark mode works by putting `data-theme="dark"` on `<html>`; the CSS gives the same color variables dark values.

## Planning files
- `PRD.md` — the product requirements
- `tasks.md` — the task plan
- `PROMPTS.md` — log of prompts sent to the AI agent
