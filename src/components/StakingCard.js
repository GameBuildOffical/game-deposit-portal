import React, { useState, useEffect, useRef } from "react";
import "./StakingCard.css";

const StakingCard = () => {
  const [tab, setTab] = useState("deposit"); // Active tab: "deposit" or "withdraw"
  const [amount, setAmount] = useState(0); // Handle the deposit/withdraw amount
  const [balance, setBalance] = useState(1.1); // Example balance
  const sliderInputRef = useRef(null); // Ref for slider input
  const sliderProgressRef = useRef(null); // Ref for slider progress

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
      alert(`You have deposited ${amount} GAME.`);
      // Logic for deposit
    } else {
      alert(`You have withdrawn ${amount} GAME.`);
      // Logic for withdraw
    }
  };

  useEffect(() => {
    const sliderInput = sliderInputRef.current;
    const sliderProgress = sliderProgressRef.current;

    // Update the slider progress based on the value
    const updateSliderProgress = () => {
      const minValue = 0;
      const maxValue = sliderInput.max;
      const visualOffset = 0.08; // 8% offset

      // Get the slider's actual value
      let value = sliderInput.value;

      // Calculate the normalized value (0 to 1 scale) for the progress bar
      let normalizedValue = (value - minValue) / (maxValue - minValue);

      // Apply the 8% offset to the visual slider progress
      let visualProgress = normalizedValue * (1 - visualOffset) + visualOffset;

      // Update the width of the progress bar
      sliderProgress.style.width = `${visualProgress * 100}%`;
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
                type="text" // Change to "text" for better formatting
                value={amount}
                onChange={handleAmountChange}
                inputMode="numeric" // Keep numeric input mode
                placeholder="Enter amount"
                min="0"
                max={balance}
              />
              <span className="currency">in GAME</span>
            </div>
          </h1>
          <div className="slider">
            <input
              ref={sliderInputRef} // Attach the ref to the slider input
              type="range"
              min="0"
              max={balance}
              step="0.01"
              value={amount}
              onChange={handleAmountChange}
            />
            <div ref={sliderProgressRef} className="slider-progress">
              <div className="slider-thumb"></div>
            </div>
          </div>

          <div className="staking-info">
            <p>Balance: {balance} GAME</p>
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
                type="text" // Change to "text" for better formatting
                value={amount}
                onChange={handleAmountChange}
                inputMode="numeric" // Keep numeric input mode
                placeholder="Enter amount"
                min="0"
                max={balance}
              />
              <span className="currency">in GAME</span>
            </div>
          </h1>
          <div className="slider">
            <input
              ref={sliderInputRef} // Attach the ref to the slider input
              type="range"
              min="0"
              max={balance}
              step="0.01"
              value={amount}
              onChange={handleAmountChange}
            />
            <div ref={sliderProgressRef} className="slider-progress">
              <div className="slider-thumb"></div>
            </div>
          </div>

          <div className="staking-info">
            <p>Balance: {balance} GAME</p>
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
