import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BMICalculator: React.FC = () => {
  const navigate = useNavigate();

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    const heightValue = Number(height);
    const weightValue = Number(weight);

    if (!heightValue || !weightValue || heightValue <= 0 || weightValue <= 0) {
      setBmi(null);
      return;
    }

    const heightInMeters = heightValue / 100;
    const result = weightValue / (heightInMeters * heightInMeters);

    setBmi(Number(result.toFixed(1)));
  };

  const getCategory = () => {
    if (bmi === null) return "";

    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obesity";
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
  };

  return (
    <div className="bmi-page">
      <style>{`
        .bmi-page {
          min-height: 100vh;
          background: #F5FAF9;
          padding: 24px 16px 50px;
          font-family: Arial, "Segoe UI", sans-serif;
          color: #173B45;
        }

        .bmi-container {
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
        }

        .bmi-back {
          border: none;
          background: transparent;
          color: #1B8D8F;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          padding: 8px 0;
          margin-bottom: 18px;
        }

        .bmi-header {
          background: white;
          border: 1px solid #DDECEB;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 18px;
          box-shadow: 0 5px 18px rgba(31, 86, 91, 0.05);
        }

        .bmi-icon {
          width: 58px;
          height: 58px;
          border-radius: 17px;
          background: #E5F5F2;
          color: #1B8D8F;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }

        .bmi-icon svg {
          width: 32px;
          height: 32px;
        }

        .bmi-header h1 {
          margin: 0;
          font-size: 27px;
          color: #173B45;
        }

        .bmi-header p {
          margin: 7px 0 0;
          color: #6A818B;
          font-size: 14px;
          line-height: 1.55;
        }

        .bmi-card {
          background: white;
          border: 1px solid #DDECEB;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 5px 18px rgba(31, 86, 91, 0.05);
        }

        .bmi-field {
          margin-bottom: 18px;
        }

        .bmi-field label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #35515B;
          margin-bottom: 8px;
        }

        .bmi-input-wrap {
          position: relative;
        }

        .bmi-input {
          width: 100%;
          height: 52px;
          border: 1px solid #D5E5E4;
          border-radius: 13px;
          padding: 0 65px 0 15px;
          font-size: 16px;
          color: #173B45;
          outline: none;
          background: #FBFDFC;
        }

        .bmi-input:focus {
          border-color: #1B8D8F;
          box-shadow: 0 0 0 3px rgba(27,141,143,0.10);
        }

        .bmi-unit {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #789099;
          font-size: 13px;
          font-weight: 600;
        }

        .bmi-button {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 13px;
          background: #1B8D8F;
          color: white;
          font-size: 15px;
          font-weight: 750;
          cursor: pointer;
          margin-top: 4px;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .bmi-button:hover {
          background: #147477;
        }

        .bmi-button:active {
          transform: scale(0.985);
        }

        .bmi-result {
          margin-top: 20px;
          padding: 22px;
          border-radius: 17px;
          background: #EAF7F4;
          border: 1px solid #CDEAE5;
          text-align: center;
        }

        .bmi-result-label {
          font-size: 12px;
          font-weight: 700;
          color: #64818A;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .bmi-value {
          margin: 6px 0;
          font-size: 44px;
          line-height: 1;
          font-weight: 800;
          color: #1B8D8F;
        }

        .bmi-category {
          font-size: 16px;
          font-weight: 750;
          color: #173B45;
        }

        .bmi-reset {
          margin-top: 15px;
          border: 1px solid #C9DFDD;
          background: white;
          color: #1B8D8F;
          border-radius: 11px;
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .bmi-info {
          margin-top: 18px;
          background: white;
          border: 1px solid #DDECEB;
          border-radius: 20px;
          padding: 20px;
        }

        .bmi-info h2 {
          margin: 0 0 13px;
          font-size: 16px;
          color: #173B45;
        }

        .bmi-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .bmi-table td {
          padding: 10px 4px;
          border-bottom: 1px solid #EDF3F2;
          color: #58727C;
        }

        .bmi-table td:last-child {
          text-align: right;
          font-weight: 700;
          color: #35515B;
        }

        .bmi-disclaimer {
          margin-top: 18px;
          text-align: center;
          color: #81939A;
          font-size: 11px;
          line-height: 1.5;
        }

        @media (max-width: 599px) {
          .bmi-page {
            padding: 15px 13px 35px;
          }

          .bmi-header,
          .bmi-card,
          .bmi-info {
            border-radius: 17px;
            padding: 19px;
          }

          .bmi-header h1 {
            font-size: 24px;
          }

          .bmi-value {
            font-size: 40px;
          }
        }
      `}</style>

      <div className="bmi-container">

        <button
          type="button"
          className="bmi-back"
          onClick={() => navigate("/")}
        >
          ← Back to Health Tools
        </button>

        <div className="bmi-header">
          <div className="bmi-icon">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="24"
                cy="24"
                r="17"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                d="M16 31L21 25L25 28L32 18"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="16" cy="31" r="2" fill="currentColor" />
              <circle cx="21" cy="25" r="2" fill="currentColor" />
              <circle cx="25" cy="28" r="2" fill="currentColor" />
              <circle cx="32" cy="18" r="2" fill="currentColor" />
            </svg>
          </div>

          <h1>BMI Calculator</h1>

          <p>
            Calculate your Body Mass Index using your height and weight.
          </p>
        </div>

        <div className="bmi-card">

          <div className="bmi-field">
            <label htmlFor="height">
              Height
            </label>

            <div className="bmi-input-wrap">
              <input
                id="height"
                className="bmi-input"
                type="number"
                inputMode="decimal"
                min="1"
                placeholder="Enter your height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />

              <span className="bmi-unit">cm</span>
            </div>
          </div>

          <div className="bmi-field">
            <label htmlFor="weight">
              Weight
            </label>

            <div className="bmi-input-wrap">
              <input
                id="weight"
                className="bmi-input"
                type="number"
                inputMode="decimal"
                min="1"
                placeholder="Enter your weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />

              <span className="bmi-unit">kg</span>
            </div>
          </div>

          <button
            type="button"
            className="bmi-button"
            onClick={calculateBMI}
          >
            Calculate BMI
          </button>

          {bmi !== null && (
            <div className="bmi-result">
              <div className="bmi-result-label">
                Your BMI
              </div>

              <div className="bmi-value">
                {bmi}
              </div>

              <div className="bmi-category">
                {getCategory()}
              </div>

              <button
                type="button"
                className="bmi-reset"
                onClick={resetCalculator}
              >
                Reset
              </button>
            </div>
          )}
        </div>

        <div className="bmi-info">
          <h2>BMI Categories</h2>

          <table className="bmi-table">
            <tbody>
              <tr>
                <td>Underweight</td>
                <td>Below 18.5</td>
              </tr>

              <tr>
                <td>Normal weight</td>
                <td>18.5 – 24.9</td>
              </tr>

              <tr>
                <td>Overweight</td>
                <td>25.0 – 29.9</td>
              </tr>

              <tr>
                <td>Obesity</td>
                <td>30.0 or above</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bmi-disclaimer">
          BMI is a general screening measure and does not replace
          professional medical advice.
        </div>

      </div>
    </div>
  );
};

export default BMICalculator;