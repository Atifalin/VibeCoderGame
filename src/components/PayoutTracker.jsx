import { useState, useEffect } from 'react';

export default function PayoutTracker() {
  const [payouts, setPayouts] = useState([]);
  
  useEffect(() => {
    // Listen for payout events
    const handlePayout = (event) => {
      const newPayout = {
        id: Date.now(),
        amount: event.detail.amount,
        timestamp: Date.now(),
      };
      
      setPayouts(prev => [newPayout, ...prev].slice(0, 5)); // Keep last 5
      
      // Remove after 10 seconds
      setTimeout(() => {
        setPayouts(prev => prev.filter(p => p.id !== newPayout.id));
      }, 10000);
    };
    
    window.addEventListener('payout', handlePayout);
    return () => window.removeEventListener('payout', handlePayout);
  }, []);
  
  if (payouts.length === 0) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-30 space-y-2">
      {payouts.map((payout, idx) => (
        <div
          key={payout.id}
          className="codepen-card bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-sm px-6 py-3 animate-slide-in-right"
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">💰</span>
            <div>
              <div className="text-2xl font-black text-white neon-glow">
                +${payout.amount}
              </div>
              <div className="text-xs text-white/80 font-mono">PAYMENT RECEIVED</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
