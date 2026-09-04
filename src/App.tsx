import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import History from './pages/History';
import Reports from './pages/Reports';

import BMICalculator from './pages/tools/BMICalculator';
import IdealWeight from './pages/tools/IdealWeight';
import BMRCalculator from './pages/tools/BMRCalculator';
import CaloriesCalculator from './pages/tools/CaloriesCalculator';
import WaterIntake from './pages/tools/WaterIntake';
import BloodPressure from './pages/tools/BloodPressure';
import BloodSugar from './pages/tools/BloodSugar';
import WeightTracker from './pages/tools/WeightTracker';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/bmi" element={<BMICalculator />} />
        <Route path="/ideal-weight" element={<IdealWeight />} />
        <Route path="/bmr" element={<BMRCalculator />} />
        <Route path="/calories" element={<CaloriesCalculator />} />
        <Route path="/water" element={<WaterIntake />} />
        <Route path="/blood-pressure" element={<BloodPressure />} />
        <Route path="/blood-sugar" element={<BloodSugar />} />
        <Route path="/weight" element={<WeightTracker />} />

        <Route path="/history" element={<History />} />
        <Route path="/reports" element={<Reports />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;