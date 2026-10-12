# PRD — Pokédex

## 1. Pitch
A Pokédex for the original 151 Pokémon: search the list and see any Pokémon's types, abilities and base stats next to it.

## 2. Who it is for
Pokémon fans and players who want to look up a Pokémon quickly, without the noise and slow pages of the big wiki sites.

## 3. Screens
One screen, two parts (master-detail):
- **List** — a card for each Pokémon: artwork, number and name. A search box above the list.
- **Details** — the selected Pokémon: big artwork, number and name, type badges, height, weight, abilities, and a bar for each base stat.

## 4. Must-have features
1. List of the first 151 Pokémon, loaded from the API.
2. Clicking a card shows its details; the selected card is highlighted.
3. Loading and error states (with "Try again") for the list and for the details.
4. Search by name or by number.
5. Works on wide screens (two columns) and on phone screens (stacked).

## 5. Acceptance criteria
- When I open the app, I see "Loading Pokémon..." and then 151 cards with a picture, number and name.
- When the list fails to load, I see an error message and a "Try again" button that loads it again.
- When I click a card, I see that Pokémon's details in the details panel and the card is highlighted.
- When I type "char" or "25" in the search box, I see only matching Pokémon, and "No Pokémon found" if nothing matches.
- When I open the app at phone width, I see the list above the details and nothing overflows sideways.

## 6. Not now
- Filter by type (needs another API call per type).
- Favorites saved in `localStorage`.
- A separate URL for each Pokémon (React Router).
- Pokémon after #151.

## 7. Data
- **API:** `https://pokeapi.co/api/v2/pokemon?limit=151` (list) and `https://pokeapi.co/api/v2/pokemon/{id}` (details). Free, no key.
- **Fields in the list:** `name`, `url` (the id is the number at the end of the url; the artwork image is built from the id).
- **Fields in the details:** `id`, `name`, `types`, `height`, `weight`, `abilities` (with `is_hidden`), `stats`, `sprites.other["official-artwork"]`.
