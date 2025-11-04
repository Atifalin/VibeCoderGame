import { GameProvider, useGame } from './context/GameContext';
import Landing from './components/Landing';
import PlayScreen from './components/PlayScreen';
import Upgrades from './components/Upgrades';
import Leaderboard from './components/Leaderboard';
import DayEnd from './components/DayEnd';
import HowToPlay from './components/HowToPlay';
import { Toaster } from 'react-hot-toast';

function GameRouter() {
  const { screen } = useGame();
  
  switch (screen) {
    case 'landing':
      return <Landing />;
    case 'play':
      return <PlayScreen />;
    case 'upgrades':
      return <Upgrades />;
    case 'leaderboard':
      return <Leaderboard />;
    case 'dayEnd':
      return <DayEnd />;
    case 'howToPlay':
      return <HowToPlay />;
    default:
      return <Landing />;
  }
}

function App() {
  return (
    <GameProvider>
      <GameRouter />
      <Toaster position="top-right" />
    </GameProvider>
  );
}

export default App;
