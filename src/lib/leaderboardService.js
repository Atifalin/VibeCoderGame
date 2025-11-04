import { supabase, isSupabaseEnabled } from './supabase';

export async function saveToLeaderboard(playerName, gameState) {
  const entry = {
    name: playerName,
    money: gameState.money,
    day: gameState.day,
    completed_requests: gameState.completedRequests,
    timestamp: new Date().toISOString(),
  };

  // Save to Supabase if enabled
  if (isSupabaseEnabled()) {
    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert([entry]);
      
      if (error) throw error;
      console.log('✅ Saved to global leaderboard!');
      return true;
    } catch (error) {
      console.error('Failed to save to Supabase:', error);
      // Fallback to localStorage
      saveToLocalStorage(entry);
      return false;
    }
  } else {
    // Use localStorage as fallback
    saveToLocalStorage(entry);
    return false;
  }
}

export async function getLeaderboard() {
  // Try to get from Supabase first
  if (isSupabaseEnabled()) {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('money', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      // Format data to match expected structure
      return data.map(entry => ({
        name: entry.name,
        money: entry.money,
        day: entry.day,
        completedRequests: entry.completed_requests,
        timestamp: new Date(entry.timestamp).getTime(),
      }));
    } catch (error) {
      console.error('Failed to load from Supabase:', error);
      // Fallback to localStorage
      return getFromLocalStorage();
    }
  } else {
    return getFromLocalStorage();
  }
}

function saveToLocalStorage(entry) {
  try {
    const leaderboard = JSON.parse(localStorage.getItem('vibeCoderLeaderboard') || '[]');
    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.money - a.money);
    const top10 = leaderboard.slice(0, 10);
    localStorage.setItem('vibeCoderLeaderboard', JSON.stringify(top10));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

function getFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem('vibeCoderLeaderboard') || '[]');
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
    return [];
  }
}
