# Snowman v1.5

Kid-friendly word guessing game.

## v1.5 changes
- Removed the Save the Snowman whole-word rescue round.
- Seven incorrect letter guesses now melt the snowman completely and end the game.
- Added a loss result screen showing the word and a New Snowman button.
- Slowed correct-letter, reaction, and disappearing-part animations so young players have more time to connect a guess with what happened.
- Letter input is temporarily locked while feedback animations are playing to prevent overlapping guesses.
- Began the Snowman clue bank: 229 shared-bank words now have custom child-friendly clues, including 182 of 289 four-letter words.
- Continues to use Learn to Readle's `answers.js` as the single source of secret words.

## Files to upload
Upload all five files in this folder to the Snowman repository. Do not add a separate `answers.js`; Snowman loads the shared Learn to Readle answer source.
