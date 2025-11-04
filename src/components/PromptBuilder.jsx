import { useState } from 'react';
import { useGame } from '../context/GameContext';
import promptBlockIcon from '../assets/svg/prompt-block.svg';
import { playClick } from '../utils/sounds';
import DeployButton from './DeployButton';
import { getAvailableModels, AI_MODELS } from '../data/models';

// Progressive block unlocking system
const BLOCK_OPTIONS = {
  basic: {
    language: ['JavaScript (ES6)', 'TypeScript', 'Python'],
    framework: ['React', 'Next.js', 'Flask'],
    projectType: ['To-Do app', 'Landing page', 'Dashboard'],
    features: ['Auth', 'DB (SQLite)', 'Dark mode'],
    priority: ['Speed', 'Quality'],
  },
  intermediate: {
    language: ['JavaScript (ES6)', 'TypeScript', 'Python', 'Dart'],
    framework: ['React', 'React Native', 'Next.js', 'Vite', 'Flask', 'FastAPI'],
    projectType: ['To-Do app', 'Landing page', 'Chatbot UI', 'E-commerce site', 'Dashboard', 'Mobile app'],
    features: ['Auth', 'Offline support', 'Push notifications', 'DB (SQLite)', 'Stripe payment', 'Image upload', 'Dark mode'],
    integrations: ['Google Maps', 'Supabase', 'Firebase', 'Stripe'],
    extras: ['Animations', 'Accessibility', 'Unit tests'],
    deliverable: ['GitHub repo', 'ZIP file'],
    priority: ['Speed', 'Quality', 'Low cost'],
  },
  advanced: {
    language: ['JavaScript (ES6)', 'TypeScript', 'Python', 'Dart', 'Kotlin'],
    framework: ['React', 'React Native', 'Next.js', 'Vite', 'Flask', 'FastAPI', 'Flutter'],
    projectType: ['To-Do app', 'Landing page', 'Chatbot UI', 'E-commerce site', 'Dashboard', 'Mobile app', 'API service'],
    features: ['Auth', 'Offline support', 'Push notifications', 'DB (SQLite)', 'Stripe payment', 'Image upload', 'Dark mode', 'Admin panel'],
    integrations: ['Google Maps', 'Supabase', 'Firebase', 'Stripe', 'OCR', 'Twilio'],
    extras: ['Animations', 'Accessibility', 'Unit tests', 'CI/CD config', 'Docker'],
    deliverable: ['GitHub repo', 'ZIP file', 'Dockerfile'],
    priority: ['Speed', 'Quality', 'Low cost'],
  },
  all: {
    language: ['JavaScript (ES6)', 'TypeScript', 'Python', 'Dart', 'Kotlin'],
    framework: ['React', 'React Native', 'Next.js', 'Vite', 'Flask', 'FastAPI', 'Flutter'],
    projectType: ['To-Do app', 'Landing page', 'Chatbot UI', 'E-commerce site', 'Dashboard', 'Mobile app', 'API service'],
    features: ['Auth', 'Offline support', 'Push notifications', 'DB (SQLite)', 'Stripe payment', 'Image upload', 'Dark mode', 'Admin panel'],
    integrations: ['Google Maps', 'Supabase', 'Firebase', 'Stripe', 'OCR', 'Twilio', 'SendGrid'],
    extras: ['Animations', 'Accessibility', 'Unit tests', 'CI/CD config', 'Docker', 'SEO optimization'],
    deliverable: ['GitHub repo', 'ZIP file', 'Dockerfile', 'NPM package'],
    priority: ['Speed', 'Quality', 'Low cost'],
  },
};

