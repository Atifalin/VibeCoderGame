import { useGame } from '../context/GameContext';
import aiToolIcon from '../assets/svg/ai-tool.svg';
import serverIcon from '../assets/svg/server.svg';

const UPGRADES_LIST = [
  {
    id: 'revealKeywords',
    name: 'Keywords x3',
    cost: 100,
    icon: '🔍',
    repeatable: true,
    description: 'Reveals keywords for 3 deploys',
  },
  {
    id: 'unlockAllBlocks',
    name: 'All Blocks',
    cost: 500,
    icon: '🔓',
    description: 'Unlock all prompt blocks',
  },
  {
    id: 'extraTokens',
    name: 'Tokens+',
    cost: 100,
    icon: '📝',
    repeatable: true,
  },
  {
    id: 'tempNotes',
    name: 'Notes x3',
    cost: 10,
    icon: '✏️',
    repeatable: true,
    description: '+1 note for 3 deploys',
  },
  {
    id: 'permanentNotes',
    name: 'Notes++',
    cost: 100,
    icon: '📝',
    repeatable: true,
    description: 'Permanent +1 note (max 5)',
  },
  {
    id: 'copilot',
    name: 'CoPilot',
    cost: 300,
    icon: '🤖',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    cost: 700,
    icon: '🏄',
    requires: 'copilot',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    cost: 1500,
    icon: '⚡',
    requires: 'windsurf',
  },
];

export default function ShopBox() {
  const { gameState, buyUpgrade } = useGame();
  
  const canAfford = (cost) => gameState.money >= cost;
  const isOwned = (id) => {
    // Repeatable upgrades
    if (id === 'extraTokens' || id === 'tempNotes' || id === 'revealKeywords') return false;
    
    // Permanent notes - check if at max (5)
    if (id === 'permanentNotes') {
      return (gameState.upgrades.permanentNotes || 1) >= 5;
    }
    
    if (id === 'unlockAllBlocks') return gameState.upgrades.unlockedBlocks === 'all';
    return gameState.upgrades[id];
  };
  const meetsRequirements = (requires) => {
    if (!requires) return true;
    return gameState.upgrades[requires];
  };
  
  const handleBuy = (upgrade) => {
    if (canAfford(upgrade.cost) && !isOwned(upgrade.id) && meetsRequirements(upgrade.requires)) {
      buyUpgrade(upgrade.id, upgrade.cost);
    }
  };
  
  return (
    <div className="codepen-card p-3 h-full flex flex-col">
      <h3 className="text-sm font-bold text-purple-400 mb-2 font-mono">{'<SHOP />'}</h3>
      
      <div className="space-y-2 overflow-y-auto flex-1 pr-1">
        {UPGRADES_LIST.map(upgrade => {
          const owned = isOwned(upgrade.id);
          const affordable = canAfford(upgrade.cost);
          const meetsReqs = meetsRequirements(upgrade.requires);
          const canBuy = affordable && !owned && meetsReqs;
          
          return (
            <button
              key={upgrade.id}
              onClick={() => handleBuy(upgrade)}
              disabled={!canBuy}
              className={`w-full p-2 rounded border-2 transition-all text-left ${
                owned ? 'bg-green-500/10 border-green-500/30' :
                canBuy ? 'bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20' :
                'bg-gray-800/50 border-gray-700 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{upgrade.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-gray-200">{upgrade.name}</div>
                    <div className="text-xs text-yellow-400">${upgrade.cost}</div>
                  </div>
                </div>
                {owned && !upgrade.repeatable && (
                  <span className="text-xs text-green-400">✓</span>
                )}
                {upgrade.id === 'extraTokens' && gameState.upgrades.extraTokens > 0 && (
                  <span className="text-xs text-indigo-400">+{gameState.upgrades.extraTokens}</span>
                )}
                {upgrade.id === 'tempNotes' && gameState.upgrades.tempNotesLeft > 0 && (
                  <span className="text-xs text-yellow-400 animate-pulse">{gameState.upgrades.tempNotesLeft} left</span>
                )}
                {upgrade.id === 'permanentNotes' && (
                  <span className="text-xs text-green-400">
                    {gameState.upgrades.permanentNotes || 1}/5
                  </span>
                )}
                {upgrade.id === 'revealKeywords' && gameState.upgrades.keywordRevealsLeft > 0 && (
                  <span className="text-xs text-yellow-400 animate-pulse">{gameState.upgrades.keywordRevealsLeft} left</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
