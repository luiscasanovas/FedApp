import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [babyName, setBabyName] = useState(null);
  const [babyBirthday, setBabyBirthday] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const calculateBabyAge = (birthDate, selectedDate) => {
  if (!birthDate) return '';

  const [day, month, year] = birthDate.split('/');
  const birth = new Date(`${year}-${month}-${day}`);
  const selected = new Date(selectedDate);

  birth.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);

  if (selected < birth) {
    return `${babyName} wasn't born yet`;
  }

  if (selected.getTime() === birth.getTime()) {
    return `Welcome to the world ${babyName}!`;
  }

  if (selected.getDate() === birth.getDate() && selected.getMonth() === birth.getMonth()) {
    if (selected.getFullYear() !== birth.getFullYear()) {
      return `Happy Birthday ${babyName}!`;
    }
  }

  const diffTime = selected - birth;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let years = Math.floor(diffDays / 365);
  let remainingDays = diffDays % 365;
  let months = Math.floor(remainingDays / 30);
  let days = remainingDays % 30;

  let ageString = '';

  if (years > 0) {
    ageString += `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  if (months > 0) {
    if (ageString) ageString += ', ';
    ageString += `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  if (days > 0) {
    if (ageString) ageString += ' and ';
    ageString += `${days} ${days === 1 ? 'day' : 'days'}`;
  }

  return ageString ? `${babyName} is ${ageString} old` : `${babyName} is 0 days old`; 
};

  useEffect(() => {
    const fetchBabyInfo = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error('No user is logged in.');
        return;
      }

      try {
        const userDocRef = doc(db, `users/${userId}`);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const babyInfo = userDocSnap.data().babyInfo;
          setBabyName(babyInfo?.name || 'Baby');
          setBabyBirthday(babyInfo?.birthday); 
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching baby info: ', error);
        setLoading(false);
      }
    };

    fetchBabyInfo();
  }, []);

  useEffect(() => {
    const fetchLogsForDate = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const day = ('0' + selectedDate.getDate()).slice(-2);
      const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
      const year = selectedDate.getFullYear();
      const docId = `${year}-${month}-${day}`;

      const docRef = doc(db, `users/${userId}/dailyLogs/${docId}`);

      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setLogs(doc.data().logs || []);
        } else {
          setLogs([]);
        }
      });

      return () => {
        unsubscribe();
      };
    };

    fetchLogsForDate();
  }, [selectedDate]);

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setBabyName(null);
    navigate('/login');
  };

  const handleAddEntry = () => {
    const day = ('0' + selectedDate.getDate()).slice(-2);
    const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
    const year = selectedDate.getFullYear();
    navigate(`/log/${day}/${month}/${year}`); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">{babyName ? `${babyName}'s Daily Tracker` : "Baby's Daily Tracker"}</h1>
      <div className="calendar-box">
        <Calendar
          onChange={onDateChange}
          value={selectedDate}
          locale="en-US"
          className="react-calendar"
        />
      </div>

      <div className="logs-container">
        <h2>
          {babyName && babyBirthday ? `${calculateBabyAge(babyBirthday, selectedDate)}` : ''}
        </h2>
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={index} className="log-card">
              <p><strong>Start Time:</strong> {log.startTime}</p>
              <p><strong>End Time:</strong> {log.endTime}</p>
              <p><strong>Quantity:</strong> {log.quantity} ml</p>
              <p><strong>Breast Milk:</strong> Left: {log.breastMilk.left} min, Right: {log.breastMilk.right} min</p>
              <p><strong>Depositions:</strong> {log.depositions}</p>
              <p><strong>Comments:</strong> {log.comments}</p>
            </div>
          ))
        ) : (
          <p>No logs for this day yet.</p>
        )}
      </div>

      <button onClick={handleAddEntry} className="btn btn-primary mt-3">Add Entry</button>
      <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>
    </div>
  );
};

export default CalendarView;
