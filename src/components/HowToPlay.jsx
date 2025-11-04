import { useGame } from '../context/GameContext';

export default function HowToPlay({ onBack }) {
  const { setScreen } = useGame();
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] grid-bg p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="codepen-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-mono">
              {'<HOW_TO_PLAY />'}
            </h1>
            <button
              onClick={() => setScreen('landing')}
              className="wynncraft-btn bg-red-500 text-white border-red-600"
            >
              ← Back
            </button>
          </div>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-purple-400 mb-3 font-mono">🎯 Objective</h2>
            <p className="text-gray-300 leading-relaxed">
              You're a freelance developer building apps for clients. Complete as many requests as possible 
              before the day ends, earn money, and upgrade your tools to become more efficient!
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-purple-400 mb-3 font-mono">🎮 Gameplay</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li><strong>Read the client request</strong> - Big yellow box shows what they want</li>
              <li><strong>Choose your AI model</strong> - Better models = higher quality scores</li>
              <li><strong>Build your prompt</strong> - Select language, framework, project type, features</li>
              <li><strong>Add custom notes</strong> - Each note costs 10 tokens (buy more in shop)</li>
              <li><strong>Watch your tokens</strong> - Stay within budget for better payouts</li>
              <li><strong>Check the score</strong> - Preview shows completeness and matched keywords</li>
              <li><strong>Deploy & Deliver</strong> - Submit and earn money!</li>
            </ol>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-purple-400 mb-3 font-mono">💰 Scoring & Payouts</h2>
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 text-sm text-gray-300">
              <p><strong>Completeness Score (0-100%):</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>60% - Matching required keywords</li>
                <li>30% - Having proper structure (language, framework, features)</li>
                <li>10% - Token usage (penalties for going over budget)</li>
              </ul>
              <p className="mt-3"><strong>Payout Formula:</strong></p>
              <p className="font-mono text-xs bg-gray-900 p-2 rounded text-green-400">
                Base ($50 × difficulty) × Quality × Tool Bonus × Token Penalty
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-purple-400 mb-3 font-mono">🚀 Upgrades & Progression</h2>
            <div className="space-y-3 text-gray-300">
              <div>
                <p className="font-bold text-yellow-400 mb-1">Shop Upgrades:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                  <li><strong>Keywords x3 ($100)</strong> - Reveals missing keywords for 3 deploys (temporary!)</li>
                  <li><strong>Token+ ($100)</strong> - Get +20 tokens per purchase (stackable)</li>
                  <li><strong>Notes+ ($10)</strong> - Add more custom notes (10 tokens each)</li>
                  <li><strong>All Blocks ($500)</strong> - Unlock all prompt blocks immediately</li>
                  <li><strong>AI Tools</strong> - CoPilot ($300), Windsurf ($700), Cursor ($1500)</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-green-400 mb-1">Auto-Unlock Progression:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                  <li><strong>4 requests:</strong> Intermediate blocks unlock (more languages, integrations)</li>
                  <li><strong>12 requests:</strong> Advanced blocks unlock (all features)</li>
                  <li><strong>AI Models unlock:</strong> 8, 18, 30, 45 requests</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-purple-400 mb-3 font-mono">⚠️ Failure System</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-red-400">WARNING:</strong> Submit 3 consecutive prompts with quality below 40% and you'll get GAME OVER! 
              The client will terminate your contract. Always aim for quality!
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-purple-400 mb-3 font-mono">⏰ Time Management</h2>
            <p className="text-gray-300 leading-relaxed">
              Each day lasts 3 real-time minutes. Complete as many requests as possible before time runs out. 
              Meet the daily money target to earn a bonus! You can also extend the day for $300.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-purple-400 mb-3 font-mono">🤖 AI Models</h2>
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 text-sm text-gray-300">
              <ul className="space-y-1">
                <li><strong>GPT-4o Mini</strong> (Start) - 0.95x quality, fast & cheap</li>
                <li><strong>Claude Sonnet 4</strong> (Start) - 1.0x quality, balanced</li>
                <li><strong>GPT-5 Codex</strong> (18 requests) - 1.10x quality, code specialist</li>
                <li><strong>Claude Opus 4.5</strong> (30 requests) - 1.20x quality, maximum quality</li>
                <li><strong>Grok Code</strong> (45 requests) - 1.15x quality, fast & powerful</li>
              </ul>
              <p className="text-yellow-400 mt-2">💡 Better models boost your score!</p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-purple-400 mb-3 font-mono">💡 Pro Tips</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Always select:</strong> Language + Framework + Project Type (required for good structure!)</li>
              <li><strong>Keywords matter:</strong> Match them exactly or use related terms for partial credit</li>
              <li><strong>Notes are expensive:</strong> Each costs 10 tokens - buy Notes+ upgrade for more</li>
              <li><strong>Keyword Reveal is temporary:</strong> Only lasts 3 deploys, buy again when needed</li>
              <li><strong>Unlock blocks naturally:</strong> Or pay $500 to unlock all immediately</li>
              <li><strong>Quality over speed:</strong> 3 bad deploys (&lt; 40%) = GAME OVER!</li>
              <li><strong>Model strategy:</strong> Use better models for harder requests</li>
            </ul>
          </section>
          
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-6 text-center">
            <p className="text-gray-900 text-lg font-bold font-mono">
              Ready to start coding? Good luck! 🎉
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
