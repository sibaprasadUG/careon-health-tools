import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Health Tools */}
        <Route path="/bmi" element={<BMICalculator />} />
        <Route path="/ideal-weight" element={<IdealWeight />} />
        <Route path="/bmr" element={<BMRCalculator />} />
        <Route path="/calories" element={<CaloriesCalculator />} />
        <Route path="/water" element={<WaterIntake />} />
        <Route path="/blood-pressure" element={<BloodPressure />} />
        <Route path="/blood-sugar" element={<BloodSugar />} />
        <Route path="/weight" element={<WeightTracker />} />

        {/* History */}
        <Route path="/history" element={<History />} />

        {/* Reports */}
        <Route path="/reports" element={<Reports />} />

        {/* Unknown URL → Home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;