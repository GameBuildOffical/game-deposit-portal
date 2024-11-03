import React, { useState, useEffect, useRef } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "ethers";
import "./StakingCard.css";
import logo from "../assets/images/gamebuildlogo.png";
import { GAME_TOKEN_ADDRESS, GAME_STAKING_ADDRESS } from "./Contract";
import { STAKING_ABI } from "../abis/GameStakingABI";
import { TOKEN_ABI } from "../abis/GameTokenABI";

const StakingCard = () => {
  const { address } = useAccount();
  const [tab, setTab] = useState("deposit");
  const [amount, setAmount] = useState(0);
  const [approvalInProgress, setApprovalInProgress] = useState(false);
  const sliderInputRef = useRef(null);
  const sliderProgressRef = useRef(null);

  // Fetch balances for Deposit and Withdraw tabs
  const { data: depositBalanceRaw } = useReadContract({
    address: GAME_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });
  const { data: withdrawBalanceRaw } = useReadContract({
    address: GAME_STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  const depositBalance = depositBalanceRaw
    ? parseFloat(formatUnits(depositBalanceRaw, 18))
    : 0;
  const withdrawBalance = withdrawBalanceRaw
    ? parseFloat(formatUnits(withdrawBalanceRaw, 18))
    : 0;

  // Approve function
  const { write: writeApprove, isLoading: isApproving } = useWriteContract({
    abi: TOKEN_ABI,
    address: GAME_TOKEN_ADDRESS,
    functionName: "approve",
    onSuccess(data) {
      console.log("Approval successful:", data);
      setApprovalInProgress(false);
      initiateStake(); // Call stake after approval
    },
    onError(error) {
      console.error("Approval failed:", error);
      setApprovalInProgress(false);
    },
  });

  // Stake function
  const { write: writeStake } = useWriteContract({
    abi: STAKING_ABI,
    address: GAME_STAKING_ADDRESS,
    functionName: "stake",
    onSuccess(data) {
      console.log("Stake successful:", data);
    },
    onError(error) {
      console.error("Staking failed:", error);
    },
  });

  const initiateStake = () => {
    console.log("Initiating staking with amount:", amount);
    const parsedAmount = parseUnits(amount.toString(), 18);
    if (writeStake) {
      writeStake({ args: [parsedAmount] });
    } else {
      console.error("Stake function is not available.");
    }
  };

  const handleTabChange = (selectedTab) => {
    setTab(selectedTab);
    setAmount(0);
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    if (value === "" || !isNaN(value)) {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    setAmount(tab === "deposit" ? depositBalance : withdrawBalance);
  };

  const handleActionClick = () => {
    if (tab === "deposit") {
      console.log("Initiating approval for staking...");
      const parsedAmount = parseUnits(amount.toString(), 18);
      setApprovalInProgress(true);

      // Call the approve function
      if (writeApprove) {
        writeApprove({
          args: [GAME_STAKING_ADDRESS, parsedAmount],
        });
        console.log("Approval transaction sent with amount:", amount);
      } else {
        console.error("Approve function is not available.");
        setApprovalInProgress(false);
      }
    } else {
      alert(`You have withdrawn ${amount} GAME.`);
      // Logic for withdraw
    }
  };

  useEffect(() => {
    const sliderInput = sliderInputRef.current;
    const sliderProgress = sliderProgressRef.current;

    const updateSliderProgress = () => {
      const minValue = 0;
      const maxValue = sliderInput.max;
      const visualOffset = 0.08;
      let value = sliderInput.value;
      let normalizedValue = (value - minValue) / (maxValue - minValue);
      let visualProgress = normalizedValue * (1 - visualOffset) + visualOffset;
      sliderProgress.style.width = `${visualProgress * 100}%`;
    };

    updateSliderProgress();
    sliderInput.addEventListener("input", updateSliderProgress);
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
            disabled={approvalInProgress || amount < 1 || isApproving}
          >
            <img src={logo} alt="logo" className="button-logo" />
            {isApproving ? "Approving..." : "Deposit Game Token"}
          </button>
        </div>
      )}
    </div>
  );
};

export default StakingCard;
