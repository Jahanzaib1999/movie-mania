import React from "react";
import "./Invoice.css";

export default function Invoice({ selectedCard, billing }) {
  const cards = [
    { name: "Free", amount: 0 },
    { name: "Basic", amount: billing === "monthly" ? 10 : 8 },
    { name: "Professional", amount: billing === "monthly" ? 20 : 16 },
    { name: "Agency", amount: billing === "monthly" ? 30 : 24 },
  ];
  return (
    <div className="invoice-container">
      <table className="invoice-table">
        <thead>
          <tr>
            <th colSpan="2">Invoice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Plan:</td>
            <td>{selectedCard ? cards[selectedCard].name : "Free"}</td>
          </tr>
          <tr>
            <td>Billing Cycle:</td>
            <td>{billing === "monthly" ? "Monthly" : "Annual"}</td>
          </tr>
          <tr>
            <td>Amount:</td>
            <td>
              $
              {selectedCard
                ? billing === "monthly"
                  ? cards[selectedCard].amount
                  : cards[selectedCard].amount * 12
                : 0}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
