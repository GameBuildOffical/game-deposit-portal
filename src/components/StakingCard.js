import React, { useState, useEffect } from "react";
import "./StakingCard.css";

const StakingCard = () => {
  const [tab, setTab] = useState("deposit"); // Active tab: "deposit" or "withdraw"
  const [amount, setAmount] = useState(0); // Handle the deposit/withdraw amount
  const [balance, setBalance] = useState(1.1); // Example balance
  const [staked, setStaked] = useState(0); // Example staked amount

  const handleTabChange = (selectedTab) => {
    setTab(selectedTab);
    setAmount(0); // Reset amount on tab change
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleMaxClick = () => {
    setAmount(balance); // Use max balance
  };

  const handleActionClick = () => {
    if (tab === "deposit") {
      alert(`You have deposited ${amount} TON.`);
      // Logic for deposit
    } else {
      alert(`You have withdrawn ${amount} TON.`);
      // Logic for withdraw
    }
  };

  useEffect(() => {
    const sliderInput = document.querySelector(".slider input");
    const sliderProgress = document.querySelector(".slider-progress");

    // Update the slider progress based on the value
    const updateSliderProgress = () => {
      const value =
        (sliderInput.value - sliderInput.min) /
        (sliderInput.max - sliderInput.min);
      sliderProgress.style.width = `${value * 100}%`;
    };

    // Initial update
    updateSliderProgress();

    // Add event listener to update the progress bar as the user changes the slider value
    sliderInput.addEventListener("input", updateSliderProgress);

    // Clean up the event listener when the component unmounts
    return () => {
      sliderInput.removeEventListener("input", updateSliderProgress);
    };
  }, [amount]);

  return (
    <div className="tab-wrap">
      <input
        type="radio"
        id="tab1"
        name="tabGroup1"
        className="tab"
        checked={tab === "deposit"}
        onChange={() => handleTabChange("deposit")}
      />
      <label htmlFor="tab1">Deposit</label>

      <input
        type="radio"
        id="tab2"
        name="tabGroup1"
        className="tab"
        checked={tab === "withdraw"}
        onChange={() => handleTabChange("withdraw")}
      />
      <label htmlFor="tab2">Withdraw</label>

      {/* Deposit Content */}
      {tab === "deposit" && (
        <div className="tab__content">
          <div className="tab-header">
            <p className="label">You Deposit</p>
            <div onClick={handleMaxClick} className="max-button">
              Use MAX
            </div>
          </div>
          <h1>
            <div className="input-container">
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                min="0"
                max={balance}
              />
              <span className="currency">in GAME</span>
            </div>
          </h1>
          <div className="slider">
            <input
              type="range"
              min="0"
              max={balance}
              step="0.01"
              value={amount}
              onChange={handleAmountChange}
            />
            <div className="slider-progress">
              <div className="slider-thumb"></div>
            </div>
          </div>
          <p>Selected: {amount} TON</p>

          <div className="staking-info">
            <p>Balance: {balance} TON</p>
          </div>

          <button
            onClick={handleActionClick}
            className="action-button"
            disabled={amount < 1}
          >
            Deposit Game Token
          </button>
        </div>
      )}

      {/* Withdraw Content */}
      {tab === "withdraw" && (
        <div className="tab__content">
          <div className="tab-header">
            <p className="label">You Withdraw</p>
            <div onClick={handleMaxClick} className="max-button">
              Use MAX
            </div>
          </div>

          <h1>
            <div className="input-container">
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                min="0"
                max={balance}
              />
              <span className="currency">in GAME</span>
            </div>
          </h1>
          <div className="slider">
            <input
              type="range"
              min="0"
              max={balance}
              step="0.01"
              value={amount}
              onChange={handleAmountChange}
            />
            <div className="slider-progress">
              <div className="slider-thumb"></div>
            </div>
          </div>
          <p>Selected: {amount} TON</p>

          <div className="staking-info">
            <p>Balance: {balance} TON</p>
          </div>

          <button
            onClick={handleActionClick}
            className="action-button"
            disabled={amount < 1}
          >
            Withdraw Game Token
          </button>
        </div>
      )}
    </div>
  );
};

export default StakingCard;
