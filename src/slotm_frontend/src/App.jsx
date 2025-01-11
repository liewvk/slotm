import React, { useState, useEffect } from 'react';

function App({ actor }) {
  const [result, setResult] = useState("? | ? | ?");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reward, setReward] = useState(null);
  const [message, setMessage] = useState("Good Luck!");
  const SPIN_COST = 10;

  const updateBalance = async () => {
    try {
      const currentBalance = await actor.getBalance();
      setBalance(Number(currentBalance));
    } catch (err) {
      console.error("Error getting balance:", err);
    }
  };

  useEffect(() => {
    updateBalance();
  }, []);

  const handleSpin = async () => {
    if (balance < SPIN_COST) {
      setError("You don't have enough balance to bet!");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage("Good Luck!");
      const spinResult = await actor.spin();
      
      const lines = spinResult.split("\n");
      const wonMatch = spinResult.match(/Won: (\d+)/);
      const isJackpot = spinResult.includes("JACKPOT!");

      // Extract just the symbols part
      let symbolsOnly;
      if (isJackpot) {
        symbolsOnly = lines[1].replace("🎰 Spin Result: ", "");
        setMessage("🌟 Congratulations! You Strike a JACKPOT! 🌟");
      } else {
        symbolsOnly = lines[0].replace("🎰 Spin Result: ", "");
      }
      setResult(symbolsOnly);

      if (wonMatch) {
        setReward(Number(wonMatch[1]));
      } else {
        setReward(null);
      }

      await updateBalance();
    } catch (err) {
      console.error("Error spinning:", err);
      setError("Failed to spin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🎰 ICP SLOT MACHINE 🎰</h1>
      
      <div className="slot-machine">
        <div className="side-lights left">
          {[...Array(8)].map((_, i) => (
            <div key={`left-${i}`} className="light" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        
        <div className="side-lights right">
          {[...Array(8)].map((_, i) => (
            <div key={`right-${i}`} className="light" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>

        <div className="balance-display">
          BALANCE: {balance !== null ? balance : "Loading..."} ICP
        </div>

        <div className="message-display">
          {message}
        </div>

        <div className="result-display">
          {result}
        </div>

        {reward && (
          <div className="reward-display">
            ✨ WON: {reward} ICP ✨
          </div>
        )}

        <div className="spin-cost">
          COST PER SPIN: {SPIN_COST} ICP
        </div>

        <button 
          className="spin-button-3d"
          onClick={handleSpin}
          disabled={loading || balance < SPIN_COST}
        >
          {loading ? "..." : "SPIN"}
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;