import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';

interface BPReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number | null;
  date: string;
  time: string;
  category: string;
}

interface SugarRecord {
  id: number;
  value: number;
  type: 'Fasting' | 'Post Meal' | 'Random';
  date: string;
  time: string;
}

interface WeightRecord {
  id: number;
  weight: number;
  date: string;
  time: string;
}

type HistoryType =
  | 'all'
  | 'blood-pressure'
  | 'blood-sugar'
  | 'weight';

interface HistoryItem {
  id: string;
  type: 'Blood Pressure' | 'Blood Sugar' | 'Weight';
  date: string;
  time: string;
  primary: string;
  secondary: string;
  status?: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] =
    useState<HistoryType>('all');

  const [bpHistory, setBpHistory] = useState<BPReading[]>([]);
  const [sugarHistory, setSugarHistory] =
    useState<SugarRecord[]>([]);
  const [weightHistory, setWeightHistory] =
    useState<WeightRecord[]>([]);

  useEffect(() => {
    try {
      const bpSaved =
        localStorage.getItem(
          'careon_blood_pressure_history'
        );

      const sugarSaved =
        localStorage.getItem(
          'careon-blood-sugar'
        );

      const weightSaved =
        localStorage.getItem(
          'careon-weight-history'
        );

      if (bpSaved) {
        const parsed = JSON.parse(bpSaved);

        if (Array.isArray(parsed)) {
          setBpHistory(parsed);
        }
      }

      if (sugarSaved) {
        const parsed = JSON.parse(sugarSaved);

        if (Array.isArray(parsed)) {
          setSugarHistory(parsed);
        }
      }

      if (weightSaved) {
        const parsed = JSON.parse(weightSaved);

        if (Array.isArray(parsed)) {
          setWeightHistory(parsed);
        }
      }
    } catch {
      setBpHistory([]);
      setSugarHistory([]);
      setWeightHistory([]);
    }
  }, []);

  const allHistory = useMemo<HistoryItem[]>(() => {
    const items: HistoryItem[] = [];

    bpHistory.forEach((reading) => {
      items.push({
        id: `bp-${reading.id}`,
        type: 'Blood Pressure',
        date: reading.date,
        time: reading.time,
        primary: `${reading.systolic}/${reading.diastolic}`,
        secondary:
          reading.pulse !== null
            ? `Pulse ${reading.pulse} bpm`
            : 'Pulse not recorded',
        status: reading.category,
      });
    });

    sugarHistory.forEach((record) => {
      items.push({
        id: `sugar-${record.id}`,
        type: 'Blood Sugar',
        date: record.date,
        time: record.time,
        primary: `${record.value}`,
        secondary: record.type,
      });
    });

    weightHistory.forEach((record) => {
      items.push({
        id: `weight-${record.id}`,
        type: 'Weight',
        date: record.date,
        time: record.time,
        primary: `${record.weight}`,
        secondary: 'Body weight',
      });
    });

    return items;
  }, [
    bpHistory,
    sugarHistory,
    weightHistory,
  ]);

  const filteredHistory = useMemo(() => {
    let filtered = allHistory;

    if (activeFilter === 'blood-pressure') {
      filtered = allHistory.filter(
        (item) => item.type === 'Blood Pressure'
      );
    }

    if (activeFilter === 'blood-sugar') {
      filtered = allHistory.filter(
        (item) => item.type === 'Blood Sugar'
      );
    }

    if (activeFilter === 'weight') {
      filtered = allHistory.filter(
        (item) => item.type === 'Weight'
      );
    }

    return filtered;
  }, [allHistory, activeFilter]);

  const totalRecords = allHistory.length;

  const deleteItem = (item: HistoryItem) => {
    if (item.type === 'Blood Pressure') {
      const id = item.id.replace('bp-', '');

      const updated = bpHistory.filter(
        (record) => String(record.id) !== id
      );

      setBpHistory(updated);

      localStorage.setItem(
        'careon_blood_pressure_history',
        JSON.stringify(updated)
      );
    }

    if (item.type === 'Blood Sugar') {
      const id = Number(
        item.id.replace('sugar-', '')
      );

      const updated = sugarHistory.filter(
        (record) => record.id !== id
      );

      setSugarHistory(updated);

      localStorage.setItem(
        'careon-blood-sugar',
        JSON.stringify(updated)
      );
    }

    if (item.type === 'Weight') {
      const id = Number(
        item.id.replace('weight-', '')
      );

      const updated = weightHistory.filter(
        (record) => record.id !== id
      );

      setWeightHistory(updated);

      localStorage.setItem(
        'careon-weight-history',
        JSON.stringify(updated)
      );
    }
  };

  const clearAllHistory = () => {
    if (totalRecords === 0) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete all health history?'
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      'careon_blood_pressure_history'
    );

    localStorage.removeItem(
      'careon-blood-sugar'
    );

    localStorage.removeItem(
      'careon-weight-history'
    );

    setBpHistory([]);
    setSugarHistory([]);
    setWeightHistory([]);
  };

  const getIconName = (
    type: HistoryItem['type']
  ) => {
    if (type === 'Blood Pressure') {
      return 'blood-pressure' as const;
    }

    if (type === 'Blood Sugar') {
      return 'blood-sugar' as const;
    }

    return 'weight' as const;
  };

  const getTypeColor = (
    type: HistoryItem['type']
  ) => {
    if (type === 'Blood Pressure') {
      return '#1B8D8F';
    }

    if (type === 'Blood Sugar') {
      return '#5B72B8';
    }

    return '#7B61A8';
  };

  const getStatusColor = (status?: string) => {
    if (!status) {
      return '#718384';
    }

    if (status === 'Normal') {
      return '#218838';
    }

    if (status === 'Elevated') {
      return '#B77900';
    }

    if (status === 'High') {
      return '#D35400';
    }

    if (status === 'Very High') {
      return '#C0392B';
    }

    return '#718384';
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
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: 900,
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
              Health History
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          width: '100%',
          maxWidth: 900,
          margin: '0 auto',
          padding: '30px 18px 50px',
        }}
      >
        {/* Page Title */}
        <section
          style={{
            textAlign: 'center',
            marginBottom: 25,
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
              name="info"
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
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            Health History
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
            View your saved health measurements in one
            simple place.
          </p>
        </section>

        {/* Summary */}
        <section
          className="history-summary-grid"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, minmax(0, 1fr))',
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #DDEDEC',
              borderRadius: 18,
              padding: 17,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 25,
                fontWeight: 800,
                color: '#1B8D8F',
              }}
            >
              {totalRecords}
            </div>

            <div
              style={{
                marginTop: 4,
                fontSize: 11,
                color: '#718384',
                fontWeight: 600,
              }}
            >
              Total Records
            </div>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #DDEDEC',
              borderRadius: 18,
              padding: 17,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 25,
                fontWeight: 800,
                color: '#1B8D8F',
              }}
            >
              {bpHistory.length}
            </div>

            <div
              style={{
                marginTop: 4,
                fontSize: 11,
                color: '#718384',
                fontWeight: 600,
              }}
            >
              BP Records
            </div>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #DDEDEC',
              borderRadius: 18,
              padding: 17,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 25,
                fontWeight: 800,
                color: '#5B72B8',
              }}
            >
              {sugarHistory.length}
            </div>

            <div
              style={{
                marginTop: 4,
                fontSize: 11,
                color: '#718384',
                fontWeight: 600,
              }}
            >
              Sugar Records
            </div>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #DDEDEC',
              borderRadius: 18,
              padding: 17,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 25,
                fontWeight: 800,
                color: '#7B61A8',
              }}
            >
              {weightHistory.length}
            </div>

            <div
              style={{
                marginTop: 4,
                fontSize: 11,
                color: '#718384',
                fontWeight: 600,
              }}
            >
              Weight Records
            </div>
          </div>
        </section>

        {/* Filter Card */}
        <section
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDEDEC',
            borderRadius: 20,
            padding: 16,
            marginBottom: 18,
            boxShadow:
              '0 8px 24px rgba(23,59,60,0.04)',
          }}
        >
          <div
            className="history-filter-grid"
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(4, minmax(0, 1fr))',
              gap: 9,
            }}
          >
            {[
              {
                id: 'all' as const,
                label: 'All',
              },
              {
                id: 'blood-pressure' as const,
                label: 'Blood Pressure',
              },
              {
                id: 'blood-sugar' as const,
                label: 'Blood Sugar',
              },
              {
                id: 'weight' as const,
                label: 'Weight',
              },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() =>
                  setActiveFilter(filter.id)
                }
                style={{
                  minHeight: 45,
                  borderRadius: 12,
                  border:
                    activeFilter === filter.id
                      ? '2px solid #1B8D8F'
                      : '1px solid #D5E5E4',
                  background:
                    activeFilter === filter.id
                      ? '#E9F7F5'
                      : '#FFFFFF',
                  color:
                    activeFilter === filter.id
                      ? '#147477'
                      : '#50696A',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {/* History List */}
        <section
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDEDEC',
            borderRadius: 24,
            padding: 22,
            boxShadow:
              '0 10px 30px rgba(23,59,60,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  color: '#173B3C',
                }}
              >
                Saved Records
              </h2>

              <p
                style={{
                  margin: '5px 0 0',
                  fontSize: 12,
                  color: '#7A8D8E',
                }}
              >
                {filteredHistory.length} record
                {filteredHistory.length === 1
                  ? ''
                  : 's'}
              </p>
            </div>

            {totalRecords > 0 && (
              <button
                type="button"
                onClick={clearAllHistory}
                style={{
                  border: '1px solid #F2CFC8',
                  background: '#FFF8F6',
                  color: '#C94A3A',
                  borderRadius: 11,
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

          {filteredHistory.length === 0 ? (
            <div
              style={{
                padding: '40px 18px',
                textAlign: 'center',
                borderRadius: 16,
                background: '#F8FBFB',
                border: '1px dashed #D5E5E4',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  margin: '0 auto 12px',
                  borderRadius: 15,
                  background: '#EAF7F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name="info"
                  size={28}
                  color="#9AB7B7"
                />
              </div>

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#536B6C',
                }}
              >
                No records found
              </div>

              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: 12,
                  color: '#839394',
                }}
              >
                Saved measurements will appear here.
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
              {filteredHistory.map((item) => {
                const iconColor =
                  getTypeColor(item.type);

                return (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #DCEDEA',
                      borderRadius: 17,
                      padding: 15,
                      background: '#FCFEFE',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 13,
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          flexShrink: 0,
                          borderRadius: 14,
                          background: `${iconColor}12`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon
                          name={getIconName(
                            item.type
                          )}
                          size={25}
                          color={iconColor}
                        />
                      </div>

                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 750,
                              color: '#315657',
                            }}
                          >
                            {item.type}
                          </span>

                          {item.status && (
                            <span
                              style={{
                                padding: '4px 8px',
                                borderRadius: 20,
                                background:
                                  `${getStatusColor(
                                    item.status
                                  )}12`,
                                color:
                                  getStatusColor(
                                    item.status
                                  ),
                                fontSize: 9,
                                fontWeight: 750,
                              }}
                            >
                              {item.status}
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            marginTop: 5,
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 5,
                          }}
                        >
                          <strong
                            style={{
                              fontSize: 23,
                              color: '#173B3C',
                            }}
                          >
                            {item.primary}
                          </strong>

                          <span
                            style={{
                              fontSize: 11,
                              color: '#718384',
                              fontWeight: 600,
                            }}
                          >
                            {item.type ===
                            'Blood Pressure'
                              ? 'mmHg'
                              : item.type ===
                                'Blood Sugar'
                              ? 'mg/dL'
                              : 'kg'}
                          </span>
                        </div>

                        <div
                          style={{
                            marginTop: 3,
                            fontSize: 11,
                            color: '#7A8D8E',
                          }}
                        >
                          {item.secondary}
                        </div>

                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 10,
                            color: '#98A6A7',
                          }}
                        >
                          {item.date} • {item.time}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          deleteItem(item)
                        }
                        aria-label={`Delete ${item.type} record`}
                        style={{
                          flexShrink: 0,
                          border: 'none',
                          background: 'transparent',
                          color: '#D04C3D',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: '7px 2px',
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

        {/* Information */}
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
              Your Privacy
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: 12.5,
                lineHeight: 1.6,
                color: '#687D7E',
              }}
            >
              Your current health tracker records are
              stored locally in this browser. They are not
              automatically uploaded to a server.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <div
          style={{
            textAlign: 'center',
            padding: '24px 10px 5px',
            color: '#8A9A9B',
            fontSize: 11,
            lineHeight: 1.55,
          }}
        >
          Health History is for general personal
          tracking and record-keeping.
          <br />
          It does not replace professional medical advice.
          <br />
          <br />
          CareOn Health Tools • Caring Beyond Treatment
        </div>
      </main>

      {/* Mobile Responsive */}
      <style>
        {`
          button {
            -webkit-tap-highlight-color: transparent;
          }

          @media (max-width: 700px) {
            .history-summary-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            .history-filter-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

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

            .history-summary-grid {
              gap: 9px !important;
            }

            .history-filter-grid {
              gap: 8px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default History;