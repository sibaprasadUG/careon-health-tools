import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Gender = 'male' | 'female' | '';

const BMRCalculator: React.FC = () => {
  const navigate = useNavigate();

  const [gender, setGender] = useState<Gender>('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const [bmr, setBmr] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculateBMR = () => {
    setError('');
    setBmr(null);

    const ageValue = Number(age);
    const heightValue = Number(height);
    const weightValue = Number(weight);

    if (!gender) {
      setError('Please select your gender.');
      return;
    }

    if (!age || !height || !weight) {
      setError('Please enter all required details.');
      return;
    }

    if (
      !Number.isFinite(ageValue) ||
      !Number.isFinite(heightValue) ||
      !Number.isFinite(weightValue)
    ) {
      setError('Please enter valid numbers.');
      return;
    }

    if (ageValue < 10 || ageValue > 120) {
      setError('Please enter an age between 10 and 120 years.');
      return;
    }

    if (heightValue < 100 || heightValue > 250) {
      setError('Please enter a height between 100 cm and 250 cm.');
      return;
    }

    if (weightValue < 20 || weightValue > 300) {
      setError('Please enter a weight between 20 kg and 300 kg.');
      return;
    }

    let calculatedBMR: number;

    if (gender === 'male') {
      calculatedBMR =
        10 * weightValue +
        6.25 * heightValue -
        5 * ageValue +
        5;
    } else {
      calculatedBMR =
        10 * weightValue +
        6.25 * heightValue -
        5 * ageValue -
        161;
    }

    setBmr(Math.round(calculatedBMR));
  };

  const handleReset = () => {
    setGender('');
    setAge('');
    setHeight('');
    setWeight('');
    setBmr(null);
    setError('');
  };

  return (
    <div className="bmr-page">

      {/* ================= HEADER ================= */}
      <header className="bmr-header">
        <div className="bmr-header-inner">

          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/')}
            aria-label="Back to Health Tools"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M11 18L5 12L11 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="header-brand">
            <div className="header-small">
              CareOn Health Tools
            </div>

            <div className="header-title">
              BMR Calculator
            </div>
          </div>

        </div>
      </header>


      {/* ================= MAIN ================= */}
      <main className="bmr-main">

        {/* ================= HERO ================= */}
        <section className="bmr-hero">

          <div className="hero-icon-box">

            {/* Realistic Flame / Metabolism SVG */}
            <svg
              className="metabolism-icon"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M33.5 5.5C34.7 14.4 27.3 18.1 27.8 26.2C28.1 30.9 31.1 34.1 34.6 35.8C33.9 31.2 36.4 27.9 40.4 25.2C43.8 31.4 48.5 36.2 48.5 43.1C48.5 52.2 41.9 58.5 32 58.5C22.1 58.5 15.5 52.1 15.5 43.3C15.5 35.4 20.1 29.7 24.4 24.2C28.1 19.4 30.5 14.2 33.5 5.5Z"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M31.8 37.1C29.2 40.1 26.7 43 26.7 46.8C26.7 50.7 29.1 53.4 32.7 53.4C36.5 53.4 39.2 50.7 39.2 47.1C39.2 43.9 37.2 41.3 34.9 39.1C34.1 42 32.9 43.5 31.8 44.4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

          </div>

          <h1>
            BMR Calculator
          </h1>

          <p>
            Calculate your Basal Metabolic Rate and understand
            your estimated resting energy needs.
          </p>

        </section>


        {/* ================= CALCULATOR CARD ================= */}
        <section className="calculator-card">

          {/* Gender */}
          <div className="field-section">

            <label className="field-label">
              Gender
            </label>

            <div className="gender-grid">

              <button
                type="button"
                className={`gender-button ${
                  gender === 'male' ? 'selected' : ''
                }`}
                onClick={() => {
                  setGender('male');
                  setError('');
                }}
              >
                <span className="gender-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="10"
                      cy="14"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />

                    <path
                      d="M14 10L20 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />

                    <path
                      d="M15 4H20V9"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                </span>

                <span>Male</span>
              </button>


              <button
                type="button"
                className={`gender-button ${
                  gender === 'female' ? 'selected' : ''
                }`}
                onClick={() => {
                  setGender('female');
                  setError('');
                }}
              >
                <span className="gender-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />

                    <path
                      d="M12 12V20"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />

                    <path
                      d="M8.5 17H15.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>

                </span>

                <span>Female</span>
              </button>

            </div>

          </div>


          {/* Input Grid */}
          <div className="input-grid">

            {/* AGE */}
            <div className="input-field">

              <label htmlFor="bmr-age">
                Age
              </label>

              <div className="input-wrap">

                <input
                  id="bmr-age"
                  type="number"
                  inputMode="numeric"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setError('');
                  }}
                  placeholder="30"
                  min="10"
                  max="120"
                />

                <span className="input-unit">
                  years
                </span>

              </div>

            </div>


            {/* HEIGHT */}
            <div className="input-field">

              <label htmlFor="bmr-height">
                Height
              </label>

              <div className="input-wrap">

                <input
                  id="bmr-height"
                  type="number"
                  inputMode="decimal"
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                    setError('');
                  }}
                  placeholder="170"
                  min="100"
                  max="250"
                  step="0.1"
                />

                <span className="input-unit">
                  cm
                </span>

              </div>

            </div>


            {/* WEIGHT */}
            <div className="input-field">

              <label htmlFor="bmr-weight">
                Weight
              </label>

              <div className="input-wrap">

                <input
                  id="bmr-weight"
                  type="number"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setError('');
                  }}
                  placeholder="70"
                  min="20"
                  max="300"
                  step="0.1"
                />

                <span className="input-unit">
                  kg
                </span>

              </div>

            </div>

          </div>


          {/* ERROR */}
          {error && (
            <div className="error-box">

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 3L21 20H3L12 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                <path
                  d="M12 9V13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <circle
                  cx="12"
                  cy="16.5"
                  r="1"
                  fill="currentColor"
                />
              </svg>

              <span>{error}</span>

            </div>
          )}


          {/* BUTTONS */}
          <div className="action-grid">

            <button
              type="button"
              className="calculate-button"
              onClick={calculateBMR}
              disabled={
                !gender ||
                !age ||
                !height ||
                !weight
              }
            >
              Calculate BMR
            </button>

            <button
              type="button"
              className="reset-button"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>

        </section>


        {/* ================= RESULT ================= */}
        {bmr !== null && (
          <section className="result-card">

            <div className="result-heading">

              <div className="result-check">

                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="M8 12L11 15L16 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

              </div>

              <div>
                <div className="result-label">
                  Estimated Result
                </div>

                <h2>
                  Your BMR
                </h2>
              </div>

            </div>


            {/* Big BMR */}
            <div className="bmr-result-box">

              <div className="bmr-number">
                {bmr.toLocaleString()}
              </div>

              <div className="bmr-unit">
                kcal / day
              </div>

              <p>
                Estimated energy your body needs at rest
                to maintain basic body functions.
              </p>

            </div>


            {/* Details */}
            <div className="details-grid">

              <div className="detail-item">
                <span>Gender</span>
                <strong>
                  {gender === 'male' ? 'Male' : 'Female'}
                </strong>
              </div>

              <div className="detail-item">
                <span>Age</span>
                <strong>
                  {age} years
                </strong>
              </div>

              <div className="detail-item">
                <span>Height</span>
                <strong>
                  {height} cm
                </strong>
              </div>

              <div className="detail-item">
                <span>Weight</span>
                <strong>
                  {weight} kg
                </strong>
              </div>

            </div>


            {/* Disclaimer */}
            <div className="result-note">

              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M12 11V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <circle
                  cx="12"
                  cy="8"
                  r="1"
                  fill="currentColor"
                />
              </svg>

              <p>
                BMR is an estimate and does not represent
                your total daily calorie requirement.
              </p>

            </div>

          </section>
        )}


        {/* ================= ABOUT ================= */}
        <section className="about-card">

          <div className="about-icon">

            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M12 11V16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <circle
                cx="12"
                cy="8"
                r="1"
                fill="currentColor"
              />
            </svg>

          </div>

          <div>

            <h3>
              About BMR
            </h3>

            <p>
              Basal Metabolic Rate (BMR) is the estimated
              amount of energy your body uses while at rest.
              Actual daily calorie needs also depend on
              physical activity and other individual factors.
            </p>

          </div>

        </section>


        {/* ================= FOOTER ================= */}
        <footer className="bmr-footer">
          <strong>CareOn Health Tools</strong>
          <span>•</span>
          <span>Caring Beyond Treatment</span>
        </footer>

      </main>


      {/* ================= PAGE STYLE ================= */}
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .bmr-page {
            min-height: 100vh;
            background:
              linear-gradient(
                180deg,
                #F7FCFB 0%,
                #F1F9F7 100%
              );
            color: #173B3C;
            font-family:
              Arial,
              "Segoe UI",
              Roboto,
              Helvetica,
              sans-serif;
          }

          .bmr-header {
            position: sticky;
            top: 0;
            z-index: 20;
            background: rgba(255,255,255,0.97);
            border-bottom: 1px solid #DCEDEC;
            backdrop-filter: blur(10px);
          }

          .bmr-header-inner {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
            padding: 13px 18px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .back-button {
            width: 42px;
            height: 42px;
            flex-shrink: 0;
            border: 1px solid #D7E8E7;
            border-radius: 12px;
            background: #F2FAF9;
            color: #168A8C;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition:
              background 0.2s ease,
              transform 0.2s ease;
          }

          .back-button:hover {
            background: #E6F5F3;
            transform: translateX(-2px);
          }

          .header-small {
            color: #6C8182;
            font-size: 12px;
            line-height: 1.2;
            margin-bottom: 3px;
          }

          .header-title {
            color: #173B3C;
            font-size: 18px;
            line-height: 1.2;
            font-weight: 700;
          }

          .bmr-main {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
            padding: 34px 18px 48px;
          }

          .bmr-hero {
            text-align: center;
            padding: 6px 0 28px;
          }

          .hero-icon-box {
            width: 72px;
            height: 72px;
            margin: 0 auto 17px;
            border-radius: 21px;
            background:
              linear-gradient(
                145deg,
                #E1F6F3,
                #F1FBFA
              );
            color: #159497;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow:
              0 10px 28px rgba(27,141,143,0.12);
          }

          .metabolism-icon {
            width: 42px;
            height: 42px;
          }

          .bmr-hero h1 {
            margin: 0;
            color: #123C3E;
            font-size: 30px;
            line-height: 1.2;
            font-weight: 750;
            letter-spacing: -0.6px;
          }

          .bmr-hero p {
            max-width: 510px;
            margin: 10px auto 0;
            color: #667D7E;
            font-size: 15px;
            line-height: 1.6;
          }

          .calculator-card {
            background: #FFFFFF;
            border: 1px solid #DCEDEC;
            border-radius: 24px;
            padding: 25px;
            box-shadow:
              0 14px 38px rgba(23,59,60,0.07);
          }

          .field-section {
            margin-bottom: 23px;
          }

          .field-label,
          .input-field label {
            display: block;
            margin-bottom: 9px;
            color: #315657;
            font-size: 14px;
            font-weight: 700;
          }

          .gender-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 11px;
          }

          .gender-button {
            min-height: 54px;
            border: 1px solid #D4E5E4;
            border-radius: 14px;
            background: #FFFFFF;
            color: #50696A;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition:
              border 0.2s ease,
              background 0.2s ease,
              color 0.2s ease,
              box-shadow 0.2s ease;
          }

          .gender-button:hover {
            border-color: #8BC7C5;
            background: #F8FCFC;
          }

          .gender-button.selected {
            border: 2px solid #1B8D8F;
            background: #EAF7F5;
            color: #147477;
            box-shadow:
              0 4px 12px rgba(27,141,143,0.08);
          }

          .gender-icon {
            width: 22px;
            height: 22px;
            display: inline-flex;
            color: currentColor;
          }

          .gender-icon svg {
            width: 100%;
            height: 100%;
          }

          .input-grid {
            display: grid;
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
            gap: 14px;
          }

          .input-field {
            min-width: 0;
          }

          .input-wrap {
            position: relative;
          }

          .input-wrap input {
            width: 100%;
            height: 53px;
            border: 1px solid #D4E5E4;
            border-radius: 14px;
            background: #FAFCFC;
            padding: 0 58px 0 15px;
            color: #173B3C;
            font-family: inherit;
            font-size: 16px;
            outline: none;
            transition:
              border 0.2s ease,
              box-shadow 0.2s ease,
              background 0.2s ease;
          }

          .input-wrap input:hover {
            border-color: #A9CFCD;
          }

          .input-wrap input:focus {
            background: #FFFFFF;
            border-color: #1B8D8F;
            box-shadow:
              0 0 0 3px rgba(27,141,143,0.10);
          }

          .input-wrap input::placeholder {
            color: #9BAAAA;
          }

          .input-unit {
            position: absolute;
            top: 50%;
            right: 14px;
            transform: translateY(-50%);
            color: #788D8E;
            font-size: 12px;
            font-weight: 700;
            pointer-events: none;
          }

          .error-box {
            margin-top: 16px;
            min-height: 45px;
            padding: 11px 13px;
            border: 1px solid #F0D0CA;
            border-radius: 12px;
            background: #FFF6F4;
            color: #C34E40;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            line-height: 1.4;
          }

          .error-box svg {
            flex-shrink: 0;
          }

          .action-grid {
            display: grid;
            grid-template-columns: 1fr 110px;
            gap: 10px;
            margin-top: 23px;
          }

          .calculate-button,
          .reset-button {
            height: 53px;
            border-radius: 14px;
            font-family: inherit;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition:
              transform 0.15s ease,
              box-shadow 0.2s ease,
              background 0.2s ease;
          }

          .calculate-button {
            border: none;
            background: #1B8D8F;
            color: #FFFFFF;
            box-shadow:
              0 7px 18px rgba(27,141,143,0.20);
          }

          .calculate-button:hover:not(:disabled) {
            background: #147477;
            transform: translateY(-1px);
            box-shadow:
              0 9px 22px rgba(27,141,143,0.25);
          }

          .calculate-button:disabled {
            background: #B9D7D6;
            cursor: not-allowed;
            box-shadow: none;
          }

          .reset-button {
            border: 1px solid #D4E5E4;
            background: #FFFFFF;
            color: #587071;
          }

          .reset-button:hover {
            background: #F7FAFA;
            border-color: #B7D2D0;
          }

          .result-card {
            margin-top: 18px;
            padding: 24px;
            border: 1px solid #CFE9E6;
            border-radius: 24px;
            background:
              linear-gradient(
                145deg,
                #EAF8F6,
                #FFFFFF
              );
            box-shadow:
              0 12px 34px rgba(23,59,60,0.06);
          }

          .result-heading {
            display: flex;
            align-items: center;
            gap: 11px;
            margin-bottom: 18px;
          }

          .result-check {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: #DDF4EE;
            color: #27A866;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .result-label {
            margin-bottom: 2px;
            color: #718384;
            font-size: 11px;
          }

          .result-heading h2 {
            margin: 0;
            color: #173B3C;
            font-size: 20px;
            line-height: 1.2;
          }

          .bmr-result-box {
            padding: 24px 18px;
            border: 1px solid #DCEDEA;
            border-radius: 18px;
            background: #FFFFFF;
            text-align: center;
          }

          .bmr-number {
            color: #168A8C;
            font-size: 44px;
            line-height: 1;
            font-weight: 800;
            letter-spacing: -1.5px;
          }

          .bmr-unit {
            margin-top: 8px;
            color: #617879;
            font-size: 14px;
            font-weight: 700;
          }

          .bmr-result-box p {
            max-width: 470px;
            margin: 14px auto 0;
            color: #6D8081;
            font-size: 13px;
            line-height: 1.55;
          }

          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 14px;
          }

          .detail-item {
            padding: 13px 14px;
            border: 1px solid #DCEDEA;
            border-radius: 14px;
            background: #FFFFFF;
          }

          .detail-item span {
            display: block;
            margin-bottom: 4px;
            color: #7A8D8E;
            font-size: 11px;
          }

          .detail-item strong {
            color: #315657;
            font-size: 14px;
          }

          .result-note {
            margin-top: 16px;
            padding: 12px 13px;
            border-radius: 12px;
            background: #F7FAFA;
            color: #718384;
            display: flex;
            align-items: flex-start;
            gap: 8px;
          }

          .result-note svg {
            flex-shrink: 0;
            margin-top: 1px;
          }

          .result-note p {
            margin: 0;
            font-size: 11.5px;
            line-height: 1.5;
          }

          .about-card {
            margin-top: 18px;
            padding: 20px;
            border: 1px solid #DCEDEC;
            border-radius: 20px;
            background: #FFFFFF;
            display: flex;
            align-items: flex-start;
            gap: 13px;
          }

          .about-icon {
            width: 39px;
            height: 39px;
            flex-shrink: 0;
            border-radius: 12px;
            background: #EAF7F6;
            color: #1B8D8F;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .about-card h3 {
            margin: 1px 0 7px;
            color: #173B3C;
            font-size: 16px;
            line-height: 1.3;
          }

          .about-card p {
            margin: 0;
            color: #687D7E;
            font-size: 13px;
            line-height: 1.6;
          }

          .bmr-footer {
            padding: 24px 10px 5px;
            color: #8A9A9B;
            text-align: center;
            font-size: 11px;
          }

          .bmr-footer strong {
            color: #607879;
          }

          .bmr-footer span {
            margin: 0 4px;
          }

          @media (max-width: 600px) {

            .bmr-header-inner {
              padding: 12px 14px;
            }

            .bmr-main {
              padding:
                27px 14px 40px;
            }

            .bmr-hero {
              padding-bottom: 23px;
            }

            .bmr-hero h1 {
              font-size: 28px;
            }

            .bmr-hero p {
              padding: 0 8px;
              font-size: 14px;
            }

            .calculator-card,
            .result-card {
              border-radius: 21px;
              padding: 19px;
            }

            .input-grid {
              grid-template-columns: 1fr;
              gap: 15px;
            }

            .gender-grid {
              gap: 9px;
            }

            .gender-button {
              min-height: 52px;
            }

            .action-grid {
              grid-template-columns: 1fr;
            }

            .details-grid {
              grid-template-columns: 1fr 1fr;
            }

            .bmr-number {
              font-size: 39px;
            }

            .about-card {
              padding: 18px;
            }
          }

          @media (max-width: 360px) {

            .bmr-hero h1 {
              font-size: 25px;
            }

            .details-grid {
              grid-template-columns: 1fr;
            }

            .bmr-number {
              font-size: 36px;
            }
          }

          button {
            -webkit-tap-highlight-color: transparent;
          }

          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>

    </div>
  );
};

export default BMRCalculator;