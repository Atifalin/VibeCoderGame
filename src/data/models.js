export const AI_MODELS = {
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    icon: '🤖',
    speed: 'fast',
    quality: 0.95,
    tokenCost: 0.8,
    description: 'Fast & cheap',
    unlockAt: 0,
  },
  'claude-sonnet': {
    name: 'Claude Sonnet 4',
    icon: '📚',
    speed: 'medium',
    quality: 1.0,
    tokenCost: 1.2,
    description: 'Balanced reasoning',
    unlockAt: 0, // Unlocked at start
  },
  'gpt-5-codex': {
    name: 'GPT-5 Codex',
    icon: '💻',
    speed: 'medium',
    quality: 1.15,
    tokenCost: 1.5,
    description: 'Code specialist',
    unlockAt: 18,
  },
  'claude-opus': {
    name: 'Claude Opus 4.5',
    icon: '🎯',
    speed: 'slow',
    quality: 1.25,
    tokenCost: 2.0,
    description: 'Maximum quality',
    unlockAt: 30,
  },
  'grok-code': {
    name: 'Grok Code',
    icon: '⚡',
    speed: 'fast',
    quality: 1.20,
    tokenCost: 1.8,
    description: 'Fast & powerful',
    unlockAt: 45,
  },
};

export function getAvailableModels(completedRequests) {
  return Object.entries(AI_MODELS)
    .filter(([_, model]) => completedRequests >= model.unlockAt)
    .map(([id, model]) => ({ id, ...model }));
}
