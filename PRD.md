# PRD — Pokédex

## 1. Pitch
A Pokédex for the original 151 Pokémon: search the list and see any Pokémon's types, abilities and base stats next to it.

## 2. Who it is for
Pokémon fans and players who want to look up a Pokémon quickly, without the noise and slow pages of the big wiki sites.

## 3. Screens
One screen, two parts (master-detail):
- **List** — a card for each Pokémon: artwork, number, name and a heart. Search in the header; type buttons, favorites and sort above the list.
- **Details** — the selected Pokémon on a banner in its type's color: artwork, number, name, category, type badges, Pokédex description, height, weight, habitat, abilities, base stats with a total, and previous/next buttons.

## 4. Must-have features
1. List of the first 151 Pokémon from the API; clicking a card shows its details.
2. Loading and error states (with "Try again") for the list, the type filter and the details.
3. Search by name or number, filter by type, and sort by number or name.
4. Favorites with a heart, saved in the browser, and a "favorites only" view.
5. Works on wide screens (two columns) and phones (details open full screen).

## 5. Acceptance criteria
- When I open the app, I see "Loading Pokémon..." and then 151 cards with a picture, number and name.
- When the list fails to load, I see an error message and a "Try again" button that loads it again.
- When I click a card, I see that Pokémon's details in the details panel and the card is highlighted.
- When I type "char" or "25" in the search box, I see only matching Pokémon, and "No Pokémon found" if nothing matches.
- When I click "Fire", I see only Fire Pokémon; when I tap a heart and refresh, the Pokémon is still a favorite.
- When I open the app at phone width, I see the list, a tap opens the details full screen, and nothing overflows sideways.

## 6. Not now
- A separate URL for each Pokémon (React Router).
- Pokémon after #151.
- Evolution chains and moves.

## 7. Data
- **API (PokéAPI, free, no key):** `/pokemon?limit=151` (list), `/pokemon/{id}` (details), `/pokemon-species/{id}` (description, category, habitat), `/type/{name}` (Pokémon of one type). Base URL `https://pokeapi.co/api/v2`.
- **Fields in the list:** `name`, `url` (the id is the number at the end of the url; the artwork image is built from the id).
- **Fields in the details:** `id`, `name`, `types`, `height`, `weight`, `abilities` (with `is_hidden`), `stats`, `sprites.other["official-artwork"]`; from the species: `flavor_text_entries`, `genera`, `habitat`, `is_legendary`, `is_mythical`.
