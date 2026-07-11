# Ask & Draw

A browser-based trivia drawing game. Ask any question, get an answer, draw it, and let AI judge your artwork.

## How It Works

1. **Ask** — Type any question (e.g. "What is the tallest building in the world?")
2. **Answer** — Claude AI responds with a short, drawable answer (e.g. "Burj Khalifa")
3. **Draw** — Sketch the answer on a canvas using pen, colors, eraser, and undo tools
4. **Score** — Claude's vision model judges your drawing from 0 to 10 with feedback
5. **Repeat** — Your score accumulates across rounds

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Express server proxying Claude API requests
- **AI:** Claude (via Google Vertex AI) for answering questions and judging drawings with vision

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- Google Cloud credentials with access to Claude on Vertex AI (`gcloud auth application-default login`)

## Installation

```bash
git clone <repo-url>
cd ask-n-draw
npm install
```

## Configuration

The backend uses Claude via Google Vertex AI. Make sure you have:

1. **GCP authentication** set up:
   ```bash
   gcloud auth application-default login
   ```

2. **Environment variable** for your GCP project (defaults to the value in `server/index.js`):
   ```bash
   export ANTHROPIC_VERTEX_PROJECT_ID=your-gcp-project-id
   ```

To use the Anthropic API directly instead of Vertex AI, edit `server/index.js`:
- Replace `import { AnthropicVertex } from '@anthropic-ai/vertex-sdk'` with `import Anthropic from '@anthropic-ai/sdk'`
- Replace `new AnthropicVertex({...})` with `new Anthropic()`
- Set your API key: `export ANTHROPIC_API_KEY=your-key`

## Running

Start both servers in separate terminals:

```bash
# Terminal 1 — backend (port 3001)
npm run server

# Terminal 2 — frontend (port 5173)
npm run dev
```

Open http://localhost:5173 in your browser and start playing.

## Project Structure

```
ask-n-draw/
├── server/
│   └── index.js              # Express backend with /api/answer and /api/judge
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Game state machine
│   ├── index.css             # Styles
│   └── components/
│       ├── QuestionForm.jsx  # Question input
│       ├── AnswerDisplay.jsx # Shows the answer to draw
│       ├── DrawingCanvas.jsx # HTML5 canvas with drawing tools
│       ├── ScoreDisplay.jsx  # Score and feedback display
│       └── GameHeader.jsx    # Title, round counter, total score
├── vite.config.js            # Vite config with /api proxy to backend
└── package.json
```