export default function PromptBuilder({ selectedBlocks, setSelectedBlocks, tokenBudget, request, showNewRequest, onDeploy, isMuted }) {
  const { gameState, setModel } = useGame();
  const [clientNotes, setClientNotes] = useState('');
  
  // Count how many notes are already added
  const notesCount = selectedBlocks.filter(b => b.startsWith('Notes:')).length;
  
  // Calculate total notes limit (permanent + temp)
  const permanentLimit = gameState.upgrades.permanentNotes || 1;
  const tempBoost = gameState.upgrades.tempNotesLeft > 0 ? 1 : 0;
  const totalNotesLimit = Math.min(permanentLimit + tempBoost, 5);
  
  const canAddMoreNotes = notesCount < totalNotesLimit;
  
  // Get available models
  const availableModels = getAvailableModels(gameState.completedRequests);
  
  // Get current block options based on unlock level
  const currentBlocks = BLOCK_OPTIONS[gameState.upgrades.unlockedBlocks] || BLOCK_OPTIONS.basic;
  
  const toggleBlock = (category, value) => {
    if (!isMuted) playClick();
    const blockText = `${category}: ${value}`;
    if (selectedBlocks.includes(blockText)) {
      setSelectedBlocks(selectedBlocks.filter(b => b !== blockText));
    } else {
      setSelectedBlocks([...selectedBlocks, blockText]);
    }
  };
  
  const isSelected = (category, value) => {
    return selectedBlocks.includes(`${category}: ${value}`);
  };
  
  const addClientNotes = () => {
    if (clientNotes.trim() && canAddMoreNotes) {
      setSelectedBlocks([...selectedBlocks, `Notes: ${clientNotes}`]);
      setClientNotes('');
    }
  };
  
  const maxTokens = tokenBudget + (gameState.upgrades.extraTokens || 0);
  
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      {/* CLIENT REQUEST - BIG AND FLASHY */}
      {!request ? (
        <div className="codepen-card p-8 border-4 border-green-500 text-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-mono mb-4">
            🎉 CONGRATULATIONS! 🎉
          </h2>
          <p className="text-xl text-gray-300 mb-4">You've completed all available requests!</p>
          <p className="text-gray-400 font-mono">More exciting challenges coming soon...</p>
          <div className="mt-6">
            <p className="text-green-400 font-bold">Your Stats:</p>
            <p className="text-gray-300 font-mono">💰 ${gameState.money} earned</p>
            <p className="text-gray-300 font-mono">✅ {gameState.completedRequests} requests completed</p>
          </div>
        </div>
      ) : (
        <div className={`codepen-card p-6 border-4 transition-all ${
          showNewRequest 
            ? 'border-yellow-400 animate-pulse shadow-[0_0_30px_rgba(250,204,21,0.5)]' 
            : 'border-purple-500/50'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-mono">
              {'<CLIENT_REQUEST />'}
            </h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded text-xs font-bold">
                LVL {request.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs font-bold">
                {request.tokenBudget} tokens
              </span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{request.title}</h3>
          <p className="text-gray-300 leading-relaxed mb-3">{request.description}</p>
          
          {/* Model Selector */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400 font-mono">Model:</span>
            <select
              value={gameState.selectedModel}
              onChange={(e) => setModel(e.target.value)}
              className="px-3 py-1 bg-gray-800 border-2 border-purple-500/30 text-gray-200 rounded font-mono text-sm focus:outline-none focus:border-purple-500"
            >
              {availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.icon} {model.name} - {model.description}
                </option>
              ))}
            </select>
            {availableModels.length < 4 && (
              <span className="text-xs text-gray-500 font-mono">
                (More unlock at {AI_MODELS[Object.keys(AI_MODELS).find(k => !availableModels.find(m => m.id === k))]?.unlockAt || '?'} requests)
              </span>
            )}
          </div>
          
          {showNewRequest && (
            <div className="mt-2 text-center">
              <span className="text-yellow-400 font-bold animate-pulse">✨ NEW REQUEST ✨</span>
            </div>
          )}
        </div>
      )}
      
      {/* PROMPT BUILDER */}
      <div className="codepen-card p-3 sm:p-4">
        <h2 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2 font-mono">
          <img src={promptBlockIcon} alt="Prompt" className="w-5 h-5" />
          {'<PROMPT_BUILDER />'}
        </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Language */}
        <div>
          <h3 className="text-xs font-semibold text-gray-300 mb-2 font-mono">// Language *</h3>
          <div className="flex flex-wrap gap-1">
            {currentBlocks.language.map(lang => (
              <button
                key={lang}
                onClick={() => toggleBlock('Language', lang)}
                className={`px-2 py-1 text-xs font-bold transition-all border-2 ${
                  isSelected('Language', lang)
                    ? 'bg-indigo-500 text-white border-indigo-600 shadow-md animate-shake'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        
        {/* Framework */}
        <div>
          <h3 className="text-xs font-semibold text-gray-300 mb-2 font-mono">// Framework</h3>
          <div className="flex flex-wrap gap-1">
            {currentBlocks.framework.map(fw => (
              <button
                key={fw}
                onClick={() => toggleBlock('Framework', fw)}
                className={`px-2 py-1 text-xs font-bold transition-all border-2 ${
                  isSelected('Framework', fw)
                    ? 'bg-purple-500 text-white border-purple-600 shadow-md animate-shake'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>
        </div>
        
        {/* Project Type */}
        <div>
          <h3 className="text-xs font-semibold text-gray-300 mb-2 font-mono">// Project Type</h3>
          <div className="flex flex-wrap gap-1">
            {currentBlocks.projectType.map(type => (
              <button
                key={type}
                onClick={() => toggleBlock('Project', type)}
                className={`px-2 py-1 text-xs font-bold transition-all border-2 ${
                  isSelected('Project', type)
                    ? 'bg-blue-500 text-white border-blue-600 shadow-md animate-shake'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        {/* Features */}
        <div>
          <h3 className="text-xs font-semibold text-gray-300 mb-2 font-mono">// Features</h3>
          <div className="flex flex-wrap gap-1">
            {currentBlocks.features.map(feat => (
              <button
                key={feat}
                onClick={() => toggleBlock('Feature', feat)}
                className={`px-2 py-1 text-xs font-bold transition-all border-2 ${
                  isSelected('Feature', feat)
                    ? 'bg-green-500 text-white border-green-600 shadow-md animate-shake'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {feat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Integrations */}
        {currentBlocks.integrations && (
        <div>
          <h3 className="text-xs font-semibold text-gray-300 mb-2 font-mono">// Integrations</h3>
          <div className="flex flex-wrap gap-1">
            {currentBlocks.integrations.map(int => (
              <button
                key={int}
                onClick={() => toggleBlock('Integration', int)}
                className={`px-2 py-1 text-xs font-bold transition-all border-2 ${
                  isSelected('Integration', int)
                    ? 'bg-yellow-500 text-gray-900 border-yellow-600 shadow-md animate-shake'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {int}
              </button>
            ))}
          </div>
        </div>
        )}
        
        {/* Extras */}
        {currentBlocks.extras && (
        <div>
          <h3 className="text-xs font-semibold text-gray-300 mb-2 font-mono">// Extras & Polish</h3>
          <div className="flex flex-wrap gap-1">
            {currentBlocks.extras?.map(extra => (
              <button
                key={extra}
                onClick={() => toggleBlock('Extra', extra)}
                className={`px-2 py-1 text-xs font-bold transition-all border-2 ${
                  isSelected('Extra', extra)
                    ? 'bg-pink-500 text-white border-pink-600 shadow-md animate-shake'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {extra}
              </button>
            ))}
          </div>
        </div>
        )}
        
        {/* Deliverable */}
        {currentBlocks.deliverable && (
        <div>
          <h3 className="text-xs font-semibold text-gray-300 mb-2 font-mono">// Deliverable Format</h3>
          <div className="flex flex-wrap gap-1">
            {currentBlocks.deliverable?.map(del => (
              <button
                key={del}
                onClick={() => toggleBlock('Deliverable', del)}
                className={`px-2 py-1 text-xs font-bold transition-all border-2 ${
                  isSelected('Deliverable', del)
                    ? 'bg-orange-500 text-white border-orange-600 shadow-md animate-shake'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {del}
              </button>
            ))}
          </div>
        </div>
        )}
        
        {/* Priority */}
        <div>
          <h3 className="text-xs font-semibold text-gray-300 mb-2 font-mono">// Priority</h3>
          <div className="flex flex-wrap gap-1">
            {currentBlocks.priority.map(pri => (
              <button
                key={pri}
                onClick={() => toggleBlock('Priority', pri)}
                className={`px-2 py-1 text-xs font-bold transition-all border-2 ${
                  isSelected('Priority', pri)
                    ? 'bg-red-500 text-white border-red-600 shadow-md animate-shake'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {pri}
              </button>
            ))}
          </div>
        </div>
        
        {/* Client Notes */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-300 font-mono">// Additional Notes (10 tokens each)</h3>
            <span className="text-xs text-gray-400 font-mono">
              {notesCount}/{totalNotesLimit} used
              {tempBoost > 0 && <span className="text-yellow-400 ml-1 animate-pulse">+1 temp</span>}
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && canAddMoreNotes && addClientNotes()}
              placeholder={canAddMoreNotes ? "Add custom requirements..." : "Buy Notes+ upgrade for more"}
              disabled={!canAddMoreNotes}
              className={`flex-1 px-3 py-2 bg-gray-800 border-2 text-gray-200 rounded focus:outline-none placeholder-gray-500 ${
                canAddMoreNotes ? 'border-gray-700 focus:border-indigo-500' : 'border-red-500/30 opacity-50'
              }`}
            />
            <button
              onClick={addClientNotes}
              disabled={!canAddMoreNotes}
              className={`wynncraft-btn text-sm ${
                canAddMoreNotes 
                  ? 'bg-indigo-500 text-white border-indigo-600' 
                  : 'bg-gray-700 text-gray-500 border-gray-800 opacity-50'
              }`}
            >
              +
            </button>
          </div>
          {!canAddMoreNotes && (
            <p className="text-xs text-red-400 mt-1 font-mono">
              ⚠️ Max notes reached. Buy "Notes x3" ($10) or "Notes++" ($100)
            </p>
          )}
        </div>
        
        {/* Token Budget Info */}
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-300 font-mono">Max Tokens:</span>
            <span className="text-lg font-bold text-indigo-400">{maxTokens}</span>
          </div>
          {gameState.upgrades.extraTokens > 0 && (
            <p className="text-xs text-gray-500 mt-1 font-mono">
              // +{gameState.upgrades.extraTokens} from upgrades
            </p>
          )}
        </div>
      </div>
      </div>
      
      {/* DEPLOY BUTTON - BENTO STYLE */}
      <div className="codepen-card p-4">
        <DeployButton selectedBlocks={selectedBlocks} onDeploy={onDeploy} isMuted={isMuted} />
        {selectedBlocks.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-400 font-mono">{selectedBlocks.length} blocks selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
