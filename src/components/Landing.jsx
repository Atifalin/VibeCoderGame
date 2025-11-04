import { useGame } from '../context/GameContext';
import logo from '../assets/svg/logo.svg';

export default function Landing() {
  const { startGame, setScreen } = useGame();
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] grid-bg flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="text-center max-w-4xl animate-slide-up relative z-10">
        {/* Logo and Title */}
        <div className="space-y-6">
          <div className="relative inline-block">
            <img src={logo} alt="Vibe Coder" className="w-32 h-32 mx-auto drop-shadow-2xl" />
            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
          </div>
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 glitch animate-float">
            VIBE CODER
          </h1>
          <p className="text-xl text-gray-400 font-mono">
            {'<'} Build apps • Earn money • Upgrade tools {' />'}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-mono">System Online</span>
          </div>
        </div>
        
        {/* Menu Buttons */}
        <div className="space-y-4 max-w-md mx-auto">
          <button
            onClick={startGame}
            className="wynncraft-btn w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-600 hover:from-green-400 hover:to-emerald-500 text-lg"
          >
            ▶ Start Game
          </button>
          
          <button
            onClick={() => setScreen('leaderboard')}
            className="wynncraft-btn w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 border-yellow-600 hover:from-yellow-400 hover:to-orange-400 text-lg"
          >
            ★ Leaderboard
          </button>
          
          <button
            onClick={() => setScreen('howToPlay')}
            className="wynncraft-btn w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-600 hover:from-blue-400 hover:to-cyan-400 text-lg"
          >
            ? How to Play
          </button>
        </div>
        
        {/* Footer */}
        <div className="text-gray-600 text-sm font-mono space-y-3 pt-8">
          <p className="text-yellow-400 font-bold animate-pulse">⚠️ Best played on desktop</p>
          <p className="text-gray-500">// A game about prompt engineering</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded">React</span>
            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded">Vite</span>
            <span className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded">Tailwind</span>
          </div>
          
          {/* Credits */}
          <div className="pt-4 border-t border-gray-800 space-y-1">
            <p className="text-gray-400 font-semibold">Created by</p>
            <p className="text-purple-400 font-bold">Mohammed Atif Ali Neranki</p>
            <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
              <a href="https://ezypath.in" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
                🌐 Ezypath.in
              </a>
              <span>•</span>
              <a href="mailto:vibecoder@ezypath.in" className="hover:text-indigo-400 transition-colors">
                ✉️ vibecoder@ezypath.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
