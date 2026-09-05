# Snowman v1.11

Changes in v1.11:
- Uses the shared Learn to Readle answer bank unchanged; DIED is removed at the shared source (`answers.js`) so the change applies to both games.
- Changes Umami `game_started` so it fires exactly once per round, on the player's first valid letter guess. Loading a round, pressing New Word, or changing word length no longer counts as starting a game.

Changes:
- Returned the ABCDE keyboard to the 7-7-7-5 alphabetical layout.
- Added privacy-first Umami analytics using the same website ID as Learn To Readle, with every Snowman event tagged `game: snowman`.
- Tracks anonymous usage events such as app opens, game starts/completions, settings/progress opens, word-length/clue/keyboard changes, New Word use, and clicks to Learn To Readle. No answer words or guessed letters are sent.
- Updated Snowman’s Privacy page to closely match Learn To Readle’s privacy language.
- Retains clue coverage for the shared 4–8 letter bank; after removing DIED at the shared source, Snowman has 1,138 eligible secret words.
- Retains v1.9 New Word behavior, PWA support, saved settings, reset progress, and win confetti.

Upload every file in this folder to the Snowman repository root.