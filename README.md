# Vibe Coder 🚀

A fun, interactive game about prompt engineering and freelance coding! Build apps for clients, earn money, and upgrade your AI tools.

## 🎮 Game Overview

You're a freelance developer taking on client requests. Build the perfect prompt by selecting blocks (language, framework, features, etc.), stay within the token budget, and deliver quality work to earn money. Upgrade your AI tools to increase your earnings and become the ultimate Vibe Coder!

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
vibe-coder/
├── src/
│   ├── assets/svg/          # Placeholder SVG icons
│   │   ├── logo.svg
│   │   ├── client.svg
│   │   ├── prompt-block.svg
│   │   ├── deploy.svg
│   │   ├── server.svg
│   │   └── ai-tool.svg
│   ├── components/          # React components
│   │   ├── Landing.jsx      # Landing screen
│   │   ├── PlayScreen.jsx   # Main game screen
│   │   ├── Inbox.jsx        # Client requests display
│   │   ├── PromptBuilder.jsx # Block selection interface
│   │   ├── PromptPreview.jsx # Score preview
│   │   ├── DeployButton.jsx  # Deploy action
│   │   ├── DayTimer.jsx     # Day countdown timer
│   │   ├── Upgrades.jsx     # Shop screen
│   │   ├── Leaderboard.jsx  # High scores
│   │   ├── DayEnd.jsx       # End of day summary
│   │   └── HowToPlay.jsx    # Tutorial
│   ├── context/
│   │   └── GameContext.jsx  # Game state management
│   ├── data/
│   │   └── requests.json    # 20 client requests
│   ├── utils/
│   │   └── scoring.js       # Scoring algorithms
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 How to Play

1. **Read the Request** - Check client requirements and keywords
2. **Build Your Prompt** - Select blocks from categories (Language, Framework, Features, etc.)
3. **Watch Your Tokens** - Stay within budget for better payouts
4. **Check the Score** - Preview shows completeness percentage and keyword matches
5. **Deploy & Deliver** - Submit your work and earn money!

### Scoring System

**Completeness Score (0-100%):**
- 60% - Matching required keywords
- 30% - Proper structure (language, framework, features)
- 10% - Token usage efficiency

**Payout Formula:**
```
Base ($50 × difficulty) × Quality Multiplier × Tool Bonus × Token Penalty
```

### Upgrades

- **AI Tools** - CoPilot (+15%), Windsurf (+30%), Cursor AI (+45%)
- **Token Boost** - +20 tokens per purchase (stackable)
- **Fast Deploy** - Reduce deployment time
- **Self-Hosted Servers** - Better profit margins

## 🎨 Customization

### Replace Placeholder Assets

All SVG files in `src/assets/svg/` are placeholders. Replace them with your own PNG or SVG files:

1. Navigate to `src/assets/svg/`
2. Replace files with same names (or update import paths in components)
3. Recommended sizes:
   - `logo.svg` - 64x64px
   - `client.svg` - 48x48px
   - `prompt-block.svg` - 48x48px
   - `deploy.svg` - 48x48px
   - `server.svg` - 48x48px
   - `ai-tool.svg` - 48x48px

### Add More Client Requests

Edit `src/data/requests.json` to add new requests:

```json
{
  "id": "req-XXX",
  "title": "Your App Title",
  "description": "Detailed description...",
  "difficulty": 3,
  "required_keywords": ["keyword1", "keyword2"],
  "tokenBudget": 60
}
```

### Tune Game Balance

Edit constants in `src/utils/scoring.js`:

```javascript
export const GAME_CONSTANTS = {
  BASE_PAYOUT: 50,
  TOOL_BONUS_MULTIPLIER: 0.15,
  DAY_DURATION_MS: 180000, // 3 minutes
  DAY_BONUS_THRESHOLD: 1000,
  // ... more constants
};
```

## 🤖 Integrating Real AI Services

Currently, the game uses local scoring simulation. To integrate real AI:

### Option 1: Replace Scoring Function

In `src/utils/scoring.js`, replace the `scorePrompt()` function:

```javascript
export async function scorePrompt(promptBlocks, request, toolTier, tokenBudget) {
  const promptText = promptBlocks.join(' ');
  
  // Call your AI API
  const response = await fetch('YOUR_AI_API_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: promptText,
      requirements: request.required_keywords,
      maxTokens: tokenBudget
    })
  });
  
  const result = await response.json();
  
  return {
    completeness: result.score,
    tokensUsed: result.tokens,
    // ... other metrics
  };
}
```

### Option 2: Server-Side Evaluation

1. Create a backend API endpoint
2. Send prompt data from `DeployButton.jsx`
3. Return score and payout from server
4. Update game state with results

## 🧪 Testing

The scoring functions are designed to be unit-testable. Example test structure:

```javascript
// src/utils/scoring.test.js
import { scorePrompt, calculatePayout } from './scoring';

test('scores perfect prompt at 100%', () => {
  const blocks = ['Language: TypeScript', 'Framework: React', 'Feature: Auth'];
  const request = {
    required_keywords: ['typescript', 'react', 'auth'],
    tokenBudget: 50
  };
  const result = scorePrompt(blocks, request, 0, 50);
  expect(result.completeness).toBeGreaterThan(90);
});
```

Run tests with:
```bash
npm test
```

## 💾 Data Persistence

Game state is saved to `localStorage`:
- Current game progress
- Money and upgrades
- Leaderboard (top 10 scores)

To reset:
```javascript
localStorage.removeItem('vibeCoderGameState');
localStorage.removeItem('vibeCoderLeaderboard');
```

## 🎨 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **localStorage** - Data persistence

## 📝 Example Playthrough

1. Start game → See 3 client requests in rotation
2. Select request: "Simple To-Do mobile app" (Level 3, 60 tokens)
3. Build prompt:
   - Language: TypeScript
   - Framework: React Native
   - Features: Auth, Offline support, Image upload
   - Integration: Supabase
   - Deliverable: GitHub repo
4. Preview shows: 42 tokens used, 78% completeness
5. Deploy & Deliver → Earn $117
6. Complete more requests before day ends
7. Buy Windsurf upgrade for $1200 to boost future earnings
8. Continue to next day with higher targets

## 🐛 Troubleshooting

**Game won't start:**
- Clear localStorage and refresh
- Check browser console for errors

**Styling issues:**
- Run `npm install` to ensure Tailwind is installed
- Check that PostCSS is configured

**Performance issues:**
- Reduce `DAY_DURATION_MS` for faster testing
- Limit number of requests in rotation

## 📄 License

MIT License - Feel free to modify and use for your own projects!

## 🤝 Contributing

This is a single-player game template. Feel free to:
- Add multiplayer features
- Integrate real AI APIs
- Add more upgrade types
- Create new game modes
- Improve animations and UX

## 🎉 Credits

Created as a demonstration of React + Vite + Tailwind CSS game development.

---

**Have fun coding! 🚀💻**
