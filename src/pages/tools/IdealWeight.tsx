import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon';

interface WeightRange {
  min: number;
  max: number;
}

const IdealWeight: React.FC = () => {
  const navigate = useNavigate();

  const [height, setHeight] = useState('');
  const [weightRange, setWeightRange] = useState<WeightRange | null>(null);
  const [error, setError] = useState('');

  const calculateIdealWeight = () => {
    setError('');
    setWeightRange(null);

    const heightCm = parseFloat(height);

    if (isNaN(heightCm) || heightCm <= 0) {
      setError('Please enter a valid height.');
      return;
    }

    if (heightCm < 100 || heightCm > 250) {
      setError('Please enter a height between 100 cm and 250 cm.');
      return;
    }

    const heightM = heightCm / 100;

    // Estimated healthy weight range using BMI 18.5–24.9
    const minWeight = 18.5 * heightM * heightM;
    const maxWeight = 24.9 * heightM * heightM;

    setWeightRange({
      min: Math.round(minWeight * 10) / 10,
      max: Math.round(maxWeight * 10) / 10,
    });
  };

  const handleReset = () => {
    setHeight('');
    setWeightRange(null);
    setError('');
  };

  return (
    <div className="ideal-weight-container">

      <button
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Back to Health Tools
      </button>

      <div className="ideal-weight-content">

        <div className="ideal-weight-title-section">

          <div className="title-icon">
            <Icon
              name="ideal-weight"
              size={32}
              color="#1B8D8F"
            />
          </div>

          <h1 className="ideal-weight-title">
            Ideal Weight
          </h1>

          <p className="ideal-weight-description">
            Find an estimated healthy weight range based on your height.
          </p>

        </div>

        <div className="input-card">

          <div className="input-group">

            <label
              htmlFor="height-input"
              className="input-label"
            >
              Height (cm)
            </label>

            <div className="input-wrapper">

              <input
                id="height-input"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 170"
                min="100"
                max="250"
                step="0.1"
                className="height-input"
              />

              <span className="input-unit">
                cm
              </span>

            </div>

            {error && (
              <p className="error-message">
                <Icon
                  name="warning"
                  size={16}
                  color="#E74C3C"
                />
                {error}
              </p>
            )}

          </div>

          <div className="button-group">

            <button
              className="calculate-button"
              onClick={calculateIdealWeight}
              disabled={!height}
            >
              Calculate
            </button>

            <button
              className="reset-button"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>

        </div>

        {weightRange && (
          <div className="result-card">

            <div className="result-header">

              <Icon
                name="check"
                size={24}
                color="#27AE60"
              />

              <h2>
                Your Estimated Ideal Weight Range
              </h2>

            </div>

            <div className="result-range">

              <div className="range-value">
                <strong>{weightRange.min}</strong>
                <span>kg</span>
              </div>

              <span className="range-separator">
                to
              </span>

              <div className="range-value">
                <strong>{weightRange.max}</strong>
                <span>kg</span>
              </div>

            </div>

            <div className="result-details">

              <div>
                <span>Height</span>
                <strong>{height} cm</strong>
              </div>

            </div>

            <div className="disclaimer">

              <Icon
                name="info"
                size={16}
                color="#6B7A8F"
              />

              <p>
                This is a general estimate and does not replace
                professional medical advice.
              </p>

            </div>

          </div>
        )}

        <div className="info-card">

          <Icon
            name="info"
            size={20}
            color="#1B8D8F"
          />

          <div>

            <h3>
              About Ideal Weight
            </h3>

            <p>
              This tool provides an estimated healthy weight range
              based on height and BMI. Individual healthy weight may
              vary depending on age, body composition, muscle mass,
              and other factors.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default IdealWeight;