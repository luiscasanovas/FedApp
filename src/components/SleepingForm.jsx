import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { FaArrowLeft } from 'react-icons/fa';

const SleepingForm = () => {
  const { day, month, year } = useParams();
  const docId = `${year}-${month}-${day}`;
  const [sleepLogs, setSleepLogs] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  const handleAddSleepLog = async (event) => {
    event.preventDefault();
    const startTime = event.target.startTime.value;
    const endTime = event.target.endTime.value;
    const notes = event.target.notes.value;

    const newSleepLog = {
      startTime,
      endTime,
      notes,
    };

    const userId = auth.currentUser?.uid;
    const docRef = doc(db, `users/${userId}/dailyLogs/${docId}`);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data();

      const updatedSleepLogs = existingData.sleepingLogs
        ? [...existingData.sleepingLogs, newSleepLog]
        : [newSleepLog];

      await setDoc(docRef, {
        ...existingData,
        sleepingLogs: updatedSleepLogs,
      });

      setSleepLogs(updatedSleepLogs);
    } else {
      await setDoc(docRef, {
        sleepingLogs: [newSleepLog],
      });
      setSleepLogs([newSleepLog]);
    }

    setIsFormVisible(false);
  };

  useEffect(() => {
    const fetchSleepLogs = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const docRef = doc(db, `users/${userId}/dailyLogs/${docId}`);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setSleepLogs(doc.data().sleepingLogs || []);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchSleepLogs();
  }, [docId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="log-container">
      <div className="log-box">
        <h2 className="log-title">Sleep Logs for {`${day}/${month}/${year}`}</h2>

        {sleepLogs.length > 0 ? (
          sleepLogs.map((log, index) => (
            <div key={index} className="log-card">
              <p><strong>Start Time:</strong> {log.startTime}</p>
              <p><strong>End Time:</strong> {log.endTime}</p>
              <p><strong>Notes:</strong> {log.notes}</p>
            </div>
          ))
        ) : (
          <p className="no-logs-message">No sleep logs yet. Add the first entry!</p>
        )}

        {isFormVisible || sleepLogs.length === 0 ? (
          <form onSubmit={handleAddSleepLog} className="log-form">
            <div className="form-group">
              <label>Start Time</label>
              <input type="time" name="startTime" className="form-control" required />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input type="time" name="endTime" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" className="form-control"></textarea>
            </div>
            <button type="submit" className="btn login-btn">Add Sleep Log</button>
          </form>
        ) : (
          <button onClick={() => setIsFormVisible(true)} className="btn login-btn">Add Entry</button>
        )}

        <button onClick={handleBackClick} className="btn back-btn mt-3">
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
};

export default SleepingForm;