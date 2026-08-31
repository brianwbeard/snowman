# Snowman v1.4

A kid-friendly letter guessing game.

## v1.4 changes
- Uses Learn to Readle's reviewed `answers.js` as the single source of secret words.
- Snowman automatically filters the shared bank to 4–8 letters (1,139 words in LTR v11.3).
- `words.js` now contains only Snowman-specific clue overrides/adaptation logic, not a duplicate secret-word list.
- Existing curated Snowman clues are preserved where available; other shared words currently use a neutral clue fallback.
- QWERTY keyboard keys and spacing are enlarged to be closer to a native phone keyboard for easier kid tapping.

## Shared word source
`index.html` loads `/learn-to-readle/answers.js` before `words.js`. Update the reviewed secret-answer list in Learn to Readle and Snowman will use the updated 4–8-letter subset automatically.
