import { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { scorePrompt, getKeywordFeedback } from '../utils/scoring';

export default function PromptPreview({ selectedBlocks }) {
  const { getCurrentRequest, gameState } = useGame();
  const request = getCurrentRequest();
  
  const score = useMemo(() => {
    if (!request) return null;
    const tokenBudget = request.tokenBudget + (gameState.upgrades.extraTokens || 0);
    return scorePrompt(selectedBlocks, request, gameState.toolTier, tokenBudget, gameState.selectedModel);
  }, [selectedBlocks, request, gameState.toolTier, gameState.upgrades.extraTokens, gameState.selectedModel]);
  
  const keywordFeedback = useMemo(() => {
    if (!request) return null;
    return getKeywordFeedback(selectedBlocks, request.required_keywords);
  }, [selectedBlocks, request]);
  
  const promptText = selectedBlocks.join(' • ');
  
  const getScoreColor = (completeness) => {
    if (completeness >= 80) return 'text-green-400';
    if (completeness >= 60) return 'text-yellow-400';
    if (completeness >= 40) return 'text-orange-400';
    return 'text-red-400';
  };
  
  const getScoreBg = (completeness) => {
    if (completeness >= 80) return 'bg-green-500/10 border-green-500/30';
    if (completeness >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
    if (completeness >= 40) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };
  
  if (!request || !score) return null;
  
  const tokenBudget = request.tokenBudget + (gameState.upgrades.extraTokens || 0);
  const isOverBudget = score.tokensUsed > tokenBudget;
  
  return (
    <div className="codepen-card p-4">
      <h2 className="text-lg font-bold text-green-400 mb-3 font-mono">{'<SCORE_PREVIEW />'}</h2>
      
      <div className="space-y-3">
        {/* Completeness Score - Move to top */}
        <div className={`rounded-lg p-3 border-2 ${getScoreBg(score.completeness)} transition-all`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-300 font-mono">Score:</span>
            <span className={`text-2xl font-bold transition-all duration-300 ${getScoreColor(score.completeness)} ${
              score.completeness >= 90 ? 'animate-bounce-in' :
              score.completeness >= 75 ? 'animate-wiggle' :
              score.completeness < 40 ? 'animate-shake' : ''
            }`}>
              {score.completeness}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                score.completeness >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                score.completeness >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                score.completeness >= 40 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
              style={{ width: `${score.completeness}%` }}
            />
          </div>
        </div>
        
        {/* Token Usage */}
        <div className={`rounded-lg p-3 border-2 transition-all ${isOverBudget ? 'bg-red-500/10 border-red-500 animate-pulse' : 'bg-blue-500/10 border-blue-500/30'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-300 font-mono">Tokens:</span>
            <span className={`text-sm font-bold ${isOverBudget ? 'text-red-400' : 'text-blue-400'}`}>
              {score.tokensUsed} / {tokenBudget}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${isOverBudget ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}
              style={{ width: `${Math.min((score.tokensUsed / tokenBudget) * 100, 100)}%` }}
            />
          </div>
          {isOverBudget && (
            <p className="text-xs text-red-400 mt-1 font-mono">⚠️ OVER BUDGET</p>
          )}
        </div>
        
        {/* Keyword Feedback */}
        <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 font-mono">// Keyword Match:</h3>
          <div className="space-y-2">
            {keywordFeedback.matched.length > 0 && (
              <div>
                <p className="text-xs text-green-400 mb-1 font-mono">✓ Matched:</p>
                <div className="flex flex-wrap gap-2">
                  {keywordFeedback.matched.map((kw, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {keywordFeedback.missing.length > 0 && (
              <div>
                <p className="text-xs text-red-400 mb-1 font-mono">✗ Missing:</p>
                <div className="flex flex-wrap gap-2">
                  {keywordFeedback.missing.map((kw, idx) => {
                    const hasReveals = gameState.upgrades.keywordRevealsLeft > 0;
                    return (
                      <span 
                        key={idx} 
                        className={`px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-mono ${
                          hasReveals ? '' : 'blur-sm'
                        }`}
                      >
                        {kw}
                      </span>
                    );
                  })}
                </div>
                {gameState.upgrades.keywordRevealsLeft === 0 && (
                  <p className="text-xs text-yellow-400 mt-2 font-mono italic animate-pulse">
                    // Buy "Keywords x3" ($100) to reveal for 3 deploys
                  </p>
                )}
                {gameState.upgrades.keywordRevealsLeft > 0 && (
                  <p className="text-xs text-green-400 mt-2 font-mono">
                    ✓ {gameState.upgrades.keywordRevealsLeft} reveals remaining
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Score Breakdown */}
        <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-gray-300 mb-2 font-mono">// Breakdown:</h3>
          <div className="space-y-1 text-xs text-gray-400 font-mono">
            <div className="flex justify-between">
              <span>Keywords ({score.matchedKeywords}/{score.totalKeywords}):</span>
              <span className="font-semibold">{Math.round(score.keywordScore * 60)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Structure:</span>
              <span className="font-semibold">{Math.round(score.structureScore * 30)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Clarity:</span>
              <span className="font-semibold">{Math.round(score.clarityScore * 10)}%</span>
            </div>
          </div>
        </div>
        
        {/* Tool Bonus */}
        {gameState.toolTier > 0 && (
          <div className="bg-purple-500/10 rounded-lg p-4 border-2 border-purple-500/30 animate-pulse">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-purple-300 font-mono">AI Bonus:</span>
              <span className="text-lg font-bold text-purple-400 neon-glow">
                +{(gameState.toolTier * 15)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
