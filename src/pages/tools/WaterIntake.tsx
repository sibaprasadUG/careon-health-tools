import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon';

const WaterIntake: React.FC = () => {
  const navigate = useNavigate();

  const [weight, setWeight] = useState('');
  const [water, setWater] = useState<number | null>(null);
  const [glasses, setGlasses] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculateWater = () => {
    setError('');
    setWater(null);
    setGlasses(null);

    const weightValue = parseFloat(weight);

    if (!weight) {
      setError('Please enter your body weight.');
      return;
    }

    if (isNaN(weightValue)) {
      setError('Please enter a valid weight.');
      return;
    }

    if (weightValue < 20 || weightValue > 300) {
      setError('Please enter a weight between 20 kg and 300 kg.');
      return;
    }

    /*
      General estimate:
      35 ml of water per kg body weight.
    */
    const waterMl = weightValue * 35;
    const waterLitres = waterMl / 1000;
    const estimatedGlasses = waterMl / 250;

    setWater(Math.round(waterLitres * 10) / 10);
    setGlasses(Math.round(estimatedGlasses * 10) / 10);
  };

  const handleReset = () => {
    setWeight('');
    setWater(null);
    setGlasses(null);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F4FAF9',
        color: '#173B3C',
        fontFamily:
          'Arial, "Segoe UI", Roboto, Helvetica, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #DCEDEC',
          padding: '16px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Back"
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              border: '1px solid #D7E9E8',
              background: '#F3FAF9',
              color: '#1B8D8F',
              fontSize: 22,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ←
          </button>

          <div>
            <div
              style={{
                fontSize: 13,
                color: '#6B8081',
                marginBottom: 2,
              }}
            >
              CareOn Health Tools
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#173B3C',
              }}
            >
              Water Intake
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          width: '100%',
          maxWidth: 760,
          margin: '0 auto',
          padding: '30px 18px 50px',
        }}
      >
        {/* Title */}
        <section
          style={{
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              margin: '0 auto 16px',
              borderRadius: 20,
              background:
                'linear-gradient(135deg, #DDF5F2, #EEF9F8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 8px 24px rgba(27,141,143,0.10)',
            }}
          >
            <Icon
              name="water"
              size={36}
              color="#1B8D8F"
            />
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 30,
              lineHeight: 1.2,
              color: '#123C3E',
              fontWeight: 750,
              letterSpacing: '-0.5px',
            }}
          >
            Water Intake
          </h1>

          <p
            style={{
              maxWidth: 520,
              margin: '10px auto 0',
              fontSize: 15,
              lineHeight: 1.6,
              color: '#667D7E',
            }}
          >
            Get a simple estimated daily hydration target
            based on your body weight.
          </p>
        </section>

        {/* Calculator Card */}
        <section
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDEDEC',
            borderRadius: 24,
            padding: 24,
            boxShadow:
              '0 12px 35px rgba(23,59,60,0.07)',
          }}
        >
          {/* Weight Input */}
          <div>
            <label
              htmlFor="water-weight"
              style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 700,
                color: '#315657',
                marginBottom: 8,
              }}
            >
              Body Weight
            </label>

            <div
              style={{
                position: 'relative',
              }}
            >
              <input
                id="water-weight"
                type="number"
                value={weight}
                onChange={(e) =>
                  setWeight(e.target.value)
                }
                placeholder="e.g. 70"
                min="20"
                max="300"
                step="0.1"
                style={{
                  width: '100%',
                  height: 54,
                  borderRadius: 14,
                  border: '1px solid #D5E5E4',
                  background: '#FAFCFC',
                  padding: '0 48px 0 15px',
                  fontSize: 16,
                  color: '#173B3C',
                  outline: 'none',
                }}
              />

              <span
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#7A8D8E',
                }}
              >
                kg
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: 16,
                padding: '12px 14px',
                borderRadius: 12,
                background: '#FFF4F2',
                border: '1px solid #F6D4CE',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#C94A3A',
                fontSize: 13,
                lineHeight: 1.4,
              }}
            >
              <Icon
                name="warning"
                size={17}
                color="#E74C3C"
              />

              <span>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 110px',
              gap: 10,
              marginTop: 22,
            }}
          >
            <button
              type="button"
              onClick={calculateWater}
              disabled={!weight}
              style={{
                height: 52,
                border: 'none',
                borderRadius: 14,
                background: !weight
                  ? '#B9D7D6'
                  : '#1B8D8F',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 700,
                cursor: !weight
                  ? 'not-allowed'
                  : 'pointer',
                boxShadow: !weight
                  ? 'none'
                  : '0 7px 18px rgba(27,141,143,0.22)',
              }}
            >
              Calculate Water
            </button>

            <button
              type="button"
              onClick={handleReset}
              style={{
                height: 52,
                borderRadius: 14,
                border: '1px solid #D5E5E4',
                background: '#FFFFFF',
                color: '#587071',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>
        </section>

        {/* Result */}
        {water !== null && (
          <section
            style={{
              marginTop: 18,
              background:
                'linear-gradient(145deg, #E9F8F6, #FFFFFF)',
              border: '1px solid #CFEAE7',
              borderRadius: 24,
              padding: 24,
              boxShadow:
                '0 12px 35px rgba(23,59,60,0.06)',
            }}
          >
            {/* Result Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: '#DDF4EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name="check"
                  size={22}
                  color="#27AE60"
                />
              </div>

              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#6C8182',
                    marginBottom: 2,
                  }}
                >
                  Estimated Result
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 20,
                    color: '#173B3C',
                  }}
                >
                  Daily Water Target
                </h2>
              </div>
            </div>

            {/* Main Result */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 18,
                padding: '22px 18px',
                textAlign: 'center',
                border: '1px solid #DCEDEA',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Icon
                  name="water"
                  size={32}
                  color="#1B8D8F"
                />

                <span
                  style={{
                    fontSize: 42,
                    lineHeight: 1,
                    fontWeight: 800,
                    color: '#1B8D8F',
                    letterSpacing: '-1px',
                  }}
                >
                  {water}
                </span>
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#617879',
                }}
              >
                litres / day
              </div>

              <p
                style={{
                  margin: '14px auto 0',
                  maxWidth: 460,
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: '#6D8081',
                }}
              >
                This is an estimated daily hydration target.
                Your actual needs may vary.
              </p>
            </div>

            {/* Glasses */}
            <div
              style={{
                marginTop: 14,
                background: '#FFFFFF',
                border: '1px solid #DCEDEA',
                borderRadius: 16,
                padding: '15px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: '#7A8D8E',
                    marginBottom: 4,
                  }}
                >
                  Approximate 250 ml glasses
                </div>

                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#315657',
                  }}
                >
                  {glasses} glasses / day
                </div>
              </div>

              <Icon
                name="water"
                size={28}
                color="#1B8D8F"
              />
            </div>

            {/* Weight */}
            <div
              style={{
                marginTop: 10,
                background: '#FFFFFF',
                border: '1px solid #DCEDEA',
                borderRadius: 16,
                padding: '13px 16px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#7A8D8E',
                  marginBottom: 4,
                }}
              >
                Body Weight
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#315657',
                }}
              >
                {weight} kg
              </div>
            </div>

            {/* Disclaimer */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
                marginTop: 16,
                padding: '12px 13px',
                background: '#F7FAFA',
                borderRadius: 12,
              }}
            >
              <Icon
                name="info"
                size={16}
                color="#718384"
              />

              <p
                style={{
                  margin: 0,
                  fontSize: 11.5,
                  lineHeight: 1.5,
                  color: '#718384',
                }}
              >
                Hydration needs can vary with weather,
                exercise, diet, illness, pregnancy, and other
                individual factors. This estimate does not
                replace professional medical advice.
              </p>
            </div>
          </section>
        )}

        {/* About */}
        <section
          style={{
            marginTop: 18,
            background: '#FFFFFF',
            border: '1px solid #DDEDEC',
            borderRadius: 20,
            padding: 20,
            display: 'flex',
            gap: 13,
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              flexShrink: 0,
              borderRadius: 12,
              background: '#EAF7F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              name="info"
              size={20}
              color="#1B8D8F"
            />
          </div>

          <div>
            <h3
              style={{
                margin: '1px 0 7px',
                fontSize: 16,
                color: '#173B3C',
              }}
            >
              About Water Intake
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.6,
                color: '#687D7E',
              }}
            >
              This tool uses a simple general estimate of
              approximately 35 ml of water per kilogram of
              body weight. It is intended for general
              hydration planning, not as a medical prescription.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            padding: '24px 10px 5px',
            color: '#8A9A9B',
            fontSize: 11,
          }}
        >
          CareOn Health Tools • Caring Beyond Treatment
        </div>
      </main>

      {/* Mobile Responsive */}
      <style>
        {`
          @media (max-width: 600px) {
            header {
              padding: 12px 14px !important;
            }

            main {
              padding: 24px 14px 40px !important;
            }

            h1 {
              font-size: 27px !important;
            }

            section {
              padding: 20px !important;
            }

            section > div[style*="grid-template-columns: 1fr 110px"] {
              grid-template-columns: 1fr !important;
            }
          }

          input:focus {
            border-color: #1B8D8F !important;
            box-shadow: 0 0 0 3px rgba(27,141,143,0.10) !important;
          }

          button {
            -webkit-tap-highlight-color: transparent;
          }
        `}
      </style>
    </div>
  );
};

export default WaterIntake;