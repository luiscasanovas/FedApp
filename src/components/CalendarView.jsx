import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; 
import { signOut } from 'firebase/auth'; 

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [babyName, setBabyName] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBabyInfo = async () => {
      const userId = auth.currentUser.uid;

      try {
        const userDocRef = doc(db, `users/${userId}`); 
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const babyInfo = userDocSnap.data().babyInfo; 
          setBabyName(babyInfo?.name || 'Baby');
        }
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching baby info: ", error);
        setLoading(false);
      }
    };

    fetchBabyInfo();
  }, []);

  const onDateChange = (date) => {
    setSelectedDate(date);

    const day = ('0' + date.getDate()).slice(-2); 
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const year = date.getFullYear();

    navigate(`/log/${day}/${month}/${year}`);
  };

  const handleLogout = async () => {
    await signOut(auth); 
    navigate('/login'); 
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <h1>{babyName ? `${babyName}'s Daily Tracker` : "Baby's Daily Tracker"}</h1>
      <Calendar 
        onChange={onDateChange} 
        value={selectedDate} 
        locale="en-US"
      />
      
      <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>
    </div>
  );
};

export default CalendarView;
