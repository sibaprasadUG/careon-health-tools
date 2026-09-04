import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon';

type Gender = 'male' | 'female' | '';

const CaloriesCalculator: React.FC = () => {
  const navigate = useNavigate();

  const [gender, setGender] = useState<Gender>('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('');

  const [calories, setCalories] = useState<number | null>(null);
  const [bmr, setBmr] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculateCalories = () => {
    setError('');
    setCalories(null);
    setBmr(null);

    const ageValue = parseFloat(age);
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);

    if (!gender) {
      setError('Please select your gender.');
      return;
    }

    if (!age || !height || !weight || !activity) {
      setError('Please enter all required details.');
      return;
    }

    if (
      isNaN(ageValue) ||
      isNaN(heightValue) ||
      isNaN(weightValue)
    ) {
      setError('Please enter valid numeric values.');
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

    // Mifflin-St Jeor Equation
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

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const calculatedCalories =
      calculatedBMR * activityMultipliers[activity];

    setBmr(Math.round(calculatedBMR));
    setCalories(Math.round(calculatedCalories));
  };

  const handleReset = () => {
    setGender('');
    setAge('');
    setHeight('');
    setWeight('');
    setActivity('');
    setCalories(null);
    setBmr(null);
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
              Daily Calories
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
              name="calories"
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
            Daily Calories
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
            Estimate your daily calorie needs based on
            your body details and activity level.
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
          {/* Gender */}
          <div style={{ marginBottom: 22 }}>
            <label
              style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 700,
                color: '#315657',
                marginBottom: 9,
              }}
            >
              Gender
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setGender('male')}
                style={{
                  height: 52,
                  borderRadius: 14,
                  border:
                    gender === 'male'
                      ? '2px solid #1B8D8F'
                      : '1px solid #D5E5E4',
                  background:
                    gender === 'male'
                      ? '#E9F7F5'
                      : '#FFFFFF',
                  color:
                    gender === 'male'
                      ? '#147477'
                      : '#50696A',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Male
              </button>

              <button
                type="button"
                onClick={() => setGender('female')}
                style={{
                  height: 52,
                  borderRadius: 14,
                  border:
                    gender === 'female'
                      ? '2px solid #1B8D8F'
                      : '1px solid #D5E5E4',
                  background:
                    gender === 'female'
                      ? '#E9F7F5'
                      : '#FFFFFF',
                  color:
                    gender === 'female'
                      ? '#147477'
                      : '#50696A',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Female
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, minmax(0, 1fr))',
              gap: 14,
            }}
          >
            {/* Age */}
            <div>
              <label
                htmlFor="calories-age"
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#315657',
                  marginBottom: 8,
                }}
              >
                Age
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  id="calories-age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="30"
                  min="10"
                  max="120"
                  style={{
                    width: '100%',
                    height: 52,
                    borderRadius: 14,
                    border: '1px solid #D5E5E4',
                    background: '#FAFCFC',
                    padding: '0 60px 0 15px',
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
                  years
                </span>
              </div>
            </div>

            {/* Height */}
            <div>
              <label
                htmlFor="calories-height"
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#315657',
                  marginBottom: 8,
                }}
              >
                Height
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  id="calories-height"
                  type="number"
                  value={height}
                  onChange={(e) =>
                    setHeight(e.target.value)
                  }
                  placeholder="170"
                  min="100"
                  max="250"
                  step="0.1"
                  style={{
                    width: '100%',
                    height: 52,
                    borderRadius: 14,
                    border: '1px solid #D5E5E4',
                    background: '#FAFCFC',
                    padding: '0 45px 0 15px',
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
                  cm
                </span>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label
                htmlFor="calories-weight"
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#315657',
                  marginBottom: 8,
                }}
              >
                Weight
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  id="calories-weight"
                  type="number"
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value)
                  }
                  placeholder="70"
                  min="20"
                  max="300"
                  step="0.1"
                  style={{
                    width: '100%',
                    height: 52,
                    borderRadius: 14,
                    border: '1px solid #D5E5E4',
                    background: '#FAFCFC',
                    padding: '0 45px 0 15px',
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
          </div>

          {/* Activity */}
          <div style={{ marginTop: 20 }}>
            <label
              htmlFor="activity-level"
              style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 700,
                color: '#315657',
                marginBottom: 8,
              }}
            >
              Activity Level
            </label>

            <select
              id="activity-level"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              style={{
                width: '100%',
                height: 54,
                borderRadius: 14,
                border: '1px solid #D5E5E4',
                background: '#FAFCFC',
                padding: '0 15px',
                fontSize: 15,
                color: activity
                  ? '#173B3C'
                  : '#7A8D8E',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">
                Select your activity level
              </option>

              <option value="sedentary">
                Sedentary — little or no exercise
              </option>

              <option value="light">
                Lightly Active — exercise 1–3 days/week
              </option>

              <option value="moderate">
                Moderately Active — exercise 3–5 days/week
              </option>

              <option value="active">
                Very Active — exercise 6–7 days/week
              </option>

              <option value="very_active">
                Extra Active — very hard exercise/physical job
              </option>
            </select>
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
              onClick={calculateCalories}
              disabled={
                !gender ||
                !age ||
                !height ||
                !weight ||
                !activity
              }
              style={{
                height: 52,
                border: 'none',
                borderRadius: 14,
                background:
                  !gender ||
                  !age ||
                  !height ||
                  !weight ||
                  !activity
                    ? '#B9D7D6'
                    : '#1B8D8F',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 700,
                cursor:
                  !gender ||
                  !age ||
                  !height ||
                  !weight ||
                  !activity
                    ? 'not-allowed'
                    : 'pointer',
                boxShadow:
                  !gender ||
                  !age ||
                  !height ||
                  !weight ||
                  !activity
                    ? 'none'
                    : '0 7px 18px rgba(27,141,143,0.22)',
              }}
            >
              Calculate Calories
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
        {calories !== null && (
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
                  Daily Calorie Needs
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
                  fontSize: 42,
                  lineHeight: 1,
                  fontWeight: 800,
                  color: '#1B8D8F',
                  letterSpacing: '-1px',
                }}
              >
                {calories.toLocaleString()}
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#617879',
                }}
              >
                kcal / day
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
                Estimated daily energy needs based on
                your selected activity level.
              </p>
            </div>

            {/* BMR */}
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
                  Estimated BMR
                </div>

                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#315657',
                  }}
                >
                  {bmr?.toLocaleString()} kcal / day
                </div>
              </div>

              <Icon
                name="bmr"
                size={26}
                color="#1B8D8F"
              />
            </div>

            {/* Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(2, 1fr)',
                gap: 10,
                marginTop: 14,
              }}
            >
              {[
                [
                  'Gender',
                  gender === 'male'
                    ? 'Male'
                    : 'Female',
                ],
                ['Age', `${age} years`],
                ['Height', `${height} cm`],
                ['Weight', `${weight} kg`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #DCEDEA',
                    borderRadius: 14,
                    padding: '12px 14px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: '#7A8D8E',
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#315657',
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
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
                This calorie estimate is for general
                informational purposes and does not replace
                professional nutrition or medical advice.
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
              About Daily Calories
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.6,
                color: '#687D7E',
              }}
            >
              Daily calorie needs vary from person to
              person. This tool estimates energy needs using
              the Mifflin-St Jeor equation and an activity
              factor. Individual needs may differ.
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

            section > div[style*="grid-template-columns: repeat(3"] {
              grid-template-columns: 1fr !important;
            }

            section > div[style*="grid-template-columns: 1fr 110px"] {
              grid-template-columns: 1fr !important;
            }
          }

          input:focus,
          select:focus {
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

export default CaloriesCalculator;