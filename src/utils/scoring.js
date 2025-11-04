/**
 * Scoring utilities for Vibe Coder game
 * These functions calculate prompt completeness and payout
 * 
 * TO INTEGRATE REAL AI:
 * Replace scorePrompt() with an API call to your AI service
 * The AI should return a completeness score (0-100) and token count
 */

/**
 * Score a prompt based on blocks, request requirements, and token budget
 * @param {Array<string>} promptBlocks - Array of selected prompt block strings
 * @param {Object} request - Client request object with required_keywords and tokenBudget
 * @param {number} toolTier - AI tool tier (0 = base, 1 = CoPilot, 2 = Windsurf, 3 = Cursor)
 * @param {number} tokenBudget - Maximum tokens allowed
 * @param {string} selectedModel - The AI model being used
 * @returns {Object} Score details including completeness, tokensUsed, and component scores
 */
export function scorePrompt(promptBlocks, request, toolTier, tokenBudget, selectedModel = 'gpt-3.5') {
  const promptText = promptBlocks.join(' ').toLowerCase();
  
  // Count notes - each note costs 10 tokens
  const notesCount = promptBlocks.filter(b => b.startsWith('Notes:')).length;
  const notesCost = notesCount * 10;
  
  // Model quality multiplier (more forgiving for starter model)
  const modelQuality = {
    'gpt-4o-mini': 0.95,
    'claude-sonnet': 1.0,
    'gpt-5-codex': 1.10,
    'claude-opus': 1.20,
    'grok-code': 1.15,
  }[selectedModel] || 1.0;
  
  // 1) Keyword match (60% weight) - Flexible matching
  const required = request.required_keywords || [];
  let matched = 0;
  
  for (const keyword of required) {
    const kwLower = keyword.toLowerCase();
    // Check for exact match or partial match in prompt
    if (promptText.includes(kwLower)) {
      matched++;
    } else {
      // Check for related terms
      const relatedTerms = {
        'todo': ['task', 'list', 'checklist'],
        'auth': ['login', 'signup', 'authentication', 'user'],
        'db': ['database', 'storage', 'sqlite', 'supabase', 'firebase'],
        'mobile': ['app', 'react native', 'flutter', 'ios', 'android'],
        'ecommerce': ['shop', 'store', 'product', 'cart', 'checkout'],
        'api': ['integration', 'service', 'endpoint'],
        'dark mode': ['theme', 'dark'],
        'push notifications': ['notification', 'push', 'alert'],
        'offline': ['offline support', 'local'],
        'stripe': ['payment', 'checkout', 'stripe payment'],
        'booking': ['reservation', 'appointment', 'schedule', 'calendar'],
        'dashboard': ['admin', 'panel', 'analytics'],
        'chatbot': ['chat', 'bot', 'messaging'],
        'landing': ['page', 'website', 'landing page'],
      };
      
      if (relatedTerms[kwLower]) {
        const hasRelated = relatedTerms[kwLower].some(term => promptText.includes(term));
        if (hasRelated) matched += 0.7; // Partial credit for related terms
      }
    }
  }
  
  const keywordScore = required.length ? Math.min(matched / required.length, 1) : 1;

  // 2) Structure score (30% weight) - Reward having key elements
  const hasLanguage = promptBlocks.some(b => /language:/i.test(b));
  const hasFramework = promptBlocks.some(b => /framework:/i.test(b));
  const hasProjectType = promptBlocks.some(b => /project:/i.test(b));
  const hasFeature = promptBlocks.some(b => /feature:|integration:|extra:/i.test(b));
  
  // Require actual selections for score
  let structureScore = 0;
  if (hasLanguage) structureScore += 0.35;
  if (hasFramework) structureScore += 0.35;
  if (hasProjectType) structureScore += 0.20;
  if (hasFeature) structureScore += 0.10;
  structureScore = Math.min(structureScore, 1.0);

  // 3) Length/clarity (10% weight) - penalty for exceeding tokenBudget
  const baseTokens = promptText.split(/\s+/).filter(w => w.length > 0).length;
  const tokensUsed = baseTokens + notesCost; // Add notes cost to total
  let clarityScore = 1;
  if (tokensUsed > tokenBudget) {
    clarityScore = Math.max(0.2, 1 - (tokensUsed - tokenBudget) / tokenBudget);
  } else {
    // Small penalty for being too short (under-utilizing budget)
    clarityScore = 1 - Math.max(0, (tokenBudget - tokensUsed) / (tokenBudget * 4));
  }

  // Aggregate completeness score (0-100) with model quality
  const baseScore = (keywordScore * 0.6 + structureScore * 0.3 + clarityScore * 0.1);
  const completeness = Math.round(Math.min(100, baseScore * modelQuality * 100));

  return { 
    completeness, 
    tokensUsed, 
    keywordScore, 
    structureScore, 
    clarityScore,
    matchedKeywords: matched,
    totalKeywords: required.length
  };
}

/**
 * Calculate payout based on completeness score and other factors
 * @param {number} completeness - Completeness score (0-100)
 * @param {number} difficulty - Request difficulty (1-5)
 * @param {number} toolTier - AI tool tier (0-3)
 * @param {number} tokensUsed - Actual tokens used
 * @param {number} tokenBudget - Maximum tokens allowed
 * @returns {number} Payout amount in dollars
 */
export function calculatePayout(completeness, difficulty, toolTier, tokensUsed, tokenBudget) {
  const base = 50 * difficulty;
  const qualityMultiplier = completeness / 100;
  const toolBonus = 1 + (toolTier * 0.15);
  const tokenPenalty = Math.max(0.5, 1 - (tokensUsed / tokenBudget) * 0.5);
  const payout = Math.round(base * qualityMultiplier * toolBonus * tokenPenalty);
  return payout;
}

/**
 * Get feedback on which keywords are missing
 * @param {Array<string>} promptBlocks - Array of selected prompt block strings
 * @param {Array<string>} requiredKeywords - Required keywords from request
 * @returns {Object} Object with matched and missing keywords
 */
export function getKeywordFeedback(promptBlocks, requiredKeywords) {
  const promptText = promptBlocks.join(' ').toLowerCase();
  const matched = [];
  const missing = [];
  
  requiredKeywords.forEach(keyword => {
    if (promptText.includes(keyword.toLowerCase())) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  return { matched, missing };
}

/**
 * Constants for game tuning
 */
export const GAME_CONSTANTS = {
  BASE_PAYOUT: 50,
  TOOL_BONUS_MULTIPLIER: 0.15,
  MIN_TOKEN_PENALTY: 0.5,
  KEYWORD_WEIGHT: 0.6,
  STRUCTURE_WEIGHT: 0.3,
  CLARITY_WEIGHT: 0.1,
  DAY_DURATION_MS: 180000, // 3 minutes = 1 day (180000ms)
  DAY_BONUS_THRESHOLD: 1000, // Money target per day
  DAY_BONUS_AMOUNT: 200,
  EXTEND_DAY_COST: 300,
};
