# How Does Emotion Change Music?

**How Does Emotion Change Music?** is an interactive website that explores how different musical choices can make the same melody communicate different emotions.

The project grew from an interest in music therapy and the ways music can communicate feelings, support memory, and connect with people when words are not enough.

I performed and recorded the piano music used on the website. Each melody has a neutral performance and several emotional versions: Anxious, Excited, Happy, and Sad. The performances change combinations of tempo, mode, dynamics, articulation, note density, stability, and tone color. The website calls this combination the music's **Music DNA**.

## What the website does

The website has two main parts:

1. **Demo** — Visitors begin with a neutral recording. They can select an emotion card to hear how the same melody changes and read a summary of the musical choices used to create that feeling.
2. **Quiz** — Visitors listen to recordings and identify the emotion they hear. The Quiz uses three original melodies that I composed and randomly selects three emotional versions from each melody, creating nine questions in total. Each question presents four possible emotions.

After the Quiz, the website calculates the score and shows which questions were correct or incorrect. Visitors may submit their anonymous results for later analysis. The collected results can help show which emotions are communicated clearly and which ones are most often confused.

## Project structure

- `index.html`, `styles.css`, and `app.js` make up the Demo page: HTML provides the cards and player, CSS controls the layout and appearance, and JavaScript handles card selection and audio playback.
- `quiz.html`, `quiz.css`, and `quiz.js` make up the Quiz. The script selects three emotions at random for each of the three melodies, presents nine questions, scores answers, and allows visitors to submit their anonymous results.
- `data/Audio/` contains the neutral and emotional WAV recordings used by both pages.

The pages use responsive layouts for phones and larger screens. Audio playback and controls use the browser's built-in HTML audio features.

## Supported browsers

- Chrome and Edge on Windows
- Chrome on Android
- Safari on iPhone

## Publishing

Access the website through the link below:

[http://cadenzaworks.com](http://cadenzaworks.com)
