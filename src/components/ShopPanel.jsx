import { useGame } from '../context/GameContext';
import aiToolIcon from '../assets/svg/ai-tool.svg';
import serverIcon from '../assets/svg/server.svg';

const UPGRADES_LIST = [
  {
    id: 'revealKeywords',
    name: 'Keyword Reveal',
    description: 'Show missing keywords',
    cost: 100,
    icon: aiToolIcon,
    requires: null,
  },
  {
    id: 'copilot',
    name: 'CoPilot',
    description: '+15% payout',
    cost: 500,
    icon: aiToolIcon,
    requires: null,
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    description: '+30% payout',
    cost: 1200,
    icon: aiToolIcon,
    requires: 'copilot',
  },
  {
    id: 'cursor',
    name: 'Cursor AI',
    description: '+45% payout',
    cost: 2500,
    icon: aiToolIcon,
    requires: 'windsurf',
  },
  {
    id: 'extraTokens',
    name: 'Token+',
    description: '+20 tokens',
    cost: 100,
    icon: serverIcon,
    requires: null,
    repeatable: true,
  },
  {
    id: 'fasterDeploy',
    name: 'Fast Deploy',
    description: '-50% time',
    cost: 800,
    icon: serverIcon,
    requires: null,
  },
  {
    id: 'selfHosted',
    name: 'Self-Host',
    description: 'Better margins',
    cost: 1500,
    icon: serverIcon,
    requires: null,
  },
];

export default function ShopPanel({ isOpen, onClose }) {
  const { gameState, buyUpgrade } = useGame();
  
  const canAfford = (cost) => gameState.money >= cost;
  const isOwned = (id) => {
    if (id === 'extraTokens') return false;
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
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-[#0a0a0f] border-l-2 border-indigo-500/30 z-50 overflow-y-auto animate-slide-in">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-mono">
              {'<SHOP />'}
            </h2>
            <button
              onClick={onClose}
              className="wynncraft-btn bg-red-500 text-white border-red-600 text-sm"
            >
              ✕
            </button>
          </div>
          
          {/* Money Display */}
          <div className="codepen-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-mono">Your Money:</span>
              <span className="text-2xl font-black text-green-400">${gameState.money}</span>
            </div>
          </div>
          
          {/* Upgrades */}
          <div className="space-y-3">
            {UPGRADES_LIST.map(upgrade => {
              const owned = isOwned(upgrade.id);
              const affordable = canAfford(upgrade.cost);
              const meetsReqs = meetsRequirements(upgrade.requires);
              const canBuy = affordable && !owned && meetsReqs;
              
              return (
                <div
                  key={upgrade.id}
                  className={`codepen-card p-4 transition-all ${
                    owned ? 'border-green-500/50 bg-green-500/5' :
                    canBuy ? 'border-indigo-500/50 hover:border-indigo-500' :
                    'opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img src={upgrade.icon} alt={upgrade.name} className="w-10 h-10" />
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-200">{upgrade.name}</h3>
                      <p className="text-xs text-gray-400 font-mono">{upgrade.description}</p>
                      {owned && !upgrade.repeatable && (
                        <span className="text-xs text-green-400 font-mono">✓ OWNED</span>
                      )}
                      {upgrade.repeatable && gameState.upgrades.extraTokens > 0 && (
                        <span className="text-xs text-indigo-400 font-mono">
                          x{gameState.upgrades.extraTokens / 20}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {upgrade.requires && !gameState.upgrades[upgrade.requires] && (
                    <p className="text-xs text-red-400 mb-2 font-mono">
                      Requires: {UPGRADES_LIST.find(u => u.id === upgrade.requires)?.name}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-yellow-400">${upgrade.cost}</span>
                    <button
                      onClick={() => handleBuy(upgrade)}
                      disabled={!canBuy}
                      className={`wynncraft-btn text-xs ${
                        canBuy
                          ? 'bg-indigo-500 text-white border-indigo-600'
                          : 'bg-gray-700 text-gray-500 border-gray-800'
                      }`}
                    >
                      {owned && !upgrade.repeatable ? 'OWNED' : 'BUY'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
