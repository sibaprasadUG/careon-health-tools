import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon';

interface WeightRecord {
  id: number;
  weight: number;
  date: string;
  time: string;
}

const WeightTracker: React.FC = () => {
  const navigate = useNavigate();

  const [weight, setWeight] = useState('');
  const [history, setHistory] = useState<WeightRecord[]>(() => {
    try {
      const saved = localStorage.getItem('careon-weight-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [error, setError] = useState('');

  const saveWeight = () => {
    setError('');

    const value = parseFloat(weight);

    if (isNaN(value)) {
      setError('Please enter a valid weight.');
      return;
    }

    if (value < 20 || value > 300) {
      setError('Please enter a weight between 20 kg and 300 kg.');
      return;
    }

    const now = new Date();

    const record: WeightRecord = {
      id: Date.now(),
      weight: Math.round(value * 10) / 10,
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
      'careon-weight-history',
      JSON.stringify(updatedHistory)
    );

    setWeight('');
  };

  const deleteWeight = (id: number) => {
    const updatedHistory = history.filter(
      (record) => record.id !== id
    );

    setHistory(updatedHistory);

    localStorage.setItem(
      'careon-weight-history',
      JSON.stringify(updatedHistory)
    );
  };

  const clearAll = () => {
    if (history.length === 0) return;

    const confirmed = window.confirm(
      'Are you sure you want to clear all weight records?'
    );

    if (!confirmed) return;

    setHistory([]);
    localStorage.removeItem('careon-weight-history');
  };

  const getChange = (index: number) => {
    if (index >= history.length - 1) {
      return null;
    }

    const current = history[index].weight;
    const previous = history[index + 1].weight;

    const difference =
      Math.round((current - previous) * 10) / 10;

    return difference;
  };

  const latestWeight =
    history.length > 0 ? history[0].weight : null;

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
              Weight Tracker
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
              name="weight"
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
            Weight Tracker
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
            Record your body weight and follow your
            progress over time.
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
          <label
            htmlFor="weight-input"
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 700,
              color: '#315657',
              marginBottom: 8,
            }}
          >
            Current Weight
          </label>

          <div
            style={{
              position: 'relative',
            }}
          >
            <input
              id="weight-input"
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
                padding: '0 50px 0 15px',
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
              kg
            </span>
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

          {/* Save Button */}
          <button
            type="button"
            onClick={saveWeight}
            disabled={!weight}
            style={{
              width: '100%',
              height: 54,
              marginTop: 20,
              border: 'none',
              borderRadius: 14,
              background: weight
                ? '#1B8D8F'
                : '#B9D7D6',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 700,
              cursor: weight
                ? 'pointer'
                : 'not-allowed',
              boxShadow: weight
                ? '0 7px 18px rgba(27,141,143,0.22)'
                : 'none',
            }}
          >
            Save Weight
          </button>
        </section>

        {/* Latest Weight */}
        {latestWeight !== null && (
          <section
            style={{
              marginTop: 18,
              background:
                'linear-gradient(145deg, #E9F8F6, #FFFFFF)',
              border: '1px solid #CFEAE7',
              borderRadius: 24,
              padding: 24,
              boxShadow:
                '0 10px 30px rgba(23,59,60,0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: '#DDF4EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name="weight"
                  size={23}
                  color="#1B8D8F"
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
                  Latest Reading
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 20,
                    color: '#173B3C',
                  }}
                >
                  Current Weight
                </h2>
              </div>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #DCEDEA',
                borderRadius: 18,
                padding: '22px 18px',
                textAlign: 'center',
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
                {latestWeight}
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#617879',
                }}
              >
                kg
              </div>
            </div>
          </section>
        )}

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
                Weight History
              </h2>

              <p
                style={{
                  margin: '5px 0 0',
                  fontSize: 12,
                  color: '#758889',
                }}
              >
                Your saved weight readings
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
                padding: '30px 15px',
                textAlign: 'center',
                borderRadius: 15,
                background: '#F8FBFB',
                border: '1px dashed #D5E5E4',
              }}
            >
              <Icon
                name="weight"
                size={32}
                color="#9AB7B7"
              />

              <p
                style={{
                  margin: '10px 0 0',
                  color: '#7A8D8E',
                  fontSize: 13,
                }}
              >
                No weight readings saved yet.
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
              {history.map((record, index) => {
                const change = getChange(index);

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
                        alignItems: 'center',
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
                            {record.weight}
                          </strong>

                          <span
                            style={{
                              fontSize: 11,
                              color: '#718384',
                              fontWeight: 600,
                            }}
                          >
                            kg
                          </span>
                        </div>

                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: '#758889',
                          }}
                        >
                          {record.date} • {record.time}
                        </div>
                      </div>

                      {change !== null && (
                        <span
                          style={{
                            padding: '5px 9px',
                            borderRadius: 20,
                            background:
                              change > 0
                                ? '#FFF4F0'
                                : change < 0
                                ? '#EAF7F1'
                                : '#F3F7F7',
                            color:
                              change > 0
                                ? '#D05A3E'
                                : change < 0
                                ? '#198754'
                                : '#718384',
                            fontSize: 11,
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {change > 0
                            ? `+${change} kg`
                            : `${change} kg`}
                        </span>
                      )}
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
                          deleteWeight(record.id)
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
              About Weight Tracking
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.6,
                color: '#687D7E',
              }}
            >
              Regular weight measurements can help you
              observe changes over time. For more useful
              comparisons, try to measure under similar
              conditions each time.
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
            lineHeight: 1.5,
          }}
        >
          CareOn Health Tools • Caring Beyond Treatment
          <br />
          For general health tracking and personal records.
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

export default WeightTracker;