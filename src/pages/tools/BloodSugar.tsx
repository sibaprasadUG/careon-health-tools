import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon';

interface SugarRecord {
  id: number;
  value: number;
  type: 'Fasting' | 'Post Meal' | 'Random';
  date: string;
  time: string;
}

const BloodSugar: React.FC = () => {
  const navigate = useNavigate();

  const [sugar, setSugar] = useState('');
  const [type, setType] = useState<'Fasting' | 'Post Meal' | 'Random'>(
    'Fasting'
  );

  const [history, setHistory] = useState<SugarRecord[]>(() => {
    try {
      const saved = localStorage.getItem('careon-blood-sugar');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [error, setError] = useState('');

  const getStatus = (value: number, readingType: string) => {
    if (readingType === 'Fasting') {
      if (value < 70) return 'Low';
      if (value <= 99) return 'Normal';
      if (value <= 125) return 'Prediabetes Range';
      return 'High';
    }

    if (readingType === 'Post Meal') {
      if (value < 70) return 'Low';
      if (value < 140) return 'Normal';
      if (value <= 199) return 'High';
      return 'Very High';
    }

    if (value < 70) return 'Low';
    if (value < 140) return 'Normal';
    if (value <= 199) return 'High';
    return 'Very High';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Normal') return '#198754';
    if (status === 'Low') return '#D97706';
    if (status === 'High') return '#DC6B2F';
    return '#C94A3A';
  };

  const saveReading = () => {
    setError('');

    const value = parseFloat(sugar);

    if (isNaN(value)) {
      setError('Please enter a valid blood sugar reading.');
      return;
    }

    if (value < 20 || value > 600) {
      setError('Please enter a reading between 20 and 600 mg/dL.');
      return;
    }

    const now = new Date();

    const record: SugarRecord = {
      id: Date.now(),
      value,
      type,
      date: now.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      time: now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updatedHistory = [record, ...history];

    setHistory(updatedHistory);
    localStorage.setItem(
      'careon-blood-sugar',
      JSON.stringify(updatedHistory)
    );

    setSugar('');
  };

  const deleteReading = (id: number) => {
    const updatedHistory = history.filter(
      (record) => record.id !== id
    );

    setHistory(updatedHistory);

    localStorage.setItem(
      'careon-blood-sugar',
      JSON.stringify(updatedHistory)
    );
  };

  const clearAll = () => {
    if (history.length === 0) return;

    const confirmed = window.confirm(
      'Are you sure you want to clear all blood sugar records?'
    );

    if (!confirmed) return;

    setHistory([]);
    localStorage.removeItem('careon-blood-sugar');
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
              Blood Sugar
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
              name="blood-sugar"
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
            Blood Sugar
          </h1>

          <p
            style={{
              maxWidth: 500,
              margin: '10px auto 0',
              fontSize: 15,
              lineHeight: 1.6,
              color: '#667D7E',
            }}
          >
            Record and monitor your blood glucose
            measurements over time.
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
          {/* Reading Type */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 700,
                color: '#315657',
                marginBottom: 9,
              }}
            >
              Reading Type
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(3, minmax(0, 1fr))',
                gap: 9,
              }}
            >
              {(
                [
                  'Fasting',
                  'Post Meal',
                  'Random',
                ] as const
              ).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setType(option)}
                  style={{
                    minHeight: 50,
                    borderRadius: 13,
                    border:
                      type === option
                        ? '2px solid #1B8D8F'
                        : '1px solid #D5E5E4',
                    background:
                      type === option
                        ? '#E9F7F5'
                        : '#FFFFFF',
                    color:
                      type === option
                        ? '#147477'
                        : '#50696A',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Sugar Input */}
          <div>
            <label
              htmlFor="blood-sugar-input"
              style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 700,
                color: '#315657',
                marginBottom: 8,
              }}
            >
              Blood Sugar
            </label>

            <div
              style={{
                position: 'relative',
              }}
            >
              <input
                id="blood-sugar-input"
                type="number"
                value={sugar}
                onChange={(e) =>
                  setSugar(e.target.value)
                }
                placeholder="e.g. 100"
                min="20"
                max="600"
                step="1"
                style={{
                  width: '100%',
                  height: 54,
                  borderRadius: 14,
                  border: '1px solid #D5E5E4',
                  background: '#FAFCFC',
                  padding: '0 85px 0 15px',
                  fontSize: 17,
                  color: '#173B3C',
                  outline: 'none',
                }}
              />

              <span
                style={{
                  position: 'absolute',
                  right: 15,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#718384',
                }}
              >
                mg/dL
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: 15,
                padding: '12px 14px',
                borderRadius: 12,
                background: '#FFF4F2',
                border: '1px solid #F6D4CE',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#C94A3A',
                fontSize: 13,
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

          {/* Save */}
          <button
            type="button"
            onClick={saveReading}
            disabled={!sugar}
            style={{
              width: '100%',
              height: 54,
              marginTop: 20,
              border: 'none',
              borderRadius: 14,
              background: sugar
                ? '#1B8D8F'
                : '#B9D7D6',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 700,
              cursor: sugar
                ? 'pointer'
                : 'not-allowed',
              boxShadow: sugar
                ? '0 7px 18px rgba(27,141,143,0.22)'
                : 'none',
            }}
          >
            Save Blood Sugar
          </button>
        </section>

        {/* History */}
        <section
          style={{
            marginTop: 18,
            background: '#FFFFFF',
            border: '1px solid #DDEDEC',
            borderRadius: 24,
            padding: 24,
            boxShadow:
              '0 10px 30px rgba(23,59,60,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 21,
                  color: '#173B3C',
                }}
              >
                Blood Sugar History
              </h2>

              <p
                style={{
                  margin: '5px 0 0',
                  fontSize: 12,
                  color: '#758889',
                }}
              >
                Your saved readings
              </p>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                style={{
                  border: '1px solid #F2CFC8',
                  background: '#FFF8F6',
                  color: '#C94A3A',
                  borderRadius: 11,
                  padding: '8px 11px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div
              style={{
                padding: '28px 15px',
                textAlign: 'center',
                borderRadius: 15,
                background: '#F8FBFB',
                border: '1px dashed #D5E5E4',
              }}
            >
              <Icon
                name="blood-sugar"
                size={30}
                color="#9AB7B7"
              />

              <p
                style={{
                  margin: '10px 0 0',
                  color: '#7A8D8E',
                  fontSize: 13,
                }}
              >
                No blood sugar readings saved yet.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 11,
              }}
            >
              {history.map((record) => {
                const status = getStatus(
                  record.value,
                  record.type
                );

                return (
                  <div
                    key={record.id}
                    style={{
                      border: '1px solid #DCEDEA',
                      borderRadius: 16,
                      padding: '15px 15px 13px',
                      background: '#FCFEFE',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        alignItems: 'flex-start',
                        gap: 10,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 5,
                          }}
                        >
                          <strong
                            style={{
                              fontSize: 27,
                              color: '#173B3C',
                            }}
                          >
                            {record.value}
                          </strong>

                          <span
                            style={{
                              fontSize: 11,
                              color: '#718384',
                              fontWeight: 600,
                            }}
                          >
                            mg/dL
                          </span>
                        </div>

                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: '#758889',
                          }}
                        >
                          {record.type} • {record.date} •{' '}
                          {record.time}
                        </div>
                      </div>

                      <span
                        style={{
                          padding: '5px 9px',
                          borderRadius: 20,
                          background:
                            status === 'Normal'
                              ? '#E9F7EF'
                              : '#FFF5E8',
                          color:
                            getStatusColor(status),
                          fontSize: 10,
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {status}
                      </span>
                    </div>

                    <div
                      style={{
                        borderTop:
                          '1px solid #EDF3F2',
                        marginTop: 12,
                        paddingTop: 10,
                        display: 'flex',
                        justifyContent:
                          'flex-end',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          deleteReading(record.id)
                        }
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#D04C3D',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
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
              About Blood Sugar
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.6,
                color: '#687D7E',
              }}
            >
              Blood glucose readings can vary depending
              on meals, medicines, activity, timing and
              other individual factors. This tool is for
              personal tracking and general information.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <div
          style={{
            textAlign: 'center',
            padding: '22px 10px 5px',
            color: '#8A9A9B',
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          Blood sugar categories shown here are general
          reference ranges and are not a diagnosis.
          <br />
          Please consult a healthcare professional for
          interpretation of repeated abnormal readings.
          <br />
          <br />
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

            section {
              padding: 20px !important;
            }

            h1 {
              font-size: 27px !important;
            }

            input {
              font-size: 16px !important;
            }
          }

          input:focus {
            border-color: #1B8D8F !important;
            box-shadow:
              0 0 0 3px rgba(27,141,143,0.10) !important;
          }

          button {
            -webkit-tap-highlight-color: transparent;
          }
        `}
      </style>
    </div>
  );
};

export default BloodSugar;