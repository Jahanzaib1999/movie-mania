import React from "react";
import "./PricingCard.css";
import { BsPatchCheck } from "react-icons/bs";

export default function PricingCard({
  name,
  amount,
  annual,
  features,
  selected,
  onClick,
}) {
  const cardClasses = `pricing-card ${selected ? "selected" : ""}`;
  return (
    <div className="pricing-card-container">
      <div className={cardClasses} onClick={onClick}>
        <div className="pricing-header">
          <h3 className="header-title">{name}</h3>
        </div>
        <div className="body">
          <p className="amount">
            A${amount}/mo{" "}
            {annual && name !== "Free" && (
              <small className="saving">saving 20%</small>
            )}
          </p>
          {annual && name !== "Free" && (
            <p className="bill-msg">Billed Anually as ${amount * 12}/year</p>
          )}
          <ul className="features-list">
            {features.map((feature, index) => (
              <>
                <div className="feature">
                  <li key={index} className="feature-item">
                    {<BsPatchCheck className="tick" />}
                    {feature}
                  </li>
                </div>
              </>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
