# unreleaed
## Fixes
* Fix issue where deck could not be imported

## Features
* Export deck with .json extension

# 0.5.0
## Fixes
* Fix issue where color identity did not update right away (#2)

## Features
* Skip lookup for updating card if card name hasn't changed and there is no error
* Speed up card refetching if scryfall id exists on card object (#16)

# 0.4.1
## Fixes
* Fix issue where search would not be selected when using the `/` or `s` shortcut if commander view was selected

# 0.4.0
## Fixes
* Fix issue with card ids not being set properly
* Fix issue with search errors not being surfaced

## Features
* Display version in footer
* Use `s` shortcut to focus search

# 0.3.1
## Fixes
* Fix issue where cards added via search would corrupt deck
* Fix issue where high generic mana cost (10+) symbols would not appear
* Fix issue where tags could be duplicated

# 0.3.0
## Fixes
* Bump version of scryfall-client to v0.8.0
* Include mechanism to refresh the cards from scryfall when changes are made to the API that require more information from the cards

## Features
* Add automatic paging of search results
* Add keyboard shortcuts
* Move format to main page out of settings
* Display decks color identity based on deck list

# 0.2.0
## Features
* Add ability to/from import/export with TappedOut.net files
* Add tag support
* Move card preview to be inline in card list

# 0.1.0
## Features
* Add import and export buttons in settings modal

# 0.0.0
Initial Version
