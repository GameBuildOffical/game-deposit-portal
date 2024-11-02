import React, { useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";

import { GAME_STAKING_ADDRESS, GAME_TOKEN_ADDRESS } from "./Contract";
import { STAKING_ABI } from "../abis/GameStakingABI";
import { TOKEN_ABI } from "../abis/GameTokenABI";
import "./InfoCard.css";

// Function to format large numbers
const formatLargeNumber = (amount) => {
  if (!amount) return "$0.00";
  const num = parseFloat(formatUnits(amount, 18));
  if (num >= 1_000_000_000) {
    return `$ ${(num / 1_000_000_000).toFixed(1)}B`;
  } else if (num >= 1_000_000) {
    return `$ ${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `$ ${(num / 1_000).toFixed(1)}K`;
  } else {
    return `$ ${num.toFixed(2)}`;
  }
};

const InfoCard = () => {
  const { address } = useAccount();

  // Get user's total deposited balance from the Game Token contract
  const {
    data: userTokenBalance,
    isPending: isUserBalanceLoading,
    error: userBalanceError,
  } = useReadContract({
    address: GAME_STAKING_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  // Get total staked amount in the network from the Game Staking contract
  const {
    data: totalStaked,
    isPending: isTotalStakedLoading,
    error: totalStakedError,
  } = useReadContract({
    address: GAME_STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: "totalStaked",
  });

  // Get total number of stakers from the Game Staking contract
  const {
    data: stakerCount,
    isPending: isStakerCountLoading,
    error: stakerCountError,
  } = useReadContract({
    address: GAME_STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: "getStakerCount",
  });

  // Log any errors for debugging purposes
  if (userBalanceError) console.error("User Balance Error:", userBalanceError);
  if (totalStakedError) console.error("Total Staked Error:", totalStakedError);
  if (stakerCountError) console.error("Staker Count Error:", stakerCountError);

  return (
    <div>
      <p className="info-card-title">Protocol Details</p>
      <div className="info-card">
        <div className="protocol-details">
          {/* User's Total Deposited (from Game Token Contract) */}
          <div className="protocol-details-point">
            <div className="loader" data-active="false">
              <span>
                {isUserBalanceLoading ? (
                  <p className="text-h3">Loading...</p>
                ) : userBalanceError ? (
                  <p className="text-h3">Error</p>
                ) : (
                  <p className="text-h3">
                    {formatLargeNumber(userTokenBalance)}
                  </p>
                )}
              </span>
            </div>
            <p className="text-subtitle">Your Total Deposit</p>
          </div>

          {/* Network TVL (from Game Staking Contract) */}
          <div className="protocol-details-point">
            <div className="loader" data-active="false">
              <span>
                {isTotalStakedLoading ? (
                  <p className="text-h3">Loading...</p>
                ) : totalStakedError ? (
                  <p className="text-h3">Error</p>
                ) : (
                  <p className="text-h3">{formatLargeNumber(totalStaked)}</p>
                )}
              </span>
            </div>
            <p className="text-subtitle">Network TVL</p>
          </div>

          {/* Total Deposit Addresses Count (from Game Staking Contract) */}
          <div className="protocol-details-point">
            <div className="loader" data-active="false">
              <span>
                {isStakerCountLoading ? (
                  <p className="text-h3">Loading...</p>
                ) : stakerCountError ? (
                  <p className="text-h3">Error</p>
                ) : (
                  <p className="text-h3">{stakerCount?.toString() || "0"}</p>
                )}
              </span>
            </div>
            <p className="text-subtitle">Total Deposit Addresses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
