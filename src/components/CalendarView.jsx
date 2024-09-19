import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import { useNavigate } from 'react-router-dom';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  // When the user clicks on a date, navigate to the detailed view for that day
  const onDateChange = (date) => {
    setSelectedDate(date);

    // Format the date into day, month, and year
    const day = ('0' + date.getDate()).slice(-2); // Add leading 0 if needed
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Month is zero-based, so add 1
    const year = date.getFullYear();

    // Navigate to the route in the format "/log/day/month/year"
    navigate(`/log/${day}/${month}/${year}`);
  };

  return (
    <div>
      <h1>Baby's Daily Tracker</h1>
      <Calendar 
        onChange={onDateChange} 
        value={selectedDate} 
        locale="en-US" // Or "es-ES" for Spanish
      />
    </div>
  );
};

export default CalendarView;
