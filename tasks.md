# Tasks

1. **List from local JSON** — `PokemonList` and `PokemonCard` render a few sample Pokémon from `src/data/samplePokemon.json` with `map` and a unique `key`.
   Done when: I see 3 sample cards with picture, number and name, and no warnings in the console.

2. **Click shows details** — `selectedId` state lives in `App`; the selected Pokémon goes down to `PokemonDetails` in props.
   Done when: clicking a card shows its name and number in the details panel and highlights the card.

3. **Real list with loading and error** — replace the JSON file with `fetch` inside `useEffect`; `StatusMessage` shows loading and error.
   Done when: I see "Loading Pokémon...", then 151 cards; with the network off I see the error, and "Try again" reloads.

4. **Details from the API** — `PokemonDetails` fetches `/pokemon/{id}` when the selected id changes, with its own loading and error states; shows types, height, weight, abilities and stats.
   Done when: picking a Pokémon shows its real data; clicking fast between cards never shows data of the wrong Pokémon.

5. **Search** — `SearchBar` component; the search text state lives in `App`; the list is filtered by name or number before rendering.
   Done when: "char" shows Charmander, Charmeleon and Charizard; "25" shows Pikachu; "xyz" shows "No Pokémon found".

6. **Styling and narrow screens** — own CSS, type colors, stat bars, two columns on wide screens and stacked on narrow ones.
   Done when: the app looks tidy at 1280px and at 375px with no horizontal scroll.

7. **README and tests** — README with what, how to run and which API; two Vitest tests for the helper functions.
   Done when: a new person can run the app from the README, and `npm test` passes.
