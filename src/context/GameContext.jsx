import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import requestsData from '../data/requests.json';
import { GAME_CONSTANTS } from '../utils/scoring';
import * as leaderboardService from '../lib/leaderboardService';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

// Shuffle array helper
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const GameProvider = ({ children }) => {
  // Load from localStorage or use defaults
  const loadState = () => {
    try {
      const saved = localStorage.getItem('vibeCoderGameState');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load game state:', e);
    }
    return null;
  };

  const initialState = loadState() || {
    money: 0,
    credits: 100,
    day: 1,
    timeRemaining: GAME_CONSTANTS.DAY_DURATION_MS,
    currentRequestIndex: 0,
    completedRequests: 0,
    toolTier: 0, // 0 = base, 1 = CoPilot, 2 = Windsurf, 3 = Cursor
    upgrades: {
      revealKeywords: false,
      keywordRevealsLeft: 0, // Temporary reveals (3 uses)
      copilot: false,
      windsurf: false,
      cursor: false,
      extraTokens: 0,
      fasterDeploy: false,
      selfHosted: false,
      permanentNotes: 1, // Permanent notes limit (starts at 1, max 5)
      tempNotesLeft: 0, // Temporary notes boost (3 uses, gives +1)
      unlockedBlocks: 'basic', // 'basic', 'intermediate', 'advanced', 'all'
    },
    consecutiveBadDeploys: 0,
    selectedModel: 'gpt-4o-mini', // Current AI model
    requests: shuffleArray(requestsData),
  };

  const [gameState, setGameState] = useState(initialState);
  const [screen, setScreen] = useState('landing'); // landing, play, upgrades, leaderboard, dayEnd, howToPlay
  const [isPaused, setIsPaused] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('vibeCoderGameState', JSON.stringify(gameState));
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }, [gameState]);

  // Day timer
  useEffect(() => {
    if (screen !== 'play' || isPaused) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const newTime = prev.timeRemaining - 100;
        if (newTime <= 0) {
          // Day ended
          setScreen('dayEnd');
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [screen, isPaused]);

  const startGame = useCallback(() => {
    setGameState({
      money: 0,
      credits: 100,
      day: 1,
      timeRemaining: GAME_CONSTANTS.DAY_DURATION_MS,
      currentRequestIndex: 0,
      completedRequests: 0,
      toolTier: 0,
      upgrades: {
        revealKeywords: false,
        keywordRevealsLeft: 0,
        copilot: false,
        windsurf: false,
        cursor: false,
        extraTokens: 0,
        fasterDeploy: false,
        selfHosted: false,
        notesLimit: 1,
        unlockedBlocks: 'basic',
      },
      consecutiveBadDeploys: 0,
      selectedModel: 'gpt-4o-mini',
      requests: shuffleArray(requestsData),
    });
    setScreen('play');
  }, []);

  const completeRequest = useCallback((payout, score) => {
    setGameState(prev => {
      // Track bad deploys (score < 40%)
      const isBadDeploy = score < 40;
      const newBadCount = isBadDeploy ? prev.consecutiveBadDeploys + 1 : 0;
      
      // Game over if 3 consecutive bad deploys
      if (newBadCount >= 3) {
        setTimeout(() => {
          alert('❌ GAME OVER!\n\nYou submitted 3 consecutive poor quality prompts.\nThe client has terminated your contract.\n\nTry to maintain quality above 40%!');
          setScreen('landing');
        }, 100);
      }
      
      const newCompleted = prev.completedRequests + 1;
      
      // Decrement temporary upgrades
      const newRevealsLeft = Math.max(0, prev.upgrades.keywordRevealsLeft - 1);
      const newTempNotesLeft = Math.max(0, prev.upgrades.tempNotesLeft - 1);
      
      // Progressive block unlocking based on completed requests (faster progression)
      let newUnlockedBlocks = 'basic';
      if (newCompleted >= 12) {
        newUnlockedBlocks = 'advanced';
      } else if (newCompleted >= 4) {
        newUnlockedBlocks = 'intermediate';
      }
      if (newUnlockedBlocks !== prev.upgrades.unlockedBlocks) {
        setTimeout(() => alert('🎉 NEW BLOCKS UNLOCKED!\n\nYou can now use more advanced prompt blocks!'), 500);
      }
      
      return {
        ...prev,
        money: prev.money + payout,
        completedRequests: newCompleted,
        currentRequestIndex: (prev.currentRequestIndex + 1) % prev.requests.length,
        consecutiveBadDeploys: newBadCount,
        upgrades: {
          ...prev.upgrades,
          keywordRevealsLeft: newRevealsLeft,
          tempNotesLeft: newTempNotesLeft,
          unlockedBlocks: newUnlockedBlocks,
        },
      };
    });
  }, []);

  const buyUpgrade = useCallback((upgradeName, cost) => {
    setGameState(prev => {
      if (prev.money < cost) return prev;
      
      const newUpgrades = { ...prev.upgrades };
      let newToolTier = prev.toolTier;
      
      if (upgradeName === 'copilot') {
        newUpgrades.copilot = true;
        newToolTier = Math.max(newToolTier, 1);
      } else if (upgradeName === 'windsurf') {
        newUpgrades.windsurf = true;
        newToolTier = Math.max(newToolTier, 2);
      } else if (upgradeName === 'cursor') {
        newUpgrades.cursor = true;
        newToolTier = Math.max(newToolTier, 3);
      } else if (upgradeName === 'extraTokens') {
        newUpgrades.extraTokens = (newUpgrades.extraTokens || 0) + 20;
      } else if (upgradeName === 'tempNotes') {
        // Temporary notes boost - 3 uses, gives +1 note
        newUpgrades.tempNotesLeft = 3;
      } else if (upgradeName === 'permanentNotes') {
        // Permanent notes increase (max 5 total)
        if (newUpgrades.permanentNotes < 5) {
          newUpgrades.permanentNotes = (newUpgrades.permanentNotes || 1) + 1;
        }
      } else if (upgradeName === 'revealKeywords') {
        newUpgrades.keywordRevealsLeft = 3; // Give 3 uses
        newUpgrades.revealKeywords = true;
      } else if (upgradeName === 'unlockAllBlocks') {
        newUpgrades.unlockedBlocks = 'all';
      } else {
        newUpgrades[upgradeName] = true;
      }
      
      return {
        ...prev,
        money: prev.money - cost,
        upgrades: newUpgrades,
        toolTier: newToolTier,
      };
    });
  }, []);

  const startNextDay = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      day: prev.day + 1,
      timeRemaining: GAME_CONSTANTS.DAY_DURATION_MS,
      completedRequests: 0,
    }));
    setScreen('play');
  }, []);

  const extendDay = useCallback(() => {
    const cost = 300;
    setGameState(prev => {
      if (prev.money < cost) return prev;
      return {
        ...prev,
        money: prev.money - cost,
        timeRemaining: prev.timeRemaining + 60000, // Add 1 minute
      };
    });
  }, []);

  const setModel = useCallback((model) => {
    setGameState(prev => ({
      ...prev,
      selectedModel: model,
    }));
  }, []);

  const saveToLeaderboard = useCallback((playerName) => {
    return leaderboardService.saveToLeaderboard(playerName, gameState);
  }, [gameState]);

  const getLeaderboard = useCallback(() => {
    return leaderboardService.getLeaderboard();
  }, []);

  return (
    <GameContext.Provider value={{
      gameState,
      screen,
      setScreen,
      isPaused,
      setIsPaused,
      startGame,
      completeRequest,
      buyUpgrade,
      nextDay: startNextDay,
      extendDay,
      saveToLeaderboard,
      getLeaderboard,
      setModel,
      getCurrentRequest: () => gameState.requests[gameState.currentRequestIndex],
    }}>
      {children}
    </GameContext.Provider>
  );
}
