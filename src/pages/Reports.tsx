import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

// ============================================================
// CAREON HEALTH TOOLS — HEALTH ASSESSMENT REPORT
// A5 LANDSCAPE
// Template: 1536 × 1024 reference artwork
// PDF: 210 × 148 mm
// ============================================================

const TEMPLATE_WIDTH_PX = 1536;
const TEMPLATE_HEIGHT_PX = 1024;
const PDF_WIDTH_MM = 210;
const PDF_HEIGHT_MM = 148;

const pxX = (px: number): number =>
  (px / TEMPLATE_WIDTH_PX) * PDF_WIDTH_MM;

const pxY = (px: number): number =>
  (px / TEMPLATE_HEIGHT_PX) * PDF_HEIGHT_MM;

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
  pulse?: number;
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
// DEFAULTS
// ============================================================

const DEFAULT_PATIENT: PatientData = {
  name: '',
  age: '',
  gender: '',
  mobile: '',
};

const DEFAULT_HEALTH: HealthData = {
  height: null,
  weight: null,
  bmi: null,
  systolic: null,
  diastolic: null,
  pulse: null,
  sugar: null,
  sugarType: 'Fasting',
  water: null,
};

// ============================================================
// COMPONENT
// ============================================================

const Reports: React.FC = () => {
  const navigate = useNavigate();

  const [patient, setPatient] =
    useState<PatientData>(DEFAULT_PATIENT);

  const [health, setHealth] =
    useState<HealthData>(DEFAULT_HEALTH);

  const [isGenerating, setIsGenerating] =
    useState(false);

  // ==========================================================
  // LOAD LOCAL DATA
  // ==========================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = (): void => {
    try {
      let nextHealth: HealthData = {
        ...DEFAULT_HEALTH,
      };

      // ------------------------------------------------------
      // PATIENT
      // ------------------------------------------------------

      const savedPatient =
        localStorage.getItem('careon_patient_data');

      if (savedPatient) {
        try {
          const parsed = JSON.parse(savedPatient);

          setPatient({
            ...DEFAULT_PATIENT,
            ...parsed,
          });
        } catch {
          // Ignore invalid patient data
        }
      }

      // ------------------------------------------------------
      // HEIGHT
      // ------------------------------------------------------

      const heightData =
        localStorage.getItem('careon_height');

      if (heightData) {
        const height = parseFloat(heightData);

        if (!Number.isNaN(height)) {
          nextHealth.height = height;
        }
      }

      // ------------------------------------------------------
      // WEIGHT
      // ------------------------------------------------------

      const weightHistory: WeightRecord[] =
        JSON.parse(
          localStorage.getItem('careon-weight-history') || '[]'
        );

      if (Array.isArray(weightHistory) && weightHistory.length > 0) {
        const latest =
          weightHistory[weightHistory.length - 1];

        if (
          latest &&
          typeof latest.weight === 'number'
        ) {
          nextHealth.weight = latest.weight;
        }
      }

      // ------------------------------------------------------
      // BMI
      // ------------------------------------------------------

      const bmiHistory =
        JSON.parse(
          localStorage.getItem('careon_bmi_history') || '[]'
        );

      if (Array.isArray(bmiHistory) && bmiHistory.length > 0) {
        const latest =
          bmiHistory[bmiHistory.length - 1];

        if (
          latest &&
          typeof latest.value === 'number'
        ) {
          nextHealth.bmi = latest.value;
        }
      }

      // ------------------------------------------------------
      // BLOOD PRESSURE
      // ------------------------------------------------------

      const bpHistory: BloodPressureRecord[] =
        JSON.parse(
          localStorage.getItem(
            'careon_blood_pressure_history'
          ) || '[]'
        );

      if (Array.isArray(bpHistory) && bpHistory.length > 0) {
        const latest =
          bpHistory[bpHistory.length - 1];

        if (latest) {
          if (typeof latest.systolic === 'number') {
            nextHealth.systolic = latest.systolic;
          }

          if (typeof latest.diastolic === 'number') {
            nextHealth.diastolic = latest.diastolic;
          }

          if (typeof latest.pulse === 'number') {
            nextHealth.pulse = latest.pulse;
          }
        }
      }

      // ------------------------------------------------------
      // BLOOD SUGAR
      // ------------------------------------------------------

      const sugarHistory: BloodSugarRecord[] =
        JSON.parse(
          localStorage.getItem(
            'careon-blood-sugar'
          ) || '[]'
        );

      if (
        Array.isArray(sugarHistory) &&
        sugarHistory.length > 0
      ) {
        const latest =
          sugarHistory[sugarHistory.length - 1];

        if (latest) {
          if (typeof latest.value === 'number') {
            nextHealth.sugar = latest.value;
          }

          if (latest.type) {
            nextHealth.sugarType =
              String(latest.type);
          }
        }
      }

      // ------------------------------------------------------
      // WATER
      // ------------------------------------------------------

      const waterHistory =
        JSON.parse(
          localStorage.getItem(
            'careon_water_history'
          ) || '[]'
        );

      if (
        Array.isArray(waterHistory) &&
        waterHistory.length > 0
      ) {
        const latest =
          waterHistory[waterHistory.length - 1];

        if (
          latest &&
          typeof latest.value === 'number'
        ) {
          nextHealth.water = latest.value;
        }
      }

      // ------------------------------------------------------
      // CALCULATE BMI IF POSSIBLE
      // ------------------------------------------------------

      if (
        nextHealth.height !== null &&
        nextHealth.weight !== null &&
        nextHealth.height > 0
      ) {
        const heightM =
          nextHealth.height / 100;

        nextHealth.bmi =
          Math.round(
            (nextHealth.weight /
              (heightM * heightM)) *
              10
          ) / 10;
      }

      setHealth(nextHealth);

    } catch (error) {
      console.error(
        'Error loading CareOn report data:',
        error
      );
    }
  };

  // ==========================================================
  // CALCULATIONS
  // ==========================================================

  const calculateBMI = (): number | null => {
    if (
      health.height !== null &&
      health.weight !== null &&
      health.height > 0
    ) {
      const heightM =
        health.height / 100;

      return (
        Math.round(
          (health.weight /
            (heightM * heightM)) *
            10
        ) / 10
      );
    }

    return health.bmi;
  };

  const getBMICategory = (
    bmi: number
  ): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    if (bmi < 35) return 'Obesity Class I';
    if (bmi < 40) return 'Obesity Class II';
    return 'Obesity Class III';
  };

  const getBPStatus = (
    systolic: number,
    diastolic: number
  ): string => {
    if (
      systolic >= 140 ||
      diastolic >= 90
    ) {
      return 'High';
    }

    if (
      systolic >= 130 ||
      diastolic >= 80
    ) {
      return 'Elevated';
    }

    return 'Normal';
  };

  const getSugarStatus = (
    value: number,
    type: string
  ): string => {
    if (
      type.toLowerCase() === 'fasting'
    ) {
      if (value < 100) return 'Normal';
      if (value < 126) return 'Prediabetes';
      return 'High';
    }

    if (value < 140) return 'Normal';
    if (value < 200) return 'Prediabetes';

    return 'High';
  };

  const getWeightStatus = (
    bmi: number | null
  ): string => {
    if (bmi === null) return '--';

    if (bmi < 18.5) return 'Low';
    if (bmi < 25) return 'Good';
    if (bmi < 30) return 'Over';
    return 'High';
  };

  // ==========================================================
  // DATE / IDs
  // ==========================================================

  const formatDate = (
    date: Date
  ): string => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return `${String(
      date.getDate()
    ).padStart(2, '0')} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const generateReportNumber =
    (): string => {
      const d = new Date();

      const y =
        d.getFullYear();

      const m = String(
        d.getMonth() + 1
      ).padStart(2, '0');

      const day = String(
        d.getDate()
      ).padStart(2, '0');

      const random =
        String(
          Math.floor(
            Math.random() * 1000
          )
        ).padStart(3, '0');

      return `CHT-${y}${m}${day}-${random}`;
    };

  const generatePatientId =
    (): string => {
      const d = new Date();

      const y =
        d.getFullYear();

      const m = String(
        d.getMonth() + 1
      ).padStart(2, '0');

      const day = String(
        d.getDate()
      ).padStart(2, '0');

      return `CHT-${y}${m}${day}-001`;
    };

  // ==========================================================
  // PDF HELPERS
  // ==========================================================

  const mask = (
    doc: jsPDF,
    x: number,
    y: number,
    w: number,
    h: number
  ): void => {
    doc.setFillColor(
      255,
      255,
      255
    );

    doc.rect(
      pxX(x),
      pxY(y),
      pxX(w),
      pxY(h),
      'F'
    );
  };

  const drawText = (
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    fontSize = 8,
    bold = false,
    align:
      | 'left'
      | 'center'
      | 'right' = 'left'
  ): void => {
    doc.setFont(
      'helvetica',
      bold ? 'bold' : 'normal'
    );

    doc.setFontSize(fontSize);

    doc.setTextColor(
      7,
      29,
      92
    );

    doc.text(
      text,
      pxX(x),
      pxY(y),
      {
        align,
      }
    );
  };

  const drawCenteredValue = (
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    fontSize = 10,
    bold = true
  ): void => {
    drawText(
      doc,
      text,
      x,
      y,
      fontSize,
      bold,
      'center'
    );
  };

  // ==========================================================
  // STATUS PILL
  // Only redraws the text area.
  // The original template pill design remains intact.
  // ==========================================================

  const drawStatusText = (
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    color: 'normal' | 'warning' | 'danger' = 'normal'
  ): void => {
    let rgb: [
      number,
      number,
      number
    ];

    if (color === 'danger') {
      rgb = [255, 255, 255];
    } else {
      rgb = [255, 255, 255];
    }

    doc.setFont(
      'helvetica',
      'bold'
    );

    doc.setFontSize(7);

    doc.setTextColor(
      rgb[0],
      rgb[1],
      rgb[2]
    );

    doc.text(
      text,
      pxX(x),
      pxY(y),
      {
        align: 'center',
      }
    );
  };

  // ==========================================================
  // PDF GENERATOR
  // ==========================================================

  const generatePDF =
    (): Promise<jsPDF> => {
      return new Promise(
        (resolve, reject) => {
          const img =
            new Image();

          img.crossOrigin =
            'anonymous';

          // IMPORTANT:
          // Vite BASE_URL automatically becomes:
          // /careon-health-tools/
          //
          // Therefore this works on GitHub Pages.
          img.src =
            `${import.meta.env.BASE_URL}assets/health-report-template.png`;

          img.onload = () => {
            try {
              const doc =
                new jsPDF({
                  orientation:
                    'landscape',
                  unit: 'mm',
                  format: 'a5',
                  compress: true,
                });

              // ==================================================
              // 1. ORIGINAL TEMPLATE
              // ==================================================

              doc.addImage(
                img,
                'PNG',
                0,
                0,
                PDF_WIDTH_MM,
                PDF_HEIGHT_MM,
                undefined,
                'FAST'
              );

              // ==================================================
              // 2. DATA
              // ==================================================

              const bmi =
                calculateBMI();

              const bmiCategory =
                bmi !== null
                  ? getBMICategory(bmi)
                  : '--';

              const bpStatus =
                health.systolic !== null &&
                health.diastolic !== null
                  ? getBPStatus(
                      health.systolic,
                      health.diastolic
                    )
                  : '--';

              const sugarStatus =
                health.sugar !== null
                  ? getSugarStatus(
                      health.sugar,
                      health.sugarType
                    )
                  : '--';

              const weightStatus =
                getWeightStatus(
                  bmi
                );

              const reportDate =
                formatDate(
                  new Date()
                );

              const reportNo =
                generateReportNumber();

              const patientId =
                generatePatientId();

              // ==================================================
              // 3. PATIENT INFORMATION
              //
              // IMPORTANT:
              // These coordinates are BELOW the title bar.
              // The old code was drawing these around y=183,
              // which was actually the header area.
              // ==================================================

              // NAME
              mask(
                doc,
                190,
                390,
                235,
                30
              );

              drawText(
                doc,
                patient.name || '--',
                198,
                408,
                patient.name.length > 22
                  ? 7.5
                  : 8.5,
                true
              );

              // AGE
              mask(
                doc,
                190,
                421,
                130,
                30
              );

              drawText(
                doc,
                patient.age
                  ? `${patient.age} Years`
                  : '--',
                198,
                439,
                8.5,
                true
              );

              // GENDER
              mask(
                doc,
                190,
                451,
                130,
                30
              );

              drawText(
                doc,
                patient.gender || '--',
                198,
                469,
                8.5,
                true
              );

              // MOBILE
              mask(
                doc,
                190,
                482,
                200,
                30
              );

              drawText(
                doc,
                patient.mobile || '--',
                198,
                500,
                8.5,
                true
              );

              // ==================================================
              // 4. REPORT INFORMATION
              // ==================================================

              // REPORT DATE
              mask(
                doc,
                675,
                390,
                205,
                30
              );

              drawText(
                doc,
                reportDate,
                684,
                408,
                8.2,
                true
              );

              // REPORT NUMBER
              mask(
                doc,
                675,
                421,
                260,
                30
              );

              drawText(
                doc,
                reportNo,
                684,
                439,
                7.5,
                true
              );

              // PATIENT ID
              mask(
                doc,
                675,
                453,
                250,
                30
              );

              drawText(
                doc,
                patientId,
                684,
                471,
                7.5,
                true
              );

              // ==================================================
              // 5. HEALTH SUMMARY
              //
              // Only values are masked.
              // Icons, labels, card borders and design remain.
              // ==================================================

              // --------------------------------------------------
              // BMI
              // --------------------------------------------------

              mask(
                doc,
                65,
                635,
                160,
                45
              );

              drawCenteredValue(
                doc,
                bmi !== null
                  ? bmi.toFixed(1)
                  : '--',
                116,
                660,
                10.5,
                true
              );

              mask(
                doc,
                70,
                680,
                120,
                28
              );

              drawStatusText(
                doc,
                bmiCategory,
                119,
                702
              );

              // --------------------------------------------------
              // WEIGHT
              // --------------------------------------------------

              mask(
                doc,
                275,
                635,
                165,
                45
              );

              drawCenteredValue(
                doc,
                health.weight !== null
                  ? `${health.weight.toFixed(
                      1
                    )} kg`
                  : '--',
                335,
                660,
                10,
                true
              );

              mask(
                doc,
                285,
                680,
                130,
                28
              );

              drawStatusText(
                doc,
                weightStatus,
                350,
                702
              );

              // --------------------------------------------------
              // BLOOD PRESSURE
              // --------------------------------------------------

              mask(
                doc,
                495,
                632,
                180,
                48
              );

              drawCenteredValue(
                doc,
                health.systolic !== null &&
                  health.diastolic !== null
                  ? `${health.systolic} / ${health.diastolic}`
                  : '--',
                554,
                660,
                9.5,
                true
              );

              mask(
                doc,
                505,
                674,
                155,
                25
              );

              drawCenteredValue(
                doc,
                health.systolic !== null &&
                  health.diastolic !== null
                  ? 'mmHg'
                  : '',
                554,
                692,
                7.2,
                false
              );

              mask(
                doc,
                505,
                692,
                135,
                22
              );

              drawStatusText(
                doc,
                bpStatus,
                570,
                708
              );

              // --------------------------------------------------
              // BLOOD SUGAR
              // --------------------------------------------------

              mask(
                doc,
                700,
                635,
                170,
                45
              );

              drawCenteredValue(
                doc,
                health.sugar !== null
                  ? `${health.sugar}`
                  : '--',
                782,
                660,
                10,
                true
              );

              mask(
                doc,
                700,
                675,
                165,
                25
              );

              drawCenteredValue(
                doc,
                health.sugar !== null
                  ? 'mg/dL'
                  : '',
                782,
                692,
                7.2,
                false
              );

              mask(
                doc,
                715,
                694,
                145,
                22
              );

              drawStatusText(
                doc,
                sugarStatus,
                788,
                710
              );

              // --------------------------------------------------
              // WATER
              // --------------------------------------------------

              mask(
                doc,
                910,
                635,
                175,
                45
              );

              drawCenteredValue(
                doc,
                health.water !== null
                  ? `${health.water.toFixed(
                      1
                    )} L`
                  : '--',
                1010,
                660,
                10,
                true
              );

              mask(
                doc,
                925,
                680,
                150,
                28
              );

              drawStatusText(
                doc,
                health.water !== null
                  ? 'Recommended'
                  : '--',
                1000,
                703
              );

              // ==================================================
              // 6. DETAILED MEASUREMENTS
              //
              // Original table:
              // Parameter | Value | Unit | Reference | Status
              //
              // We ONLY replace value/status cells.
              // ==================================================

              const detailRows = {
                height: 796,
                weight: 819,
                bmi: 845,
                bp: 875,
                pulse: 899,
                sugar: 924,
                water: 946,
              };

              // VALUE COLUMN
              const valueX = 298;

              // STATUS COLUMN
              const statusX = 690;

              // --------------------------------------------------
              // HEIGHT
              // --------------------------------------------------

              mask(
                doc,
                270,
                783,
                90,
                25
              );

              drawCenteredValue(
                doc,
                health.height !== null
                  ? `${health.height}`
                  : '--',
                valueX,
                detailRows.height + 4,
                7.2,
                false
              );

              // --------------------------------------------------
              // WEIGHT
              // --------------------------------------------------

              mask(
                doc,
                270,
                807,
                90,
                25
              );

              drawCenteredValue(
                doc,
                health.weight !== null
                  ? health.weight.toFixed(
                      1
                    )
                  : '--',
                valueX,
                detailRows.weight + 4,
                7.2,
                false
              );

              // --------------------------------------------------
              // BMI
              // --------------------------------------------------

              mask(
                doc,
                270,
                833,
                90,
                25
              );

              drawCenteredValue(
                doc,
                bmi !== null
                  ? bmi.toFixed(1)
                  : '--',
                valueX,
                detailRows.bmi + 4,
                7.2,
                false
              );

              // --------------------------------------------------
              // BLOOD PRESSURE
              // --------------------------------------------------

              mask(
                doc,
                270,
                861,
                100,
                25
              );

              drawCenteredValue(
                doc,
                health.systolic !== null &&
                  health.diastolic !== null
                  ? `${health.systolic} / ${health.diastolic}`
                  : '--',
                valueX,
                detailRows.bp + 4,
                7,
                false
              );

              // --------------------------------------------------
              // PULSE
              // --------------------------------------------------

              mask(
                doc,
                270,
                886,
                90,
                25
              );

              drawCenteredValue(
                doc,
                health.pulse !== null
                  ? `${health.pulse}`
                  : '--',
                valueX,
                detailRows.pulse + 4,
                7.2,
                false
              );

              // --------------------------------------------------
              // BLOOD SUGAR
              // --------------------------------------------------

              mask(
                doc,
                270,
                911,
                90,
                25
              );

              drawCenteredValue(
                doc,
                health.sugar !== null
                  ? `${health.sugar}`
                  : '--',
                valueX,
                detailRows.sugar + 4,
                7.2,
                false
              );

              // --------------------------------------------------
              // WATER
              // --------------------------------------------------

              mask(
                doc,
                270,
                935,
                90,
                25
              );

              drawCenteredValue(
                doc,
                health.water !== null
                  ? health.water.toFixed(
                      1
                    )
                  : '--',
                valueX,
                detailRows.water + 4,
                7.2,
                false
              );

              // ==================================================
              // 7. DYNAMIC STATUS COLUMN
              // ==================================================

              // BMI status
              mask(
                doc,
                650,
                783,
                100,
                25
              );

              drawText(
                doc,
                bmiCategory,
                statusX,
                detailRows.height + 4,
                6.8,
                true
              );

              // Weight status
              mask(
                doc,
                650,
                807,
                100,
                25
              );

              drawText(
                doc,
                weightStatus,
                statusX,
                detailRows.weight + 4,
                6.8,
                true
              );

              // BMI row status
              mask(
                doc,
                650,
                833,
                100,
                25
              );

              drawText(
                doc,
                bmiCategory,
                statusX,
                detailRows.bmi + 4,
                6.8,
                true
              );

              // BP status
              mask(
                doc,
                650,
                861,
                100,
                25
              );

              drawText(
                doc,
                bpStatus,
                statusX,
                detailRows.bp + 4,
                6.8,
                true
              );

              // Pulse status
              mask(
                doc,
                650,
                886,
                100,
                25
              );

              drawText(
                doc,
                health.pulse !== null
                  ? 'Normal'
                  : '--',
                statusX,
                detailRows.pulse + 4,
                6.8,
                true
              );

              // Sugar status
              mask(
                doc,
                650,
                911,
                100,
                25
              );

              drawText(
                doc,
                sugarStatus,
                statusX,
                detailRows.sugar + 4,
                6.8,
                true
              );

              // Water status
              mask(
                doc,
                650,
                935,
                100,
                25
              );

              drawText(
                doc,
                health.water !== null
                  ? 'Recommended'
                  : '--',
                statusX,
                detailRows.water + 4,
                6.8,
                true
              );

              // ==================================================
              // 8. BLOOD SUGAR TABLE LABEL
              // ==================================================

              if (
                health.sugarType &&
                health.sugarType.toLowerCase() !==
                  'fasting'
              ) {
                mask(
                  doc,
                  35,
                  911,
                  190,
                  25
                );

                drawText(
                  doc,
                  `Blood Sugar (${health.sugarType})`,
                  45,
                  detailRows.sugar + 4,
                  6.3,
                  true
                );
              }

              // ==================================================
              // 9. HEALTH INSIGHT
              //
              // THIS WAS THE BIGGEST PROBLEM IN THE OLD CODE.
              //
              // The old code drew insight at x=180, y=700,
              // which covered the detailed measurement table.
              //
              // Correct area is the HEALTH INSIGHT panel
              // on the right side.
              // ==================================================

              // Clear ONLY the text area.
              // Keep green check icons untouched.

              mask(
                doc,
                820,
                775,
                300,
                185
              );

              const insights: string[] = [];

              if (bmi !== null) {
                if (
                  bmiCategory === 'Normal'
                ) {
                  insights.push(
                    'BMI is in normal range. Keep maintaining.'
                  );
                } else if (
                  bmiCategory === 'Underweight'
                ) {
                  insights.push(
                    'BMI is below normal range. Consider a balanced diet.'
                  );
                } else if (
                  bmiCategory === 'Overweight'
                ) {
                  insights.push(
                    'BMI is above normal range. Regular exercise may help.'
                  );
                } else {
                  insights.push(
                    `BMI indicates ${bmiCategory}. Consider professional guidance.`
                  );
                }
              }

              if (
                health.systolic !== null &&
                health.diastolic !== null
              ) {
                insights.push(
                  `Blood pressure is ${health.systolic}/${health.diastolic} mmHg (${bpStatus}).`
                );
              }

              if (
                health.sugar !== null
              ) {
                insights.push(
                  `Blood sugar: ${health.sugar} mg/dL (${sugarStatus}).`
                );
              }

              if (
                health.water !== null
              ) {
                insights.push(
                  `Stay hydrated — aim for ${health.water.toFixed(
                    1
                  )} L water daily.`
                );
              }

              insights.push(
                'Maintain balanced diet & regular exercise.'
              );

              const insightY = [
                790,
                822,
                854,
                886,
                918,
              ];

              insights
                .slice(0, 5)
                .forEach(
                  (
                    insight,
                    index
                  ) => {
                    drawText(
                      doc,
                      insight,
                      830,
                      insightY[index],
                      6.7,
                      false
                    );
                  }
                );

              // ==================================================
              // 10. PDF METADATA
              // ==================================================

              doc.setProperties({
                title:
                  'CareOn Health Assessment Report',
                subject:
                  'Health Assessment Report',
                author:
                  'CareOn Medical Clinic',
                creator:
                  'CareOn Health Tools',
                keywords:
                  'CareOn, Health Assessment, BMI, Blood Pressure, Blood Sugar',
              });

              resolve(doc);

            } catch (error) {
              reject(error);
            }
          };

          img.onerror = () => {
            reject(
              new Error(
                'Failed to load the CareOn report template image.'
              )
            );
          };
        }
      );
    };

  // ==========================================================
  // FILE NAME
  // ==========================================================

  const getFileName =
    (): string => {
      const safeName =
        patient.name
          .trim()
          .replace(
            /[^a-zA-Z0-9-_ ]/g,
            ''
          )
          .replace(
            /\s+/g,
            '-'
          );

      return safeName
        ? `CareOn-Health-Assessment-${safeName}.pdf`
        : 'CareOn-Health-Assessment-Report.pdf';
    };

  // ==========================================================
  // GENERATE PDF
  // ==========================================================

  const handleGeneratePDF =
    async (): Promise<void> => {
      try {
        setIsGenerating(true);

        const doc =
          await generatePDF();

        doc.save(
          getFileName()
        );

      } catch (error) {
        console.error(
          'PDF generation error:',
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : 'Failed to generate PDF.'
        );
      } finally {
        setIsGenerating(false);
      }
    };

  // ==========================================================
  // SHARE PDF
  // ==========================================================

  const handleSharePDF =
    async (): Promise<void> => {
      try {
        setIsGenerating(true);

        const doc =
          await generatePDF();

        const blob =
          doc.output('blob');

        const file =
          new File(
            [blob],
            getFileName(),
            {
              type: 'application/pdf',
            }
          );

        if (
          navigator.canShare &&
          navigator.canShare({
            files: [file],
          })
        ) {
          await navigator.share({
            files: [file],
            title:
              'CareOn Health Assessment Report',
            text:
              'Health assessment report from CareOn Medical Clinic.',
          });
        } else {
          doc.save(
            getFileName()
          );

          alert(
            'PDF downloaded successfully. You can share the PDF from your device.'
          );
        }

      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          'PDF share error:',
          error
        );

        try {
          const doc =
            await generatePDF();

          doc.save(
            getFileName()
          );

        } catch (downloadError) {
          console.error(
            downloadError
          );

          alert(
            'Unable to generate the PDF. Please try again.'
          );
        }
      } finally {
        setIsGenerating(false);
      }
    };

  // ==========================================================
  // PATIENT UPDATE
  // ==========================================================

  const updatePatient = (
    field: keyof PatientData,
    value: string
  ): void => {
    const updated = {
      ...patient,
      [field]: value,
    };

    setPatient(updated);

    localStorage.setItem(
      'careon_patient_data',
      JSON.stringify(updated)
    );
  };

  // ==========================================================
  // UI STYLES
  // ==========================================================

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background:
      'linear-gradient(180deg, #F8FAFB 0%, #F0F7F5 100%)',
    padding: '16px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
  };

  const cardStyle: React.CSSProperties = {
    marginBottom: '24px',
    padding: '24px 20px',
    background: '#FFFFFF',
    borderRadius: '16px',
    border:
      '1px solid rgba(27,141,143,0.06)',
    boxShadow:
      '0 4px 20px rgba(27,141,143,0.06)',
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    fontSize: '14px',
    border:
      '2px solid #E8F0EF',
    borderRadius: '10px',
    outline: 'none',
    background: '#FAFCFB',
    color: '#173B3C',
    fontFamily:
      'inherit',
    boxSizing: 'border-box',
    width: '100%',
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div style={pageStyle}>

      {/* ================================================
          TOP BACK BUTTON
      ================================================= */}

      <div
        style={{
          ...containerStyle,
          marginBottom: '24px',
        }}
      >
        <button
          onClick={() =>
            navigate('/')
          }
          style={{
            display:
              'inline-flex',
            alignItems:
              'center',
            gap: '8px',
            background:
              'rgba(255,255,255,0.85)',
            border:
              '1px solid rgba(27,141,143,0.1)',
            color: '#1A2332',
            fontSize: '14px',
            fontWeight: 500,
            cursor:
              'pointer',
            padding:
              '10px 16px',
            borderRadius:
              '12px',
          }}
        >
          <span
            style={{
              fontSize: '18px',
            }}
          >
            ←
          </span>

          <span>
            Back to Health Tools
          </span>
        </button>
      </div>

      <div
        style={containerStyle}
      >

        {/* ================================================
            TITLE
        ================================================= */}

        <div
          style={{
            textAlign:
              'center',
            marginBottom:
              '32px',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              background:
                'linear-gradient(145deg, #E7F7F5, #F5FBFA)',
              borderRadius:
                '20px',
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              margin:
                '0 auto 16px',
              fontSize:
                '32px',
            }}
          >
            📄
          </div>

          <h1
            style={{
              fontSize:
                '28px',
              fontWeight:
                700,
              color:
                '#173B3C',
              margin:
                '0 0 8px',
            }}
          >
            Generate Health Report
          </h1>

          <p
            style={{
              fontSize:
                '15px',
              color:
                '#5A7184',
              margin:
                0,
              lineHeight:
                1.6,
            }}
          >
            Create a professional health assessment report with your health data.
          </p>
        </div>

        {/* ================================================
            PATIENT INFORMATION
        ================================================= */}

        <div
          style={cardStyle}
        >
          <h2
            style={{
              fontSize:
                '18px',
              fontWeight:
                600,
              color:
                '#173B3C',
              margin:
                '0 0 16px',
            }}
          >
            Patient Information
          </h2>

          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap:
                '16px',
            }}
          >

            {/* NAME */}

            <div>
              <label
                style={{
                  display:
                    'block',
                  fontSize:
                    '13px',
                  fontWeight:
                    600,
                  color:
                    '#173B3C',
                  marginBottom:
                    '6px',
                }}
              >
                Patient Name
              </label>

              <input
                type="text"
                value={
                  patient.name
                }
                onChange={(
                  e
                ) =>
                  updatePatient(
                    'name',
                    e.target.value
                  )
                }
                placeholder="Enter patient name"
                style={
                  inputStyle
                }
              />
            </div>

            {/* AGE */}

            <div>
              <label
                style={{
                  display:
                    'block',
                  fontSize:
                    '13px',
                  fontWeight:
                    600,
                  color:
                    '#173B3C',
                  marginBottom:
                    '6px',
                }}
              >
                Age (Years)
              </label>

              <input
                type="number"
                value={
                  patient.age
                }
                onChange={(
                  e
                ) =>
                  updatePatient(
                    'age',
                    e.target.value
                  )
                }
                placeholder="Enter age"
                min="1"
                max="120"
                style={
                  inputStyle
                }
              />
            </div>

            {/* GENDER */}

            <div>
              <label
                style={{
                  display:
                    'block',
                  fontSize:
                    '13px',
                  fontWeight:
                    600,
                  color:
                    '#173B3C',
                  marginBottom:
                    '6px',
                }}
              >
                Gender
              </label>

              <select
                value={
                  patient.gender
                }
                onChange={(
                  e
                ) =>
                  updatePatient(
                    'gender',
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              >
                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* MOBILE */}

            <div>
              <label
                style={{
                  display:
                    'block',
                  fontSize:
                    '13px',
                  fontWeight:
                    600,
                  color:
                    '#173B3C',
                  marginBottom:
                    '6px',
                }}
              >
                Mobile Number
              </label>

              <input
                type="tel"
                value={
                  patient.mobile
                }
                onChange={(
                  e
                ) =>
                  updatePatient(
                    'mobile',
                    e.target.value
                  )
                }
                placeholder="Enter mobile number"
                style={
                  inputStyle
                }
              />
            </div>

          </div>
        </div>

        {/* ================================================
            HEALTH DATA SUMMARY
        ================================================= */}

        <div
          style={cardStyle}
        >
          <h2
            style={{
              fontSize:
                '18px',
              fontWeight:
                600,
              color:
                '#173B3C',
              margin:
                '0 0 16px',
            }}
          >
            Health Data Summary
          </h2>

          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                'repeat(3, 1fr)',
              gap:
                '16px',
              marginBottom:
                '16px',
            }}
          >

            {[
              [
                'BMI',
                bmiOrDash(
                  calculateBMI()
                ),
              ],
              [
                'Weight',
                health.weight !==
                null
                  ? `${health.weight.toFixed(
                      1
                    )} kg`
                  : '--',
              ],
              [
                'Blood Pressure',
                health.systolic !==
                  null &&
                health.diastolic !==
                  null
                  ? `${health.systolic}/${health.diastolic}`
                  : '--',
              ],
              [
                'Pulse Rate',
                health.pulse !==
                null
                  ? `${health.pulse} bpm`
                  : '--',
              ],
              [
                'Blood Sugar',
                health.sugar !==
                null
                  ? `${health.sugar} mg/dL`
                  : '--',
              ],
              [
                'Water Target',
                health.water !==
                null
                  ? `${health.water.toFixed(
                      1
                    )} L`
                  : '--',
              ],
            ].map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  style={{
                    padding:
                      '12px',
                    background:
                      '#F8FAFB',
                    borderRadius:
                      '10px',
                    border:
                      '1px solid rgba(27,141,143,0.06)',
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        '12px',
                      color:
                        '#5A7184',
                      textTransform:
                        'uppercase',
                      marginBottom:
                        '4px',
                    }}
                  >
                    {
                      item[0]
                    }
                  </div>

                  <div
                    style={{
                      fontSize:
                        '16px',
                      fontWeight:
                        600,
                      color:
                        '#173B3C',
                    }}
                  >
                    {
                      item[1]
                    }
                  </div>
                </div>
              )
            )}

          </div>

          <button
            onClick={
              loadData
            }
            style={{
              border:
                'none',
              background:
                'transparent',
              color:
                '#1B8D8F',
              cursor:
                'pointer',
              fontSize:
                '13px',
              fontWeight:
                500,
            }}
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* ================================================
            ACTION BUTTONS
        ================================================= */}

        <div
          style={{
            display:
              'flex',
            flexDirection:
              'column',
            gap:
              '12px',
            marginBottom:
              '24px',
          }}
        >

          <button
            onClick={
              handleGeneratePDF
            }
            disabled={
              isGenerating
            }
            style={{
              width:
                '100%',
              padding:
                '14px 28px',
              background:
                'linear-gradient(145deg, #1B8D8F, #147477)',
              color:
                '#FFFFFF',
              border:
                'none',
              borderRadius:
                '12px',
              fontSize:
                '16px',
              fontWeight:
                600,
              cursor:
                isGenerating
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                isGenerating
                  ? 0.6
                  : 1,
            }}
          >
            ⬇️{' '}
            {isGenerating
              ? 'Generating...'
              : 'Generate A5 PDF'}
          </button>

          <button
            onClick={
              handleSharePDF
            }
            disabled={
              isGenerating
            }
            style={{
              width:
                '100%',
              padding:
                '14px 28px',
              background:
                'linear-gradient(145deg, #0B3B5C, #1A5276)',
              color:
                '#FFFFFF',
              border:
                'none',
              borderRadius:
                '12px',
              fontSize:
                '16px',
              fontWeight:
                600,
              cursor:
                isGenerating
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                isGenerating
                  ? 0.6
                  : 1,
            }}
          >
            📤 Share PDF
          </button>

        </div>

        {/* ================================================
            DISCLAIMER
        ================================================= */}

        <div
          style={{
            display:
              'flex',
            gap:
              '12px',
            padding:
              '16px',
            background:
              '#FFF8E1',
            borderRadius:
              '12px',
            borderLeft:
              '4px solid #FFC107',
            marginBottom:
              '24px',
          }}
        >
          <span>
            ℹ️
          </span>

          <p
            style={{
              fontSize:
                '13px',
              color:
                '#6B7A8F',
              margin:
                0,
              lineHeight:
                1.5,
            }}
          >
            This report is intended for informational and health-tracking purposes only.
            It does not replace professional medical evaluation or advice.
            For any health concerns, please consult a qualified doctor.
          </p>
        </div>

      </div>
    </div>
  );
};

// ============================================================
// SMALL DISPLAY HELPER
// ============================================================

const bmiOrDash = (
  bmi: number | null
): string => {
  return bmi !== null
    ? bmi.toFixed(1)
    : '--';
};

export default Reports;