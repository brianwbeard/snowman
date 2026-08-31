# Snowman V1

A kid-friendly, unlimited-play word guessing game. Guess letters before the snowman melts; if he melts completely, you get one final chance to save him by guessing the whole word.

## V1 features

- Unlimited play
- Child-friendly words from 4–10 letters
- Word-length selector
- Clues on/off
- Seven funny snowman melt stages
- Randomized hats, scarves, noses, and buttons
- Correct/incorrect snowman reactions and animations
- Final “Save the Snowman” whole-word guess
- Unique-word progress by word length and overall
- About, Privacy, and math-gated Grown-Ups pages
- Optional Venmo support link
- Local-only progress/settings storage
- Responsive mobile-first design

## Before publishing

Open `app.js` and replace:

```js
const VENMO_URL = 'https://venmo.com/';
```

with the exact Venmo URL you want to use.

## GitHub Pages

Upload `index.html`, `styles.css`, `words.js`, and `app.js` to the root of the repository. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, then save.

## Word bank

The starter word bank lives in `words.js`. Each entry has this format:

```js
{ word: 'SNOWMAN', clue: 'A person-shaped figure made of snow' }
```

Progress totals automatically adjust as words are added or removed.
