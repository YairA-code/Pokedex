# PRD — Pokédex

## 1. Pitch
A Pokédex for the original 151 Pokémon: search the list, open any Pokémon on its own page, save favorites and compare two Pokémon side by side.

## 2. Who it is for
Pokémon fans and players who want to look up a Pokémon quickly, without the noise and slow pages of the big wiki sites.

## 3. Pages
Every page has its own address, and the menu in the header moves between them.

| Address | Page | What the user does there |
| --- | --- | --- |
| `/items` | **List** | Sees a card for each Pokémon (artwork, number, name, heart); searches, filters by type, sorts, or opens a random one |
| `/items/:id` | **Details** | Reads the Pokémon's entry on a banner in its type's color: category, types, description, height, weight, habitat, abilities, base stats, evolution chain; toggles shiny; moves to the previous or next Pokémon |
| `/favorites` | **Favorites** | Sees the Pokémon they saved, opens them or removes them |
| `/compare?a=1&b=25` | **Compare** | Chooses two Pokémon and sees their base stats side by side, with the higher one marked |
| anything else | **Not found** | Sees a message and a link back to the list |

## 4. Must-have features
1. List of the first 151 Pokémon from the API; clicking a card opens its own address.
2. Loading and error states (with "Try again") for the list, the type filter, the details and the compare page.
3. Search by name or number, filter by type, sort, clear filters, and "Surprise me" for a random Pokémon.
4. Favorites saved in the browser; the evolution chain and a shiny toggle in the details; dark mode.
5. Compare two Pokémon, with the choice kept in the address.
6. Works on wide screens and on phones.

## 5. Acceptance criteria
- When I open the app, I see "Loading Pokémon..." and then 151 cards with a picture, number and name.
- When the list fails to load, I see an error message and a "Try again" button that loads it again.
- When I click a card, the address changes to `/items/<id>` and I see that Pokémon's details; when I refresh, I still see them.
- When I go back from the details, I see the list with my search and filters still on.
- When I type "char" or "25" in the search box, I see only matching Pokémon, and "No Pokémon found" if nothing matches.
- When I click "Fire", I see only Fire Pokémon.
- When I tap a heart and refresh, the Pokémon is still on the Favorites page.
- When I choose Bulbasaur and Pikachu on the Compare page, I see both sets of stats with the higher value marked, and the address has both ids.
- When I open `/items/999` or `/nothing`, I see the "not found" page with a link back to the list.
- When I open the app at phone width, I see every page without anything overflowing sideways.

## 6. Not now
- Pokémon after #151.
- Moves and where to find each Pokémon.
- Accounts or sync between devices.

## 7. Data
- **API (PokéAPI, free, no key):** `/pokemon?limit=151` (list), `/pokemon/{id}` (details), `/pokemon-species/{id}` (description, category, habitat), `/type/{name}` (Pokémon of one type), `/evolution-chain/{id}` (evolution stages). Base URL `https://pokeapi.co/api/v2`.
- **Fields in the list:** `name`, `url` (the id is the number at the end of the url; the artwork image is built from the id).
- **Fields in the details:** `id`, `name`, `types`, `height`, `weight`, `abilities` (with `is_hidden`), `stats`, `sprites.other["official-artwork"]`; from the species: `flavor_text_entries`, `genera`, `habitat`, `is_legendary`, `is_mythical`.

## 8. More documents
- [Architecture](docs/architecture.md): the components and pages, and how the data flows between them.
