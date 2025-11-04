import { useGame } from '../context/GameContext';
import { useState, useEffect } from 'react';

export default function Leaderboard() {
  const { getLeaderboard, setScreen } = useGame();
  const [leaderboard, setLeaderboard] = useState([]);
  
  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, [getLeaderboard]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] grid-bg p-8">
      <div className="max-w-5xl mx-auto">
        <div className="codepen-card p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-mono">
              {'<LEADERBOARD />'}
            </h1>
            <button
              onClick={() => setScreen('landing')}
              className="wynncraft-btn bg-red-500 text-white border-red-600"
            >
              ← Back
            </button>
          </div>
          <p className="text-gray-400 font-mono text-sm">// Top 10 Vibe Coders</p>
        </div>
        
        {leaderboard.length === 0 ? (
          <div className="codepen-card p-12 text-center">
            <p className="text-2xl text-gray-300 font-mono mb-4">// No entries yet</p>
            <p className="text-gray-400">Be the first to make it to the leaderboard!</p>
          </div>
        ) : (
          <div className="codepen-card p-6">
            <table className="w-full">
              <thead className="border-b-2 border-purple-500">
                <tr>
                  <th className="px-6 py-4 text-left text-purple-400 font-bold font-mono">Rank</th>
                  <th className="px-6 py-4 text-left text-purple-400 font-bold font-mono">Player</th>
                  <th className="px-6 py-4 text-left text-green-400 font-bold font-mono">Money</th>
                  <th className="px-6 py-4 text-left text-blue-400 font-bold font-mono">Day</th>
                  <th className="px-6 py-4 text-left text-yellow-400 font-bold font-mono">Requests</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => {
                  const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''; 
                  return (
                  <tr 
                    key={index}
                    className={`border-b border-gray-700 transition-colors ${
                      index === 0 ? 'bg-yellow-500/10' :
                      index === 1 ? 'bg-gray-500/10' :
                      index === 2 ? 'bg-orange-500/10' :
                      'hover:bg-gray-800/30'
                    }`}
                  >
                    <td className="px-6 py-4 font-mono text-gray-300">
                      <span className={`text-2xl font-bold ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-orange-400' :
                        'text-gray-600'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white font-mono">{entry.name}</td>
                    <td className="px-6 py-4 text-green-400 font-bold font-mono">${entry.money.toLocaleString()}</td>
                    <td className="px-6 py-4 text-blue-400 font-mono">Day {entry.day}</td>
                    <td className="px-6 py-4 text-yellow-400 font-mono">{entry.completedRequests}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
