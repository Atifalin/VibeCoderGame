import { useGame } from '../context/GameContext';
import aiToolIcon from '../assets/svg/ai-tool.svg';
import serverIcon from '../assets/svg/server.svg';

const UPGRADES_LIST = [
  {
    id: 'copilot',
    name: 'GitHub CoPilot',
    description: 'AI coding assistant. +15% payout multiplier.',
    cost: 500,
    icon: aiToolIcon,
    requires: null,
  },
  {
    id: 'windsurf',
    name: 'Windsurf AI',
    description: 'Advanced AI tool. +30% payout multiplier.',
    cost: 1200,
    icon: aiToolIcon,
    requires: 'copilot',
  },
  {
    id: 'cursor',
    name: 'Cursor AI',
    description: 'Premium AI assistant. +45% payout multiplier.',
    cost: 2500,
    icon: aiToolIcon,
    requires: 'windsurf',
  },
  {
    id: 'extraTokens',
    name: 'Token Boost',
    description: '+20 tokens to budget. Can buy multiple times.',
    cost: 300,
    icon: serverIcon,
    requires: null,
    repeatable: true,
  },
  {
    id: 'fasterDeploy',
    name: 'Fast Deploy',
    description: 'Reduce deploy time by 50%.',
    cost: 800,
    icon: serverIcon,
    requires: null,
  },
  {
    id: 'selfHosted',
    name: 'Self-Hosted Servers',
    description: 'Reduce deploy costs, better margins.',
    cost: 1500,
    icon: serverIcon,
    requires: null,
  },
];

export default function Upgrades() {
  const { gameState, buyUpgrade, setScreen } = useGame();
  
  const canAfford = (cost) => gameState.money >= cost;
  const isOwned = (id) => {
    if (id === 'extraTokens') return false; // Can buy multiple
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Upgrades Shop</h1>
          <button
            onClick={() => setScreen('play')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Game
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-gray-700">Your Money:</span>
            <span className="text-3xl font-bold text-green-600">${gameState.money}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {UPGRADES_LIST.map(upgrade => {
            const owned = isOwned(upgrade.id);
            const affordable = canAfford(upgrade.cost);
            const meetsReqs = meetsRequirements(upgrade.requires);
            const canBuy = affordable && !owned && meetsReqs;
            
            return (
              <div
                key={upgrade.id}
                className={`bg-white rounded-lg shadow-lg p-6 border-2 transition-all ${
                  owned ? 'border-green-500 bg-green-50' :
                  canBuy ? 'border-indigo-500 hover:shadow-xl' :
                  'border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <img src={upgrade.icon} alt={upgrade.name} className="w-12 h-12" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{upgrade.name}</h3>
                    {owned && !upgrade.repeatable && (
                      <span className="text-xs text-green-600 font-semibold">✓ Owned</span>
                    )}
                    {upgrade.repeatable && gameState.upgrades.extraTokens > 0 && (
                      <span className="text-xs text-indigo-600 font-semibold">
                        Owned: {gameState.upgrades.extraTokens / 20}x
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{upgrade.description}</p>
                
                {upgrade.requires && !gameState.upgrades[upgrade.requires] && (
                  <p className="text-xs text-red-600 mb-2">
                    Requires: {UPGRADES_LIST.find(u => u.id === upgrade.requires)?.name}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-800">${upgrade.cost}</span>
                  <button
                    onClick={() => handleBuy(upgrade)}
                    disabled={!canBuy}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      canBuy
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {owned && !upgrade.repeatable ? 'Owned' : 'Buy'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
