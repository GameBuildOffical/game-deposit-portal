import React, { useState, useEffect, useRef } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
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
  const [balanceRefreshTrigger, setBalanceRefreshTrigger] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const sliderInputRef = useRef(null);
  const sliderProgressRef = useRef(null);

  // Fetch balances for Deposit and Withdraw tabs
  const { data: depositBalanceRaw } = useReadContract({
    address: GAME_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
    watch: balanceRefreshTrigger, // Triggered on balance refresh
  });
  const { data: withdrawBalanceRaw } = useReadContract({
    address: GAME_STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
    watch: balanceRefreshTrigger, // Triggered on balance refresh
  });

  const depositBalance = depositBalanceRaw
    ? parseFloat(formatUnits(depositBalanceRaw, 18))
    : 0;
  const withdrawBalance = withdrawBalanceRaw
    ? parseFloat(formatUnits(withdrawBalanceRaw, 18))
    : 0;

  // Approve function
  const {
    writeContract: writeApprove,
    isPending: isApproving,
    isSuccess: isApprovalSuccess,
    data: approvalData,
  } = useWriteContract();

  // Stake function
  const {
    writeContract: writeStake,
    isPending: isStaking,
    data: stakingData,
  } = useWriteContract();

  const {
    writeContract: writeWithdraw,
    isPending: isWithdrawing,
    data: withdrawalData,
  } = useWriteContract();

  const {
    isLoading: isWithdrawingConfirming,
    isSuccess: isWithdrawingConfirmed,
  } = useWaitForTransactionReceipt({
    hash: withdrawalData,
  });

  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } =
    useWaitForTransactionReceipt({
      hash: approvalData,
    });

  const { isLoading: isStakingConfirming, isSuccess: isStakingConfirmed } =
    useWaitForTransactionReceipt({
      hash: stakingData,
    });

  useEffect(() => {
    if (isApprovalConfirmed) {
      initiateStake(); // Trigger staking after confirmation
    }
  }, [isApprovalConfirmed]); // Runs only when the approval transaction is confirmed

  useEffect(() => {
    if (isApprovalConfirmed) {
      console.log("----- staking confirming status:", isStakingConfirming);
    }
  }, [isStakingConfirming]); // Runs only when the approval transaction is confirmed

  useEffect(() => {
    console.log("is approvaal confirming:", isApprovalConfirming);
  }, [isApprovalConfirming]); // Dependency array with isSuccess to watch for changes

  useEffect(() => {
    console.log("Approval is success!", isApprovalSuccess);
  }, [isApprovalSuccess]); // Dependency array with isSuccess to watch for changes

  useEffect(() => {
    console.log("data of approval changed:", approvalData);
  }, [approvalData]); // Dependency array with isSuccess to watch for changes

  // Update balances after staking confirmation
  useEffect(() => {
    if (isStakingConfirmed) {
      setBalanceRefreshTrigger((prev) => prev + 1); // Trigger balance refresh
      setPopupMessage("Deposit completed successfully!");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000); // Hide popup after 10 seconds
    }
  }, [isStakingConfirmed]); // Runs only when the staking transaction is confirmed

  // Update balances after staking confirmation
  useEffect(() => {
    if (isWithdrawingConfirmed) {
      setBalanceRefreshTrigger((prev) => prev + 1); // Trigger balance refresh
      setPopupMessage("Withdrawal completed successfully!");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000); // Hide popup after 10 seconds
    }
  }, [isWithdrawingConfirmed]); // Runs only when the staking transaction is confirmed

  const initiateWithdraw = () => {
    if (writeWithdraw) {
      writeWithdraw({
        abi: STAKING_ABI,
        address: GAME_STAKING_ADDRESS,
        functionName: "withdraw",
        args: [parseUnits(amount.toString(), 18)],
      });
    } else {
      console.error("Withdraw function is not available.");
    }
  };

  const initiateStake = () => {
    if (writeStake) {
      writeStake({
        abi: STAKING_ABI,
        address: GAME_STAKING_ADDRESS,
        functionName: "stake",
        args: [parseUnits(amount.toString(), 18)],
      }); // Trigger staking
    } else {
      console.error("Stake function is not available.");
    }
  };

  const handleTabChange = (selectedTab) => {
    setTab(selectedTab);
    setAmount(selectedTab === "withdraw" ? withdrawBalance : 0);
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
      if (writeApprove) {
        writeApprove({
          abi: TOKEN_ABI,
          address: GAME_TOKEN_ADDRESS,
          functionName: "approve",
          args: [GAME_STAKING_ADDRESS, parseUnits(amount.toString(), 18)],
        }); // Trigger approval
      } else {
        console.error("Approve function is not available.");
      }
    } else if (tab === "withdraw") {
      console.log("Initiating withdrawal...");
      initiateWithdraw(); // Call the withdraw function when tab is "withdraw"
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
    <div>
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
              disabled={
                isApprovalConfirming || isStakingConfirming || amount < 1
              }
            >
              <img src={logo} alt="logo" className="button-logo" />
              {isApprovalConfirming
                ? "Approving..."
                : isStaking || isStakingConfirming
                ? "Making Deposit..."
                : "Deposit Game Token"}
            </button>
          </div>
        )}

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
              disabled={isWithdrawingConfirming || amount < 1}
            >
              <img src={logo} alt="logo" className="button-logo" />
              {isWithdrawingConfirming
                ? "Withdrawing..."
                : "Withdraw Game Token"}
            </button>
          </div>
        )}
      </div>
      {showPopup && <div className="popup-message">{popupMessage}</div>}
    </div>
  );
};

export default StakingCard;
