import React, { useState } from "react";
import "../App.css";

const CalculatorComponent = () => {
  const [lowValue, setLowValue] = useState("");
  const [highValue, setHighValue] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const first = parseFloat(lowValue);
    const second = parseFloat(highValue);

    if (isNaN(first) || isNaN(second) || first <= 0 || second <= 0) {
      setResult({
        error: "Please enter valid positive numbers for both values.",
      });
      return;
    }

    if (first === second) {
      setResult({ error: "Both values are equal — no change." });
      return;
    }

    const isIncrease = second > first;
    // Always use first input as the base so both directions are comparable
    const percent = (Math.abs(second - first) / first) * 100;

    setResult({
      first,
      second,
      percent: percent.toFixed(2),
      isIncrease,
      low: Math.min(first, second),
      high: Math.max(first, second),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") calculate();
  };

  const handleSwap = () => {
    setLowValue(highValue);
    setHighValue(lowValue);
    setResult(null);
  };

  return (
    <div className="todo-container">
      <h1 className="calc-title">Calculator</h1>

      <div className="calc-form">
        <div className="calc-field">
          <label className="calc-label">First Value</label>
          <input
            type="number"
            className="todo-input"
            placeholder="Enter first value..."
            value={lowValue}
            onChange={(e) => setLowValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="calc-field">
          <label className="calc-label">Second Value</label>
          <input
            type="number"
            className="todo-input"
            placeholder="Enter second value..."
            value={highValue}
            onChange={(e) => setHighValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="calc-actions">
          <button className="add-button" onClick={calculate}>
            Calculate
          </button>
          <button className="add-button" onClick={handleSwap}>
            Swap
          </button>
        </div>
      </div>

      {result && (
        <div className="calc-result-card">
          {result.error ? (
            <p className="calc-error">{result.error}</p>
          ) : (
            <>
              <div className="calc-result-row">
                <span className="calc-result-label">
                  {result.first} → {result.second}
                </span>
                <span
                  className={`calc-result-value ${
                    result.isIncrease ? "calc-increase" : "calc-decrease"
                  }`}
                >
                  {result.isIncrease ? "▲" : "▼"} {result.percent}%
                </span>
              </div>
              <div className="calc-result-divider" />
              <div className="calc-result-row calc-summary">
                <span className="calc-result-label">Difference</span>
                <span className="calc-result-value">
                  {Math.abs(result.second - result.first).toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculatorComponent;
