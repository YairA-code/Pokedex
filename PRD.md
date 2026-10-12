# PRD — Pokédex

## For whom
Pokémon fans and players who want to look up the original 151 Pokémon quickly: what they look like, their types, abilities and base stats.

## Why
Big wiki sites are slow and full of noise. This app shows a clean, searchable list, and the details of the Pokémon you pick appear right next to it.

## Data
PokéAPI, public and free, no key needed:
- List: `https://pokeapi.co/api/v2/pokemon?limit=151` (name + url for each Pokémon; the id is the number at the end of the url)
- Details: `https://pokeapi.co/api/v2/pokemon/{id}` (types, abilities, height, weight, stats, artwork)

## Screens
One screen with two parts (master-detail):
1. **List** (left, or top on narrow screens): search box and a grid of cards (artwork + number + name).
2. **Details** (right, or below on narrow screens): big artwork, name and number, type badges, height, weight, abilities, and a bar for each base stat.

## Acceptance lines
- When I open the app, I see "Loading Pokémon..." and then 151 cards with a picture, number and name.
- When the list fails to load, I see an error message and a "Try again" button that loads it again.
- When I click a card, I see that Pokémon's details in the details panel and the card is highlighted.
- When I type "char" or "25" in the search box, I see only matching Pokémon, and "No Pokémon found" if nothing matches.
- When I open the app at phone width, I see the list above the details and nothing overflows sideways.

## Out of scope
Server, database, login, routing, Redux, UI libraries, paid APIs or API keys.
