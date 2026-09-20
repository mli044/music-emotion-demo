# How Does Emotion Change Music?

**How Does Emotion Change Music?** is an interactive website that explores how different musical choices can make the same melody communicate different emotions.

The project grew from an interest in music therapy and the ways music can communicate feelings, support memory, and connect with people when words are not enough. It is an educational extension of that interest rather than a clinical study or a claim about treatment.

All recordings use original piano melodies. Each melody has a neutral performance and several emotional versions: Anxious, Excited, Happy, and Sad. The performances change combinations of tempo, mode, dynamics, articulation, note density, stability, and tone color. The website calls this combination the music's **Music DNA**.

## What the website does

The website has two main parts:

1. **Demo** — Visitors begin with a neutral recording. They can select an emotion card to hear how the same melody changes and read a summary of the musical choices used to create that feeling.
2. **Quiz** — Visitors listen to recordings and identify the emotion they hear. The Quiz uses three original melodies and randomly selects three emotional versions from each melody, creating nine questions in total. Each question presents four possible emotions.

After the Quiz, the website calculates the score and shows which questions were correct or incorrect. Visitors may submit their anonymous results for later analysis. The collected results can help show which emotions are communicated clearly and which ones are most often confused.

## Files

- `index.html` — Contains the Demo page structure, player, four emotion cards, and link to the Quiz.
- `styles.css` — Controls the Demo page's colors, spacing, layout, card-flip effect, and responsive design.
- `app.js` — Controls Demo card selection, audio playback, volume, and the progress bar.
- `quiz.html` — Contains the Quiz page, question interface, result panel, and Netlify results form.
- `quiz.css` — Controls the Quiz layout, answer cards, audio animation, feedback, and responsive design.
- `quiz.js` — Creates the Quiz questions, randomizes answer choices, plays audio, checks answers, calculates the score, and prepares the submitted data.
- `data/Audio/` — Contains the neutral and emotional WAV recordings used by the Demo and Quiz.
- `README.md` — Introduces the project and explains its file structure.

## How the files work together

The browser opens `index.html` first. This HTML file loads `styles.css` for the visual design and `app.js` for the interactive behavior of the Demo.

When a visitor opens the Quiz, `quiz.html` loads the shared Demo styles, the additional rules in `quiz.css`, and the Quiz behavior in `quiz.js`.

The three technologies have different roles:

1. **HTML** provides the content and structure, including headings, buttons, cards, audio players, and forms.
2. **CSS** finds HTML elements by their tag names, classes, or IDs and controls how they look. It also changes the layout for different screen sizes.
3. **JavaScript** listens for user actions such as clicking a card, playing audio, choosing an answer, or submitting results. It then updates the page through the DOM. The browser automatically applies any CSS rules that match the updated elements.

Audio files are not stored inside the HTML or JavaScript. The code refers to WAV files in `data/Audio/` by their paths. This keeps the page code separate from the recordings and makes it easier to add or replace audio later.

## Implementation details

### Demo interaction

The four emotion cards are written directly in `index.html`. When a visitor chooses a card, `app.js` changes the selected state, turns the card over, resets the previous recording, and loads the matching emotional audio. The recording begins immediately after an emotion is selected. Only one card can remain open at a time.

The main player uses the browser's HTML audio features for play, pause, current time, duration, and volume. JavaScript connects those features to the custom buttons and progress controls shown on the page.

### Quiz generation

The Quiz contains three melody groups: M01, M02, and M03. For each melody, `quiz.js` shuffles the four emotions and selects three of them. This produces three questions per melody and nine questions for the full Quiz.

Only one question is displayed at a time. The four answer choices are shuffled so the correct emotion does not stay in the same position. After an answer is selected, the chosen card shows immediate correct or incorrect feedback before the visitor moves to the next question.

### Results and data collection

At the end of the Quiz, JavaScript calculates the number of correct answers and the overall accuracy. It also prepares question-level information such as the stimulus ID, intended emotion, selected emotion, and whether the response was correct.

The result form uses Netlify Forms. When the deployed website is processed by Netlify, the service detects the form in `quiz.html` and stores submitted results. The results can later be viewed in Netlify or exported as a CSV file for analysis. Submission is optional and anonymous.

### Responsive design

CSS media queries adjust the layout for desktop computers, projectors, tablets, and phones. The cards form a wider grid on large screens and a vertical layout on smaller screens. The mobile card behavior is designed so that only the front or back of a card is visible after it turns over.

## Supported browsers

- Chrome and Edge on Windows
- Chrome on Android
- Safari on iPhone

## Publishing

Access the website through the link below:

[http://cadenzaworks.com](http://cadenzaworks.com)
