import { useState } from 'react';
import { useGame } from '../context/GameContext';
import Inbox from './Inbox';
import PromptBuilder from './PromptBuilder';
import PromptPreview from './PromptPreview';
import DeployButton from './DeployButton';
import DayTimer from './DayTimer';
import ShopBox from './ShopBox';
import PayoutTracker from './PayoutTracker';

export default function PlayScreen() {
  const { gameState, setScreen, isPaused, setIsPaused } = useGame();
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const request = gameState.requests[gameState.currentRequestIndex];
  
  const handleDeploy = () => {
    // Reset selected blocks after deploy
    setSelectedBlocks([]);
    // Trigger new request animation
    setShowNewRequest(true);
    setTimeout(() => setShowNewRequest(false), 2000);
  };
  
  const clearBlocks = () => {
    setSelectedBlocks([]);
  };
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] grid-bg overflow-hidden">
      {/* Top Bar */}
      <div className="codepen-card rounded-none border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-mono">{'<VIBE_CODER />'}</h1>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`wynncraft-btn text-sm ${
                  isMuted ? 'bg-gray-500 text-white border-gray-600' : 'bg-blue-500 text-white border-blue-600'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`wynncraft-btn text-sm ${
                  isPaused ? 'bg-green-500 text-white border-green-600' : 'bg-yellow-500 text-gray-900 border-yellow-600'
                }`}
              >
                {isPaused ? '▶' : '⏸'}
              </button>
              
              <button
                onClick={() => setScreen('landing')}
                className="wynncraft-btn text-sm bg-red-500 text-white border-red-600"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Game Area - Responsive Layout */}
      <div className="h-[calc(100vh-80px)] max-w-[1920px] mx-auto px-2 sm:px-4 py-2 sm:py-3 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 min-h-full">
          {/* Left Column: Timer, Stats, Shop */}
          <div className="lg:col-span-3 flex flex-col gap-2 sm:gap-3 overflow-y-auto max-h-[50vh] lg:max-h-full">
            <DayTimer />
            
            <div className="grid grid-cols-1 gap-2">
              <div className="codepen-card p-2 text-center">
                <p className="text-xs text-green-400 font-mono">$MONEY</p>
                <p className="text-xl font-black text-green-400 neon-glow">${gameState.money}</p>
              </div>
              
              <div className="codepen-card p-2 text-center">
                <p className="text-xs text-purple-400 font-mono">DONE</p>
                <p className="text-xl font-black text-purple-400">{gameState.completedRequests}</p>
              </div>
              
              {gameState.consecutiveBadDeploys > 0 && (
                <div className="codepen-card p-2 text-center bg-red-500/20 border-red-500 animate-pulse">
                  <p className="text-xs text-red-400 font-mono">⚠️ WARNING</p>
                  <p className="text-sm font-black text-red-400">{gameState.consecutiveBadDeploys}/3 Bad</p>
                  <p className="text-xs text-red-300 font-mono mt-1">Quality &lt; 40%</p>
                </div>
              )}
            </div>
            
            {/* Taller Shop */}
            <div className="flex-1 overflow-y-auto">
              <ShopBox />
            </div>
          </div>
          
          {/* Middle Column: Client Request + Prompt Builder */}
          <div className="lg:col-span-6 flex flex-col gap-2 sm:gap-3 overflow-y-auto max-h-[80vh] lg:max-h-full">
            <PromptBuilder 
              selectedBlocks={selectedBlocks}
              setSelectedBlocks={setSelectedBlocks}
              tokenBudget={request?.tokenBudget || 50}
              request={request}
              showNewRequest={showNewRequest}
              onDeploy={handleDeploy}
              isMuted={isMuted}
            />
          </div>
          
          {/* Right Column: Preview */}
          <div className="lg:col-span-3 flex flex-col gap-2 sm:gap-3 overflow-y-auto max-h-[60vh] lg:max-h-full">
            <div className="flex-1">
              <PromptPreview selectedBlocks={selectedBlocks} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="codepen-card p-12 text-center max-w-md">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-6">PAUSED</h2>
            <p className="text-gray-400 font-mono mb-8">// Game execution halted</p>
            <button
              onClick={() => setIsPaused(false)}
              className="wynncraft-btn w-full bg-green-500 text-white border-green-600 text-xl"
            >
              ▶ Resume
            </button>
          </div>
        </div>
      )}
      
      {/* Payout Tracker */}
      <PayoutTracker />
    </div>
  );
}
