import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CalendarView from './components/CalendarView';
import DailyLogView from './components/DailyLogView';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BabyForm from './components/BabyForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [babyInfoExists, setBabyInfoExists] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);

        try {
          const userDocRef = doc(db, `users/${user.uid}`);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const babyInfo = userDocSnap.data().babyInfo;
            if (babyInfo) {
              setBabyInfoExists(true);
            } else {
              setBabyInfoExists(false);
            }
          } else {
            setBabyInfoExists(false);
          }
        } catch (error) {
          console.error('Error fetching baby info: ', error);
          setBabyInfoExists(false);
        }
      } else {
        setIsAuthenticated(false);
        setBabyInfoExists(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              {babyInfoExists === false ? (
                <Route path="/" element={<BabyForm />} />
              ) : (
                <>
                  <Route path="/" element={<CalendarView />} />
                  <Route path="/log/:day/:month/:year" element={<DailyLogView />} /> {/* Route for DailyLogView */}
                </>
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;
