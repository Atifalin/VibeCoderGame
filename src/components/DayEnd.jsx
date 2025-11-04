import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GAME_CONSTANTS } from '../utils/scoring';

export default function DayEnd() {
  const { gameState, nextDay, extendDay, saveToLeaderboard, setScreen } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);
  
  const metTarget = gameState.money >= GAME_CONSTANTS.DAY_BONUS_THRESHOLD * gameState.day;
  const bonus = metTarget ? GAME_CONSTANTS.DAY_BONUS_AMOUNT : 0;
  const canExtend = gameState.money >= GAME_CONSTANTS.EXTEND_DAY_COST;
  
  const handleSaveScore = () => {
    if (playerName.trim()) {
      saveToLeaderboard(playerName.trim());
      setSaved(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Day {gameState.day} Complete! 🎉
        </h1>
        
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Performance</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Money</p>
                <p className="text-3xl font-bold text-green-600">${gameState.money}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Requests Completed</p>
                <p className="text-3xl font-bold text-indigo-600">{gameState.completedRequests}</p>
              </div>
            </div>
          </div>
          
          {/* Day Bonus */}
          {metTarget ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
              <p className="text-lg font-semibold text-green-800 mb-2">
                🎯 Target Met! Bonus Earned!
              </p>
              <p className="text-3xl font-bold text-green-600">+${bonus}</p>
            </div>
          ) : (
            <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-6 text-center">
              <p className="text-lg font-semibold text-orange-800">
                Target: ${GAME_CONSTANTS.DAY_BONUS_THRESHOLD * gameState.day}
              </p>
              <p className="text-sm text-orange-600">Keep going to earn the day bonus!</p>
            </div>
          )}
          
          {/* Save to Leaderboard */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Save Your Score</h3>
            {!saved ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveScore()}
                  placeholder="Enter your name..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  maxLength={20}
                />
                <button
                  onClick={handleSaveScore}
                  disabled={!playerName.trim()}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="text-green-600 font-semibold text-center">✓ Score saved to leaderboard!</p>
            )}
          </div>
          
          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={nextDay}
              className="py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold text-lg"
            >
              Continue to Day {gameState.day + 1}
            </button>
            
            <button
              onClick={extendDay}
              disabled={!canExtend}
              className={`py-4 rounded-lg font-bold text-lg transition-colors ${
                canExtend
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Extend Day (-${GAME_CONSTANTS.EXTEND_DAY_COST})
            </button>
          </div>
          
          <button
            onClick={() => setScreen('landing')}
            className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Exit to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
