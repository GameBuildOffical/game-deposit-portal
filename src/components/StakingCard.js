import React, { useState, useEffect, useRef } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "ethers"; // Import formatUnits
import "./StakingCard.css";
import logo from "../assets/images/gamebuildlogo.png";
import { GAME_TOKEN_ADDRESS, GAME_STAKING_ADDRESS } from "./Contract";

const TOKEN_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const StakingCard = () => {
  const { address } = useAccount();
  const [tab, setTab] = useState("deposit"); // Active tab: "deposit" or "withdraw"
  const [amount, setAmount] = useState(0); // Handle the deposit/withdraw amount
  const sliderInputRef = useRef(null); // Ref for slider input
  const sliderProgressRef = useRef(null); // Ref for slider progress

  // Fetch the user's token balance from GAME_TOKEN_ADDRESS for the Deposit tab
  const { data: depositBalanceRaw } = useReadContract({
    address: GAME_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  // Fetch the user's staked balance from GAME_STAKING_ADDRESS for the Withdraw tab
  const { data: withdrawBalanceRaw } = useReadContract({
    address: GAME_STAKING_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  // Convert raw balances to human-readable format
  const depositBalance = depositBalanceRaw
    ? parseFloat(formatUnits(depositBalanceRaw, 18))
    : 0;
  const withdrawBalance = withdrawBalanceRaw
    ? parseFloat(formatUnits(withdrawBalanceRaw, 18))
    : 0;

  const handleTabChange = (selectedTab) => {
    setTab(selectedTab);
    setAmount(0); // Reset amount on tab change
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleMaxClick = () => {
    setAmount(tab === "deposit" ? depositBalance : withdrawBalance);
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
                type="text"
                value={amount}
                onChange={handleAmountChange}
                inputMode="numeric"
                placeholder="Enter amount"
                min="0"
                max={depositBalance}
              />
              <span className="currency">in GAME</span>
            </div>
          </h1>
          <div className="slider">
            <input
              ref={sliderInputRef}
              type="range"
              min="0"
              max={depositBalance}
              step="0.01"
              value={amount}
              onChange={handleAmountChange}
            />
            <div ref={sliderProgressRef} className="slider-progress">
              <div className="slider-thumb"></div>
            </div>
          </div>

          <div className="staking-info">
            <p>Balance: {depositBalance} GAME</p>
          </div>

          <button
            onClick={handleActionClick}
            className="action-button"
            disabled={amount < 1}
          >
            <img src={logo} alt="logo" className="button-logo" />
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
                type="text"
                value={amount}
                onChange={handleAmountChange}
                inputMode="numeric"
                placeholder="Enter amount"
                min="0"
                max={withdrawBalance}
              />
              <span className="currency">in GAME</span>
            </div>
          </h1>
          <div className="slider">
            <input
              ref={sliderInputRef}
              type="range"
              min="0"
              max={withdrawBalance}
              step="0.01"
              value={amount}
              onChange={handleAmountChange}
            />
            <div ref={sliderProgressRef} className="slider-progress">
              <div className="slider-thumb"></div>
            </div>
          </div>

          <div className="staking-info">
            <p>Balance: {withdrawBalance} GAME</p>
          </div>

          <button
            onClick={handleActionClick}
            className="action-button"
            disabled={amount < 1}
          >
            <img src={logo} alt="logo" className="button-logo" />
            Withdraw Game Token
          </button>
        </div>
      )}
    </div>
  );
};

export default StakingCard;
