import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon';

interface BPReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number | null;
  date: string;
  time: string;
  category: string;
}

const STORAGE_KEY = 'careon_blood_pressure_history';

const BloodPressure: React.FC = () => {
  const navigate = useNavigate();

  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');

  const [readings, setReadings] = useState<BPReading[]>([]);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const now = new Date();

    return now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const [date, setDate] = useState(getTodayDate());
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed: BPReading[] = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setReadings(parsed);
        }
      }
    } catch {
      setReadings([]);
    }
  }, []);

  const saveToStorage = (items: BPReading[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const getCategory = (
    sys: number,
    dia: number
  ): string => {
    if (sys >= 180 || dia >= 120) {
      return 'Very High';
    }

    if (sys >= 140 || dia >= 90) {
      return 'High';
    }

    if (sys >= 130 || dia >= 80) {
      return 'Elevated';
    }

    if (sys >= 120 && dia < 80) {
      return 'Elevated';
    }

    return 'Normal';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Normal':
        return '#218838';

      case 'Elevated':
        return '#B77900';

      case 'High':
        return '#D35400';

      case 'Very High':
        return '#C0392B';

      default:
        return '#1B8D8F';
    }
  };

  const handleSave = () => {
    setError('');
    setSaved(false);

    const sys = Number(systolic);
    const dia = Number(diastolic);
    const pulseValue =
      pulse.trim() === '' ? null : Number(pulse);

    if (!systolic || !diastolic) {
      setError(
        'Please enter both systolic and diastolic blood pressure.'
      );
      return;
    }

    if (
      !Number.isFinite(sys) ||
      !Number.isFinite(dia)
    ) {
      setError('Please enter valid blood pressure values.');
      return;
    }

    if (sys < 70 || sys > 250) {
      setError(
        'Please enter a systolic value between 70 and 250 mmHg.'
      );
      return;
    }

    if (dia < 40 || dia > 150) {
      setError(
        'Please enter a diastolic value between 40 and 150 mmHg.'
      );
      return;
    }

    if (dia >= sys) {
      setError(
        'Diastolic pressure should be lower than systolic pressure.'
      );
      return;
    }

    if (
      pulse !== '' &&
      (!Number.isFinite(pulseValue) ||
        (pulseValue as number) < 30 ||
        (pulseValue as number) > 220)
    ) {
      setError(
        'Please enter a pulse between 30 and 220 bpm.'
      );
      return;
    }

    if (!date) {
      setError('Please select a date.');
      return;
    }

    if (!time) {
      setError('Please select a time.');
      return;
    }

    const category = getCategory(sys, dia);

    const newReading: BPReading = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      systolic: sys,
      diastolic: dia,
      pulse: pulseValue,
      date,
      time,
      category,
    };

    const updated = [
      newReading,
      ...readings,
    ].slice(0, 50);

    setReadings(updated);
    saveToStorage(updated);

    setSaved(true);

    setSystolic('');
    setDiastolic('');
    setPulse('');

    setDate(getTodayDate());
    setTime(getCurrentTime());

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleDelete = (id: string) => {
    const updated = readings.filter(
      (reading) => reading.id !== id
    );

    setReadings(updated);
    saveToStorage(updated);
  };

  const handleClearHistory = () => {
    if (readings.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete all blood pressure history?'
    );

    if (!confirmed) {
      return;
    }

    setReadings([]);
    localStorage.removeItem(STORAGE_KEY);
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
          padding: '14px 18px',
          position: 'sticky',
          top: 0,
          zIndex: 20,
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
            aria-label="Back to Health Tools"
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              border: '1px solid #D5E7E5',
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
                color: '#718586',
                marginBottom: 2,
              }}
            >
              CareOn Health Tools
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 750,
                color: '#173B3C',
              }}
            >
              Blood Pressure
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: '30px 18px 50px',
        }}
      >
        {/* Title */}
        <section
          style={{
            textAlign: 'center',
            marginBottom: 25,
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              margin: '0 auto 16px',
              borderRadius: 20,
              background:
                'linear-gradient(145deg, #DDF5F2, #EEF9F8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 8px 24px rgba(27,141,143,0.10)',
            }}
          >
            <Icon
              name="blood-pressure"
              size={38}
              color="#1B8D8F"
            />
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 30,
              lineHeight: 1.2,
              color: '#123C3E',
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            Blood Pressure
          </h1>

          <p
            style={{
              maxWidth: 510,
              margin: '10px auto 0',
              fontSize: 15,
              lineHeight: 1.6,
              color: '#667D7E',
            }}
          >
            Record your blood pressure and keep track of
            your readings over time.
          </p>
        </section>

        {/* Input Card */}
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
          <div
            style={{
              fontSize: 16,
              fontWeight: 750,
              color: '#173B3C',
              marginBottom: 18,
            }}
          >
            Enter Reading
          </div>

          {/* BP Inputs */}
          <div
            className="bp-input-grid"
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(2, minmax(0, 1fr))',
              gap: 14,
            }}
          >
            {/* Systolic */}
            <div>
              <label
                htmlFor="systolic"
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#315657',
                  marginBottom: 8,
                }}
              >
                Systolic
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  id="systolic"
                  type="number"
                  inputMode="numeric"
                  value={systolic}
                  onChange={(e) =>
                    setSystolic(e.target.value)
                  }
                  placeholder="120"
                  min="70"
                  max="250"
                  style={{
                    width: '100%',
                    height: 54,
                    borderRadius: 14,
                    border: '1px solid #D5E5E4',
                    background: '#FAFCFC',
                    padding: '0 68px 0 15px',
                    fontSize: 17,
                    color: '#173B3C',
                    outline: 'none',
                  }}
                />

                <span
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform:
                      'translateY(-50%)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#7A8D8E',
                  }}
                >
                  mmHg
                </span>
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 11,
                  color: '#839394',
                }}
              >
                Upper number
              </div>
            </div>

            {/* Diastolic */}
            <div>
              <label
                htmlFor="diastolic"
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#315657',
                  marginBottom: 8,
                }}
              >
                Diastolic
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  id="diastolic"
                  type="number"
                  inputMode="numeric"
                  value={diastolic}
                  onChange={(e) =>
                    setDiastolic(e.target.value)
                  }
                  placeholder="80"
                  min="40"
                  max="150"
                  style={{
                    width: '100%',
                    height: 54,
                    borderRadius: 14,
                    border: '1px solid #D5E5E4',
                    background: '#FAFCFC',
                    padding: '0 68px 0 15px',
                    fontSize: 17,
                    color: '#173B3C',
                    outline: 'none',
                  }}
                />

                <span
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform:
                      'translateY(-50%)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#7A8D8E',
                  }}
                >
                  mmHg
                </span>
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 11,
                  color: '#839394',
                }}
              >
                Lower number
              </div>
            </div>
          </div>

          {/* Pulse */}
          <div style={{ marginTop: 17 }}>
            <label
              htmlFor="pulse"
              style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 700,
                color: '#315657',
                marginBottom: 8,
              }}
            >
              Pulse
              <span
                style={{
                  fontWeight: 500,
                  color: '#8A9A9B',
                  marginLeft: 6,
                }}
              >
                (optional)
              </span>
            </label>

            <div style={{ position: 'relative' }}>
              <input
                id="pulse"
                type="number"
                inputMode="numeric"
                value={pulse}
                onChange={(e) =>
                  setPulse(e.target.value)
                }
                placeholder="72"
                min="30"
                max="220"
                style={{
                  width: '100%',
                  height: 54,
                  borderRadius: 14,
                  border: '1px solid #D5E5E4',
                  background: '#FAFCFC',
                  padding: '0 48px 0 15px',
                  fontSize: 17,
                  color: '#173B3C',
                  outline: 'none',
                }}
              />

              <span
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform:
                    'translateY(-50%)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#7A8D8E',
                }}
              >
                bpm
              </span>
            </div>
          </div>

          {/* Date + Time */}
          <div
            className="bp-date-grid"
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(2, minmax(0, 1fr))',
              gap: 14,
              marginTop: 17,
            }}
          >
            <div>
              <label
                htmlFor="bp-date"
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#315657',
                  marginBottom: 8,
                }}
              >
                Date
              </label>

              <input
                id="bp-date"
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                style={{
                  width: '100%',
                  height: 52,
                  borderRadius: 14,
                  border: '1px solid #D5E5E4',
                  background: '#FAFCFC',
                  padding: '0 13px',
                  fontSize: 14,
                  color: '#315657',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="bp-time"
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#315657',
                  marginBottom: 8,
                }}
              >
                Time
              </label>

              <input
                id="bp-time"
                type="time"
                value={time}
                onChange={(e) =>
                  setTime(e.target.value)
                }
                style={{
                  width: '100%',
                  height: 52,
                  borderRadius: 14,
                  border: '1px solid #D5E5E4',
                  background: '#FAFCFC',
                  padding: '0 13px',
                  fontSize: 14,
                  color: '#315657',
                  outline: 'none',
                }}
              />
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
                alignItems: 'flex-start',
                gap: 8,
                color: '#C94A3A',
                fontSize: 13,
                lineHeight: 1.45,
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

          {/* Saved */}
          {saved && (
            <div
              style={{
                marginTop: 16,
                padding: '12px 14px',
                borderRadius: 12,
                background: '#EFFAF4',
                border: '1px solid #CDEDD9',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#218838',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Icon
                name="check"
                size={17}
                color="#27AE60"
              />

              Blood pressure reading saved successfully.
            </div>
          )}

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            style={{
              width: '100%',
              height: 54,
              marginTop: 20,
              border: 'none',
              borderRadius: 14,
              background: '#1B8D8F',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 750,
              cursor: 'pointer',
              boxShadow:
                '0 8px 20px rgba(27,141,143,0.20)',
            }}
          >
            Save Blood Pressure
          </button>
        </section>

        {/* History */}
        <section
          style={{
            marginTop: 20,
            background: '#FFFFFF',
            border: '1px solid #DDEDEC',
            borderRadius: 24,
            padding: 22,
            boxShadow:
              '0 10px 28px rgba(23,59,60,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              marginBottom: 17,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 19,
                  color: '#173B3C',
                }}
              >
                Blood Pressure History
              </h2>

              <p
                style={{
                  margin: '5px 0 0',
                  fontSize: 12,
                  color: '#7A8D8E',
                }}
              >
                Your saved readings
              </p>
            </div>

            {readings.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                style={{
                  border: '1px solid #F0D0CA',
                  background: '#FFF7F5',
                  color: '#C94A3A',
                  borderRadius: 10,
                  padding: '8px 11px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {readings.length === 0 ? (
            <div
              style={{
                padding: '30px 18px',
                borderRadius: 16,
                background: '#F8FBFA',
                border: '1px dashed #D5E7E5',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  margin: '0 auto 10px',
                  borderRadius: 14,
                  background: '#EAF7F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name="blood-pressure"
                  size={25}
                  color="#1B8D8F"
                />
              </div>

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#496364',
                }}
              >
                No readings yet
              </div>

              <div
                style={{
                  marginTop: 5,
                  fontSize: 12,
                  color: '#829293',
                }}
              >
                Save your first blood pressure reading above.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {readings.map((reading) => {
                const categoryColor =
                  getCategoryColor(
                    reading.category
                  );

                return (
                  <div
                    key={reading.id}
                    style={{
                      border: '1px solid #E0ECEB',
                      borderRadius: 16,
                      padding: 14,
                      background: '#FCFEFD',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 10,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: '#173B3C',
                            lineHeight: 1.1,
                          }}
                        >
                          {reading.systolic}
                          <span
                            style={{
                              color: '#8A9A9B',
                              fontWeight: 500,
                              margin: '0 4px',
                            }}
                          >
                            /
                          </span>
                          {reading.diastolic}
                          <span
                            style={{
                              fontSize: 11,
                              color: '#829293',
                              fontWeight: 600,
                              marginLeft: 5,
                            }}
                          >
                            mmHg
                          </span>
                        </div>

                        <div
                          style={{
                            marginTop: 5,
                            fontSize: 11,
                            color: '#829293',
                          }}
                        >
                          {reading.date} • {reading.time}
                        </div>
                      </div>

                      <div
                        style={{
                          padding: '5px 9px',
                          borderRadius: 20,
                          background: `${categoryColor}12`,
                          color: categoryColor,
                          fontSize: 10,
                          fontWeight: 750,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {reading.category}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 12,
                        paddingTop: 10,
                        borderTop:
                          '1px solid #EDF3F2',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: '#718384',
                        }}
                      >
                        Pulse:{' '}
                        <strong
                          style={{
                            color: '#315657',
                          }}
                        >
                          {reading.pulse !== null
                            ? `${reading.pulse} bpm`
                            : 'Not recorded'}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(reading.id)
                        }
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#C94A3A',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: '4px 2px',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* BP Guide */}
        <section
          style={{
            marginTop: 20,
            background: '#FFFFFF',
            border: '1px solid #DDEDEC',
            borderRadius: 20,
            padding: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
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
                size={21}
                color="#1B8D8F"
              />
            </div>

            <div>
              <h3
                style={{
                  margin: '1px 0 9px',
                  fontSize: 16,
                  color: '#173B3C',
                }}
              >
                About Blood Pressure
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: 12.5,
                  lineHeight: 1.6,
                  color: '#687D7E',
                }}
              >
                Blood pressure readings can vary depending
                on activity, stress, posture, and other factors.
                Take readings consistently and discuss repeated
                abnormal readings with a healthcare professional.
              </p>
            </div>
          </div>
        </section>

        {/* Safety Note */}
        <section
          style={{
            marginTop: 14,
            padding: '14px 15px',
            borderRadius: 15,
            background: '#FFF9F2',
            border: '1px solid #F2E0C4',
            display: 'flex',
            gap: 9,
            alignItems: 'flex-start',
          }}
        >
          <Icon
            name="warning"
            size={17}
            color="#C27A00"
          />

          <p
            style={{
              margin: 0,
              fontSize: 11.5,
              lineHeight: 1.55,
              color: '#7B684A',
            }}
          >
            This tracker is for personal record-keeping and
            general health awareness. It does not diagnose or
            replace professional medical advice. If a reading
            is extremely high or you have concerning symptoms,
            seek appropriate medical care promptly.
          </p>
        </section>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            padding: '25px 10px 5px',
            color: '#8A9A9B',
            fontSize: 11,
          }}
        >
          CareOn Health Tools • Caring Beyond Treatment
        </div>
      </main>

      {/* Responsive */}
      <style>
        {`
          input:focus {
            border-color: #1B8D8F !important;
            box-shadow: 0 0 0 3px rgba(27,141,143,0.10) !important;
          }

          button {
            -webkit-tap-highlight-color: transparent;
          }

          @media (max-width: 600px) {
            main {
              padding: 24px 14px 40px !important;
            }

            .bp-input-grid,
            .bp-date-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BloodPressure;