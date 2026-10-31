# Pokédex

A master-detail React + TypeScript app for the original 151 Pokémon.
Browse a searchable list, open any Pokémon on its own page, save favorites and compare two Pokémon side by side.

## Pages
| Address | What you can do there |
| --- | --- |
| `/items` | Browse 151 cards; search by name (`char`) or number (`25`, `#025`); filter by type; sort; clear filters; open a random Pokémon with **🎲 Surprise me** |
| `/items/:id` | See one Pokémon (for example `/items/25`): description, category, height, weight, habitat, abilities, stat bars and total, the evolution chain, a **✨ Shiny** button, and links to the previous and next Pokémon |
| `/favorites` | See the Pokémon you saved with the heart, kept in `localStorage` after a refresh |
| `/compare` | Choose two Pokémon and see their stats side by side with the higher one marked; the choice stays in the address (`/compare?a=1&b=25`) |
| anything else | A "Page not found" page with a link back to the list |

Every network call has a loading state and an error state with a "Try again" button. The app has dark mode (🌙 / ☀️ in the header) and works on phones.

## How to run
You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

## How to run the tests

```bash
npm test          # run the Vitest tests once in the terminal
npm run test:ui   # run them in the browser with Vitest UI
```

Other commands:

```bash
npm run lint      # check the code with oxlint
npm run build     # type check with TypeScript, then build into dist/
npm run preview   # serve the built app
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
  main.tsx            starts the app inside BrowserRouter
  App.tsx             the addresses (Routes), and the state that several pages share
  pages/              one component for each address
  components/         the pieces the pages are built from, one per file
  hooks/              usePokemonList, usePokemonDetail, useTypeIds, useFavorites, useTheme
  types/pokemon.ts    types for the API answers and for our own data
  utils/pokemon.ts    logic: search, sort, id validation, compare, API data conversion
  utils/api.ts        fetchJson and error helpers
```
Tests sit next to the file they check, as `*.test.ts` or `*.test.tsx`.

[docs/architecture.md](docs/architecture.md) explains the component tree, where each piece of state lives and why, and what happens from a click to the details.

## Planning files
- `PRD.md` — the product requirements
- `tasks.md` — the task plan
- `PROMPTS.md` — log of prompts sent to the AI agent
- `docs/architecture.md` — the architecture
