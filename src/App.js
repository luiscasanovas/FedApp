import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CalendarView from './components/CalendarView';
import DailyLogView from './components/DailyLogView';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define route to capture day, month, and year */}
        <Route path="/" element={<CalendarView />} />
        <Route path="/log/:day/:month/:year" element={<DailyLogView />} />
      </Routes>
    </Router>
  );
}

export default App;
