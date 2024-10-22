import React from "react";
import "./App.css";

function App() {
  return (
    <div className="staking-page">
      {/* Header */}
      <header className="header">
        <h1>Deposit your Game Token</h1>
      </header>

      {/* Staking Section */}
      <section className="staking-section">
        <h2>Deposit Your TON</h2>
        <p>Enter the amount of TON you want to stake below:</p>

        {/* Staking Form */}
        <form className="staking-form">
          <input type="number" placeholder="Amount of TON" />
          <button type="submit">Stake TON</button>
        </form>
      </section>

      {/* Rewards Section */}
      <section className="rewards-section">
        <h2>Your Rewards</h2>
        <p>Current Staked Amount: 100 TON</p>
        <p>Rewards Earned: 5 TON</p>
        <button>Claim Rewards</button>
      </section>

      {/* Unstake Section */}
      <section className="unstake-section">
        <h2>Unstake Your TON</h2>
        <p>Available to Unstake: 100 TON</p>
        <button>Unstake TON</button>
      </section>
    </div>
  );
}

export default App;
