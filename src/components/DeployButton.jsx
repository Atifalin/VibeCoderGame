import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { scorePrompt, calculatePayout } from '../utils/scoring';
import deployIcon from '../assets/svg/deploy.svg';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { playSuccess, playCoin } from '../utils/sounds';

export default function DeployButton({ selectedBlocks, onDeploy, isMuted }) {
  const { getCurrentRequest, gameState, completeRequest } = useGame();
  const [isDeploying, setIsDeploying] = useState(false);
  const [showPayout, setShowPayout] = useState(false);
  const [lastPayout, setLastPayout] = useState(0);
  
  const request = getCurrentRequest();
  
  const handleDeploy = () => {
    if (!request || selectedBlocks.length === 0 || isDeploying) return;
    
    setIsDeploying(true);
    
    // Calculate score and payout
    const tokenBudget = request.tokenBudget + (gameState.upgrades.extraTokens || 0);
    const score = scorePrompt(selectedBlocks, request, gameState.toolTier, tokenBudget, gameState.selectedModel);
    const payout = calculatePayout(
      score.completeness,
      request.difficulty,
      gameState.toolTier,
      score.tokensUsed,
      tokenBudget
    );
    
    // Simulate deploy animation
    setTimeout(() => {
      setLastPayout(payout);
      setShowPayout(true);
      completeRequest(payout, score.completeness);
      
      // Dispatch payout event for tracker
      window.dispatchEvent(new CustomEvent('payout', { detail: { amount: payout } }));
      
      // Confetti and sounds based on score
      const messages = {
        awesome: ['🔥 AWESOME!', '⚡ INCREDIBLE!', '🌟 AMAZING!', '💎 PERFECT!'],
        great: ['👍 GREAT JOB!', '✨ NICE WORK!', '🎯 SOLID!', '💪 WELL DONE!'],
        good: ['👌 GOOD!', '📦 DELIVERED!', '✅ DONE!', '🚀 SHIPPED!'],
        couldBeBetter: ['😅 COULD BE BETTER', '🤔 NEEDS WORK', '📝 TRY HARDER', '⚠️ BARELY PASSED']
      };
      
      if (score.completeness >= 90) {
        if (!isMuted) {
          playSuccess();
          playCoin();
        }
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
        const msg = messages.awesome[Math.floor(Math.random() * messages.awesome.length)];
        toast.success(`${msg} +$${payout}`, {
          icon: '🎉',
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: 'bold',
          },
          duration: 3000,
        });
      } else if (score.completeness >= 70) {
        if (!isMuted) playCoin();
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 }
        });
        setFeedback({ message: '🎉 EXCELLENT! Great work!', color: 'text-green-400' });
        const msg = messages.great[Math.floor(Math.random() * messages.great.length)];
        toast.success(`${msg} +$${payout}`, {
          icon: '💰',
          style: {
            background: '#f59e0b',
            color: '#fff',
            fontWeight: 'bold',
          },
          duration: 2500,
        });
      } else if (score.completeness >= 60) {
        if (!isMuted) {
          playSuccess();
          playCoin();
        }
        setFeedback({ message: '✅ GOOD! Solid execution!', color: 'text-blue-400' });
        const msg = messages.good[Math.floor(Math.random() * messages.good.length)];
        toast(`${msg} +$${payout}`, {
          icon: '📦',
          style: {
            background: '#6366f1',
            color: '#fff',
            fontWeight: 'bold',
          },
          duration: 2000,
        });
      } else if (score.completeness >= 40) {
        if (!isMuted) playCoin();
        setFeedback({ message: '⚠️ ACCEPTABLE... Room for improvement.', color: 'text-yellow-400' });
        const msg = messages.couldBeBetter[Math.floor(Math.random() * messages.couldBeBetter.length)];
        toast(`${msg} +$${payout}`, {
          icon: '😬',
          style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: 'bold',
          },
          duration: 2500,
        });
      } else {
        if (!isMuted) playError();
        setFeedback({ message: '❌ POOR! Client is unhappy!', color: 'text-red-400' });
        const msg = messages.couldBeBetter[Math.floor(Math.random() * messages.couldBeBetter.length)];
        toast(`${msg} +$${payout}`, {
          icon: '😬',
          style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: 'bold',
          },
          duration: 2500,
        });
      }
      
      // Reset after showing payout
      setTimeout(() => {
        setIsDeploying(false);
        setShowPayout(false);
        onDeploy();
      }, 2000);
    }, 1500);
  };
  
  const canDeploy = selectedBlocks.length > 0 && !isDeploying;
  
  return (
    <div className="relative">
      <button
        onClick={handleDeploy}
        disabled={!canDeploy}
        className={`wynncraft-btn w-full py-4 text-xl flex items-center justify-center gap-3 ${
          canDeploy
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-600'
            : 'bg-gray-700 text-gray-500 border-gray-800'
        } ${isDeploying ? 'animate-pulse' : ''}`}
      >
        <img src={deployIcon} alt="Deploy" className="w-8 h-8" />
        {isDeploying ? 'DEPLOYING...' : '▶ DEPLOY & DELIVER'}
      </button>
      
      {/* Payout Animation */}
      {showPayout && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="codepen-card bg-gradient-to-r from-green-500 to-emerald-500 border-green-400 px-8 py-4 animate-bounce-slow">
            <span className="text-3xl font-black text-white neon-glow">+${lastPayout}</span>
            <div className="text-sm mt-1 text-white font-mono">💰 PAYMENT RECEIVED</div>
          </div>
        </div>
      )}
    </div>
  );
}
