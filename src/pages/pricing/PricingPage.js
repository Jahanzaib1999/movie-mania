import React from "react";
import "./PricingPage.css";
import PricingCard from "../../components/PricingCard";
import { useState } from "react";
import ReactSwitch from "react-switch";
import Invoice from "../../components/Invoice";

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");
  const [selectedCard, setSelectedCard] = useState(null);

  const toggleBilling = () => {
    setBilling(billing === "monthly" ? "annual" : "monthly");
  };

  const selectCard = (index) => {
    setSelectedCard(index);
  };

  return (
    <div className="pricing-page">
      <h1 className="subtitle">Try out our free trial now for 10 days.</h1>
      <h2>Start your trial now, pick a plan later</h2>
      <h5>No credit card required. No obligation. No risk.</h5>
      <div className="billing-toggle">
        <div className="toggle">
          <p
            className={`toggle-text ${
              billing === "monthly" ? "toggle-text-selected" : ""
            }`}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </p>
          <ReactSwitch
            checked={billing === "annual"}
            onChange={toggleBilling}
            checkedIcon={false}
            uncheckedIcon={false}
            onColor="#554cd9"
          />
          <p
            className={`toggle-text ${
              billing === "annual" ? "toggle-text-selected" : ""
            }`}
            onClick={() => setBilling("annual")}
          >
            Annual
          </p>
        </div>
      </div>
      <h5>Choose a plan </h5>
      <div className="pricing-cards">
        <PricingCard
          key={1}
          name="Free"
          amount={billing === "monthly" ? 0 : 0}
          annual={billing === "annual"}
          features={["Feature 1", "Feature 2", "Feature 3"]}
          selected={selectedCard === 0}
          onClick={() => selectCard(0)}
          className={selectedCard === 0 ? "selected-card" : ""}
        />
        <PricingCard
          key={2}
          name="Basic"
          amount={billing === "monthly" ? 10 : 8}
          annual={billing === "annual"}
          features={["Feature 1", "Feature 2", "Feature 3"]}
          selected={selectedCard === 1}
          onClick={() => selectCard(1)}
          className={selectedCard === 1 ? "selected-card" : ""}
        />
        <PricingCard
          key={3}
          name="Professional"
          amount={billing === "monthly" ? 20 : 16}
          annual={billing === "annual"}
          features={["Feature 1", "Feature 2", "Feature 3", "Feature 4"]}
          selected={selectedCard === 2}
          onClick={() => selectCard(2)}
          className={selectedCard === 2 ? "selected-card" : ""}
        />
        <PricingCard
          key={4}
          name="Agency"
          amount={billing === "monthly" ? 30 : 24}
          annual={billing === "annual"}
          features={[
            "Feature 1",
            "Feature 2",
            "Feature 3",
            "Feature 4",
            "Feature 5",
          ]}
          selected={selectedCard === 3}
          onClick={() => selectCard(3)}
          className={selectedCard === 3 ? "selected-card" : ""}
        />
      </div>

      <Invoice selectedCard={selectedCard} billing={billing} />

      <button className="proceed-button button-section" onClick={() => {}}>
        Proceed
      </button>
    </div>
  );
}
