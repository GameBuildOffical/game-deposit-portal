import React, { useState, useEffect } from "react";
import "./InfoCard.css";

const InfoCard = () => {
  const [totalDeposit, setTotalDeposit] = useState(null);
  const [networkTVL, setNetworkTVL] = useState(null);
  const [totalAddresses, setTotalAddresses] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data retrieval with a delay to simulate network request
  useEffect(() => {
    const mockFetchData = () => {
      setTimeout(() => {
        setTotalDeposit("$1,500");
        setNetworkTVL("$300M");
        setTotalAddresses("90,000");
        setLoading(false); // Stop loading once data is set
      }, 1000); // 1 second delay to simulate API call
    };

    mockFetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div>
      <p className="info-card-title">Protocol Details</p>
      <div className="info-card">
        <div className="protocol-details">
          {/* Total Deposit */}
          <div className="protocol-details-point">
            <div className="loader" data-active="false">
              <span>
                <p className="text-h3">{totalDeposit}</p>
              </span>
            </div>
            <p className="text-subtitle">Your Total Deposit</p>
          </div>

          {/* Network TVL */}
          <div className="protocol-details-point">
            <div className="loader" data-active="false">
              <span>
                <p className="text-h3">{networkTVL}</p>
              </span>
            </div>
            <p className="text-subtitle">Network TVL</p>
          </div>

          {/* Total Deposit Addresses */}
          <div className="protocol-details-point">
            <div className="loader" data-active="false">
              <span>
                <p className="text-h3">{totalAddresses}</p>
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
