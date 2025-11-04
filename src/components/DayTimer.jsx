import { useGame } from '../context/GameContext';
import { GAME_CONSTANTS } from '../utils/scoring';

export default function DayTimer() {
  const { gameState } = useGame();
  
  const totalSeconds = Math.floor(gameState.timeRemaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const percentage = (gameState.timeRemaining / GAME_CONSTANTS.DAY_DURATION_MS) * 100;
  
  const getTimeColor = () => {
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBarColor = () => {
    if (percentage > 50) return 'from-green-500 to-emerald-500';
    if (percentage > 25) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="codepen-card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-gray-300 font-mono">DAY {gameState.day}</span>
        <span className={`text-2xl font-black font-mono ${getTimeColor()} ${percentage < 25 ? 'animate-pulse' : ''}`}>
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-4 border-2 border-gray-700">
        <div 
          className={`bg-gradient-to-r ${getBarColor()} h-full rounded-full transition-all duration-100 ${percentage < 25 ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
