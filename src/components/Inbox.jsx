import { useGame } from '../context/GameContext';
import clientIcon from '../assets/svg/client.svg';

export default function Inbox() {
  const { getCurrentRequest } = useGame();
  const request = getCurrentRequest();
  
  if (!request) return null;
  
  const difficultyColors = {
    1: 'bg-green-500/20 text-green-400 border border-green-500/30',
    2: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    3: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    4: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    5: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };
  
  return (
    <div className="codepen-card p-6 h-full">
      <h2 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-2 font-mono">
        <img src={clientIcon} alt="Client" className="w-6 h-6" />
        {'<CLIENT_REQUEST />'}
      </h2>
      
      <div className="space-y-4">
        <div className="border-l-4 border-indigo-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-100">{request.title}</h3>
            <span className={`px-2 py-1 rounded text-xs font-bold ${difficultyColors[request.difficulty]}`}>
              LVL {request.difficulty}
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{request.description}</p>
        </div>
        
        <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 font-mono">// Requirements:</h4>
          <div className="flex flex-wrap gap-2">
            {request.required_keywords.map((keyword, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-xs font-mono"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 font-mono">Token Budget:</span>
          <span className="font-bold text-indigo-400">{request.tokenBudget} tokens</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 font-mono">Base Payout:</span>
          <span className="font-bold text-green-400">${50 * request.difficulty}</span>
        </div>
      </div>
    </div>
  );
}
