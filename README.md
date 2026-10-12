# Pokédex

A master-detail React app for the original 151 Pokémon.
On the left you see a searchable list of cards; click a card and its details appear on the right: artwork, types, height, weight, abilities and base stats.

## Features
- List of 151 Pokémon loaded from the API, each with artwork, number and name
- Click a card (or press Enter on it) to see that Pokémon's details
- Search by name (`char`) or by number (`25`, `#025`)
- Loading and error states for both the list and the details, with a "Try again" button
- Works on wide screens (two columns) and phone screens (stacked)

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
[PokéAPI](https://pokeapi.co/) — free, public, no API key.
- List: `https://pokeapi.co/api/v2/pokemon?limit=151`
- Details: `https://pokeapi.co/api/v2/pokemon/{id}`
- Artwork images come from the PokéAPI sprites repository on GitHub.

## Project structure
```
src/
  App.jsx                  main component: list state, search state, selected id
  components/
    SearchBar.jsx          controlled search input
    PokemonList.jsx        the list, built with map and key
    PokemonCard.jsx        one card in the list
    PokemonDetails.jsx     fetches and shows one Pokémon's details
    StatBar.jsx            one base-stat bar
    StatusMessage.jsx      loading / error message
  utils/
    pokemon.js             helper functions (id from url, formatting, search filter)
    pokemon.test.js        Vitest tests for the helpers
```

## How it works (short)
- `App` keeps the state: the list, the loading status, the search text and the selected id.
- The list is loaded with `fetch` inside `useEffect`; the result decides which of the three states is shown: loading, error or the list.
- The visible list is calculated on every render with `filterPokemon(list, searchText)`, so it is not stored in state.
- Clicking a card calls `onSelect(id)`, which comes down from `App` as a prop and updates `selectedId`.
- `PokemonDetails` gets `key={selectedId}`, so every new pick starts with fresh state, and its effect fetches `/pokemon/{id}`. An `AbortController` cancels the old request when the selection changes.

## Planning files
- `PRD.md` — the product requirements
- `tasks.md` — the task plan
- `PROMPTS.md` — log of prompts sent to the AI agent
