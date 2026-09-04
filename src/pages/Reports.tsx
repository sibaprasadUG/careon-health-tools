import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

// ============================================================
// COORDINATE SYSTEM - Based on 1536 x 1024 template image
// ============================================================
const pxX = (px: number): number => (px / 1536) * 210;
const pxY = (px: number): number => (px / 1024) * 148;

// ============================================================
// TYPES
// ============================================================
interface PatientData {
  name: string;
  age: string;
  gender: string;
  mobile: string;
}

interface HealthData {
  height: number | null;
  weight: number | null;
  bmi: number | null;
  systolic: number | null;
  diastolic: number | null;
  pulse: number | null;
  sugar: number | null;
  sugarType: string;
  water: number | null;
}

interface BloodPressureRecord {
  systolic: number;
  diastolic: number;
  date: string;
  time: string;
}

interface BloodSugarRecord {
  value: number;
  type: string;
  date: string;
  time: string;
}

interface WeightRecord {
  weight: number;
  date: string;
  time: string;
}

// ============================================================
// DEFAULT DATA
// ============================================================
const DEFAULT_PATIENT: PatientData = {
  name: 'Sibaprasad Maity',
  age: '50',
  gender: 'Male',
  mobile: '9734660589'
};

const DEFAULT_HEALTH: HealthData = {
  height: 172,
  weight: 70.0,
  bmi: 23.7,
  systolic: 120,
  diastolic: 80,
  pulse: 70,
  sugar: 195,
  sugarType: 'Post Meal',
  water: 2.5
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientData>(DEFAULT_PATIENT);
  const [health, setHealth] = useState<HealthData>(DEFAULT_HEALTH);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // ============================================================
  // DATA LOADING
  // ============================================================
  useEffect(() => {
    loadData();
  }, []);

  const loadData = (): void => {
    try {
      // Load patient data
      const savedPatient = localStorage.getItem('careon_patient_data');
      if (savedPatient) {
        const parsed = JSON.parse(savedPatient);
        setPatient(prev => ({ ...prev, ...parsed }));
      }

      // Load height
      const heightData = localStorage.getItem('careon_height');
      if (heightData) {
        setHealth(prev => ({ ...prev, height: parseFloat(heightData) }));
      }

      // Load weight from history
      const weightHistory: WeightRecord[] = JSON.parse(
        localStorage.getItem('careon-weight-history') || '[]'
      );
      if (weightHistory.length > 0) {
        const latest = weightHistory[weightHistory.length - 1];
        setHealth(prev => ({ ...prev, weight: latest.weight }));
      }

      // Load BMI from history
      const bmiHistory = JSON.parse(localStorage.getItem('careon_bmi_history') || '[]');
      if (bmiHistory.length > 0) {
        const latest = bmiHistory[bmiHistory.length - 1];
        setHealth(prev => ({ ...prev, bmi: latest.value }));
      }

      // Load blood pressure from history
      const bpHistory: BloodPressureRecord[] = JSON.parse(
        localStorage.getItem('careon_blood_pressure_history') || '[]'
      );
      if (bpHistory.length > 0) {
        const latest = bpHistory[bpHistory.length - 1];
        setHealth(prev => ({
          ...prev,
          systolic: latest.systolic,
          diastolic: latest.diastolic
        }));
      }

      // Load blood sugar from history
      const sugarHistory: BloodSugarRecord[] = JSON.parse(
        localStorage.getItem('careon-blood-sugar') || '[]'
      );
      if (sugarHistory.length > 0) {
        const latest = sugarHistory[sugarHistory.length - 1];
        setHealth(prev => ({
          ...prev,
          sugar: latest.value,
          sugarType: latest.type || 'Post Meal'
        }));
      }

      // Load water intake from history
      const waterHistory = JSON.parse(localStorage.getItem('careon_water_history') || '[]');
      if (waterHistory.length > 0) {
        const latest = waterHistory[waterHistory.length - 1];
        setHealth(prev => ({ ...prev, water: latest.value }));
      }

    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================
  const calculateBMI = (): number | null => {
    if (health.height && health.weight) {
      const heightM = health.height / 100;
      return Math.round((health.weight / (heightM * heightM)) * 10) / 10;
    }
    return health.bmi;
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    if (bmi < 35) return 'Obesity Class I';
    if (bmi < 40) return 'Obesity Class II';
    return 'Obesity Class III';
  };

  const getBPStatus = (sys: number, dia: number): string => {
    if (sys >= 140 || dia >= 90) return 'High';
    if (sys >= 130 || dia >= 85) return 'Elevated';
    return 'Normal';
  };

  const getSugarStatus = (value: number, type: string): string => {
    if (type === 'Fasting') {
      if (value < 100) return 'Normal';
      if (value < 126) return 'Prediabetes';
      return 'High';
    }
    if (value < 140) return 'Normal';
    if (value < 200) return 'Prediabetes';
    return 'High';
  };

  const generateReportNumber = (): string => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const r = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `CHT-${y}${m}${day}-${r}`;
  };

  const generatePatientId = (): string => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `CHT-${y}${m}${day}001`;
  };

  const formatDate = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // ============================================================
  // PDF RENDERING ENGINE
  // ============================================================
  const generatePDF = (): Promise<jsPDF> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = '/careon-health-tools/assets/health-report-template.png';

      img.onload = () => {
        try {
          // Create PDF
          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a5',
            compress: true
          });

          // Add template as background
          doc.addImage(img, 'PNG', 0, 0, 210, 148, undefined, 'FAST');

          // ============================================================
          // DATA PREPARATION
          // ============================================================
          const bmi = calculateBMI();
          const bmiCategory = bmi !== null ? getBMICategory(bmi) : '--';
          const bpStatus = (health.systolic !== null && health.diastolic !== null)
            ? getBPStatus(health.systolic, health.diastolic)
            : '--';
          const sugarStatus = health.sugar !== null
            ? getSugarStatus(health.sugar, health.sugarType)
            : '--';
          const reportDate = formatDate(new Date());
          const reportNo = generateReportNumber();
          const patientId = generatePatientId();

          // Weight status based on BMI
          let weightStatus = '--';
          if (bmi !== null) {
            if (bmi < 18.5) weightStatus = 'Low';
            else if (bmi < 25) weightStatus = 'Good';
            else if (bmi < 30) weightStatus = 'Over';
            else weightStatus = 'High';
          }

          // ============================================================
          // DRAWING HELPER
          // ============================================================
          const drawField = (
            x: number,
            y: number,
            w: number,
            h: number,
            text: string,
            fontSize: number = 10,
            align: 'left' | 'center' = 'left',
            bold: boolean = false
          ): void => {
            // White mask
            doc.setFillColor(255, 255, 255);
            doc.rect(pxX(x), pxY(y), pxX(w), pxY(h), 'F');

            // Text
            doc.setFont('helvetica', bold ? 'bold' : 'normal');
            doc.setFontSize(fontSize);
            doc.setTextColor('#071D5C');

            const tx = align === 'center' ? pxX(x + w / 2) : pxX(x + 2);
            const ty = pxY(y + h / 2 + 1.5);

            if (align === 'center') {
              doc.text(text, tx, ty, { align: 'center' });
            } else {
              doc.text(text, tx, ty);
            }
          };

          // ============================================================
          // PATIENT INFORMATION (Coordinates from template)
          // ============================================================
          // Name: x=420, y=183, w=220, h=14
          const name = patient.name || '--';
          drawField(420, 183, 220, 14, name, name.length > 20 ? 8 : 10);

          // Age: x=748, y=183, w=100, h=14
          const age = patient.age ? `${patient.age} Years` : '--';
          drawField(748, 183, 100, 14, age, 10);

          // Gender: x=948, y=183, w=80, h=14
          const gender = patient.gender || '--';
          drawField(948, 183, 80, 14, gender, 10);

          // Mobile: x=1150, y=183, w=180, h=14
          const mobile = patient.mobile || '--';
          drawField(1150, 183, 180, 14, mobile, 10);

          // ============================================================
          // REPORT INFORMATION
          // ============================================================
          // Report Date: x=420, y=222, w=200, h=14
          drawField(420, 222, 200, 14, reportDate, 10);

          // Report No: x=748, y=222, w=250, h=14
          drawField(748, 222, 250, 14, reportNo, 9);

          // Patient ID: x=1150, y=222, w=180, h=14
          drawField(1150, 222, 180, 14, patientId, 9);

          // ============================================================
          // HEALTH SUMMARY
          // ============================================================
          // BMI Value: x=460, y=276, w=80, h=20
          const bmiVal = bmi !== null ? bmi.toFixed(1) : '--';
          drawField(460, 276, 80, 20, bmiVal, 12, 'center', true);

          // BMI Status: x=460, y=296, w=80, h=14
          drawField(460, 296, 80, 14, bmiCategory, 8, 'center');

          // Weight Value: x=665, y=276, w=100, h=20
          const wtVal = health.weight !== null ? `${health.weight.toFixed(1)} kg` : '--';
          drawField(665, 276, 100, 20, wtVal, 11, 'center', true);

          // Weight Status: x=665, y=296, w=100, h=14
          drawField(665, 296, 100, 14, weightStatus, 8, 'center');

          // BP Value: x=870, y=276, w=120, h=20
          const bpVal = (health.systolic !== null && health.diastolic !== null)
            ? `${health.systolic} / ${health.diastolic}`
            : '--';
          drawField(870, 276, 120, 20, bpVal, 10, 'center', true);

          // BP Unit: x=870, y=296, w=120, h=14
          drawField(870, 296, 120, 14, 'mmHg', 8, 'center');

          // BP Status: x=1020, y=296, w=80, h=14
          drawField(1020, 296, 80, 14, bpStatus, 8, 'center');

          // Sugar Value: x=1070, y=276, w=140, h=20
          const sugVal = health.sugar !== null ? `${health.sugar}` : '--';
          drawField(1070, 276, 140, 20, sugVal, 11, 'center', true);

          // Sugar Unit: x=1070, y=296, w=140, h=14
          drawField(1070, 296, 140, 14, 'mg/dL', 8, 'center');

          // Sugar Status: x=1220, y=296, w=80, h=14
          drawField(1220, 296, 80, 14, sugarStatus, 8, 'center');

          // Water Value: x=1280, y=276, w=100, h=20
          const watVal = health.water !== null ? `${health.water.toFixed(1)}` : '--';
          drawField(1280, 276, 100, 20, watVal, 11, 'center', true);

          // Water Unit: x=1280, y=296, w=100, h=14
          drawField(1280, 296, 100, 14, 'L', 8, 'center');

          // ============================================================
          // DETAILED MEASUREMENTS
          // ============================================================
          // Height: x=554, y=372, w=100, h=20
          const htVal = health.height !== null ? `${health.height}` : '--';
          drawField(554, 372, 100, 20, htVal, 10);

          // Weight: x=554, y=409, w=100, h=20
          const wtDtl = health.weight !== null ? `${health.weight.toFixed(1)}` : '--';
          drawField(554, 409, 100, 20, wtDtl, 10);

          // BMI: x=554, y=446, w=100, h=20
          const bmiDtl = bmi !== null ? bmi.toFixed(1) : '--';
          drawField(554, 446, 100, 20, bmiDtl, 10);

          // BP: x=554, y=483, w=100, h=20
          const bpDtl = (health.systolic !== null && health.diastolic !== null)
            ? `${health.systolic} / ${health.diastolic}`
            : '--';
          drawField(554, 483, 100, 20, bpDtl, 9);

          // Pulse: x=554, y=520, w=100, h=20
          const pulseVal = health.pulse !== null ? `${health.pulse}` : '--';
          drawField(554, 520, 100, 20, pulseVal, 10);

          // Sugar: x=554, y=557, w=100, h=20
          const sugDtl = health.sugar !== null ? `${health.sugar}` : '--';
          drawField(554, 557, 100, 20, sugDtl, 10);

          // Water: x=554, y=594, w=100, h=20
          const watDtl = health.water !== null ? `${health.water.toFixed(1)}` : '--';
          drawField(554, 594, 100, 20, watDtl, 10);

          // ============================================================
          // HEALTH INSIGHT
          // ============================================================
          const insights: string[] = [];
          
          if (bmi !== null) {
            const cat = getBMICategory(bmi);
            if (cat === 'Normal') insights.push('BMI is in normal range. Keep maintaining.');
            else if (cat === 'Underweight') insights.push('BMI is below normal. Consider a balanced diet.');
            else if (cat === 'Overweight') insights.push('BMI is above normal. Consider regular exercise.');
            else insights.push(`BMI indicates ${cat}. Consult healthcare provider.`);
          }

          if (health.systolic !== null && health.diastolic !== null) {
            insights.push(`Blood pressure: ${health.systolic}/${health.diastolic} mmHg (${bpStatus}).`);
          }

          if (health.sugar !== null) {
            insights.push(`Blood sugar: ${health.sugar} mg/dL (${sugarStatus}).`);
          }

          if (health.water !== null) {
            insights.push(`Water target: ${health.water.toFixed(1)} L/day. Stay hydrated!`);
          }

          insights.push('Maintain balanced diet & regular exercise.');

          // Draw each insight line
          const insightStartY = 700;
          const lineHeight = 18;

          insights.forEach((line, index) => {
            if (line.trim()) {
              const yPos = insightStartY + (index * lineHeight);
              // White mask for this line
              doc.setFillColor(255, 255, 255);
              doc.rect(pxX(180), pxY(yPos), pxX(1050), pxY(16), 'F');

              // Draw text
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(9);
              doc.setTextColor('#071D5C');
              doc.text(line, pxX(185), pxY(yPos + 11));
            }
          });

          resolve(doc);

        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load template image. Please check if health-report-template.png exists in the assets folder.'));
      };
    });
  };

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleGeneratePDF = async (): Promise<void> => {
    try {
      setIsGenerating(true);
      const doc = await generatePDF();
      const fileName = patient.name
        ? `CareOn-Health-Assessment-${patient.name}.pdf`
        : 'CareOn-Health-Assessment-Patient.pdf';
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSharePDF = async (): Promise<void> => {
    try {
      setIsGenerating(true);
      const doc = await generatePDF();
      const pdfBlob = doc.output('blob');

      const fileName = patient.name
        ? `CareOn-Health-Assessment-${patient.name}.pdf`
        : 'CareOn-Health-Assessment-Patient.pdf';

      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'CareOn Health Assessment Report',
          text: 'Here is your health assessment report from CareOn Medical Clinic.'
        });
      } else {
        // Fallback: download
        doc.save(fileName);
        alert('PDF downloaded. You can share it through your device\'s share menu.');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing PDF:', error);
        alert('Failed to share PDF. The file has been downloaded instead.');
        try {
          const doc = await generatePDF();
          const fileName = patient.name
            ? `CareOn-Health-Assessment-${patient.name}.pdf`
            : 'CareOn-Health-Assessment-Patient.pdf';
          doc.save(fileName);
        } catch (downloadError) {
          console.error('Error downloading PDF:', downloadError);
          alert('Failed to generate PDF. Please try again.');
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // ============================================================
  // UPDATE HANDLERS
  // ============================================================
  const updatePatient = (field: keyof PatientData, value: string): void => {
    const updated = { ...patient, [field]: value };
    setPatient(updated);
    localStorage.setItem('careon_patient_data', JSON.stringify(updated));
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F8FAFB 0%, #F0F7F5 100%)',
      padding: '16px'
    }}>
      {/* Header */}
      <div style={{ maxWidth: '800px', margin: '0 auto 24px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(27,141,143,0.1)',
            color: '#1A2332',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            padding: '10px 16px',
            borderRadius: '12px',
            transition: 'all 0.25s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            boxShadow: '0 2px 8px rgba(27,141,143,0.06)'
          }}
        >
          <span style={{ fontSize: '18px' }}>←</span>
          <span>Back to Health Tools</span>
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(145deg, #E7F7F5, #F5FBFA)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '1px solid rgba(27,141,143,0.08)',
            boxShadow: '0 4px 16px rgba(27,141,143,0.08)',
            fontSize: '32px'
          }}>
            📄
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#173B3C',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
          }}>
            Generate Health Report
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#5A7184',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Create a professional health assessment report with your health data.
          </p>
        </div>

        {/* Patient Information */}
        <div style={{
          marginBottom: '24px',
          padding: '24px 20px',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid rgba(27,141,143,0.06)',
          boxShadow: '0 4px 20px rgba(27,141,143,0.06)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#173B3C',
            margin: '0 0 16px 0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
          }}>
            Patient Information
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#173B3C',
                marginBottom: '6px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
              }}>
                Patient Name
              </label>
              <input
                type="text"
                value={patient.name}
                onChange={(e) => updatePatient('name', e.target.value)}
                placeholder="Enter patient name"
                style={{
                  padding: '10px 14px',
                  fontSize: '14px',
                  border: '2px solid #E8F0EF',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.25s ease',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
                  background: '#FAFCFB',
                  color: '#173B3C'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#173B3C',
                marginBottom: '6px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
              }}>
                Age (Years)
              </label>
              <input
                type="number"
                value={patient.age}
                onChange={(e) => updatePatient('age', e.target.value)}
                placeholder="Enter age"
                style={{
                  padding: '10px 14px',
                  fontSize: '14px',
                  border: '2px solid #E8F0EF',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.25s ease',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
                  background: '#FAFCFB',
                  color: '#173B3C'
                }}
                min="1"
                max="120"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#173B3C',
                marginBottom: '6px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
              }}>
                Gender
              </label>
              <select
                value={patient.gender}
                onChange={(e) => updatePatient('gender', e.target.value)}
                style={{
                  padding: '10px 14px',
                  fontSize: '14px',
                  border: '2px solid #E8F0EF',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.25s ease',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
                  background: '#FAFCFB',
                  color: '#173B3C'
                }}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#173B3C',
                marginBottom: '6px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
              }}>
                Mobile Number
              </label>
              <input
                type="tel"
                value={patient.mobile}
                onChange={(e) => updatePatient('mobile', e.target.value)}
                placeholder="Enter mobile number"
                style={{
                  padding: '10px 14px',
                  fontSize: '14px',
                  border: '2px solid #E8F0EF',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.25s ease',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
                  background: '#FAFCFB',
                  color: '#173B3C'
                }}
              />
            </div>
          </div>
        </div>

        {/* Health Data Summary */}
        <div style={{
          marginBottom: '24px',
          padding: '24px 20px',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid rgba(27,141,143,0.06)',
          boxShadow: '0 4px 20px rgba(27,141,143,0.06)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#173B3C',
            margin: '0 0 16px 0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
          }}>
            Health Data Summary
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px',
              background: '#F8FAFB',
              borderRadius: '10px',
              border: '1px solid rgba(27,141,143,0.06)'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#5A7184',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                marginBottom: '4px'
              }}>BMI</span>
              <span style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#173B3C'
              }}>{health.bmi !== null ? health.bmi.toFixed(1) : '--'}</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px',
              background: '#F8FAFB',
              borderRadius: '10px',
              border: '1px solid rgba(27,141,143,0.06)'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#5A7184',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                marginBottom: '4px'
              }}>Weight</span>
              <span style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#173B3C'
              }}>{health.weight !== null ? `${health.weight.toFixed(1)} kg` : '--'}</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px',
              background: '#F8FAFB',
              borderRadius: '10px',
              border: '1px solid rgba(27,141,143,0.06)'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#5A7184',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                marginBottom: '4px'
              }}>Blood Pressure</span>
              <span style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#173B3C'
              }}>{health.systolic !== null && health.diastolic !== null
                ? `${health.systolic}/${health.diastolic}`
                : '--'}</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px',
              background: '#F8FAFB',
              borderRadius: '10px',
              border: '1px solid rgba(27,141,143,0.06)'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#5A7184',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                marginBottom: '4px'
              }}>Pulse Rate</span>
              <span style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#173B3C'
              }}>{health.pulse !== null ? `${health.pulse} bpm` : '--'}</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px',
              background: '#F8FAFB',
              borderRadius: '10px',
              border: '1px solid rgba(27,141,143,0.06)'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#5A7184',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                marginBottom: '4px'
              }}>Blood Sugar</span>
              <span style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#173B3C'
              }}>{health.sugar !== null ? `${health.sugar} mg/dL` : '--'}</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '12px',
              background: '#F8FAFB',
              borderRadius: '10px',
              border: '1px solid rgba(27,141,143,0.06)'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#5A7184',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                marginBottom: '4px'
              }}>Water Target</span>
              <span style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#173B3C'
              }}>{health.water !== null ? `${health.water.toFixed(1)} L` : '--'}</span>
            </div>
          </div>
          <button
            onClick={loadData}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#1B8D8F',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
            }}
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            style={{
              width: '100%',
              padding: '14px 28px',
              background: 'linear-gradient(145deg, #1B8D8F, #147477)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              opacity: isGenerating ? 0.6 : 1,
              transition: 'all 0.25s ease',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
              boxShadow: '0 4px 16px rgba(27,141,143,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            ⬇️ {isGenerating ? 'Generating...' : 'Generate A5 PDF'}
          </button>
          <button
            onClick={handleSharePDF}
            disabled={isGenerating}
            style={{
              width: '100%',
              padding: '14px 28px',
              background: 'linear-gradient(145deg, #0B3B5C, #1A5276)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              opacity: isGenerating ? 0.6 : 1,
              transition: 'all 0.25s ease',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
              boxShadow: '0 4px 16px rgba(11,59,92,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            📤 Share PDF
          </button>
        </div>

        {/* Disclaimer */}
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '16px',
          background: '#FFF8E1',
          borderRadius: '12px',
          borderLeft: '4px solid #FFC107',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '18px' }}>ℹ️</span>
          <p style={{
            fontSize: '13px',
            color: '#6B7A8F',
            margin: 0,
            lineHeight: 1.5
          }}>
            This report is intended for informational and health-tracking purposes only.
            It does not replace professional medical evaluation or advice.
            For any health concerns, please consult a qualified doctor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;