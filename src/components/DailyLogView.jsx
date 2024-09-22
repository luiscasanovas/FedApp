import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const DailyLogView = () => {
  const { day, month, year } = useParams();
  const docId = `${year}-${month}-${day}`;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const docRef = doc(db, `users/${userId}/dailyLogs/${docId}`);
      
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setLogs(doc.data().logs || []);
        } else {
          console.log('No such document!');
        }
        setLoading(false);
      });

      return () => {
        unsubscribe(); // Clean up the listener when the component unmounts or the user logs out
      };
    };

    fetchLogs();
  }, [docId]);

  const handleAddLog = async (event) => {
    event.preventDefault();
    const startTime = event.target.startTime.value;
    const endTime = event.target.endTime.value;
    const quantity = event.target.quantity.value;
    const breastMilkLeft = event.target.breastMilkLeft.value || 'N/A';
    const breastMilkRight = event.target.breastMilkRight.value || 'N/A';
    const depositions = event.target.depositions.value;
    const comments = event.target.comments.value;

    const newLog = {
      startTime,
      endTime,
      quantity,
      breastMilk: { left: breastMilkLeft, right: breastMilkRight },
      depositions,
      comments,
    };

    const userId = auth.currentUser?.uid;
    const docRef = doc(db, `users/${userId}/dailyLogs/${docId}`);

    const updatedLogs = [...logs, newLog];
    await setDoc(docRef, { logs: updatedLogs });
    setLogs(updatedLogs);
    setIsFormVisible(false);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Logs for {`${day}/${month}/${year}`}</h2>
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
        <p>No logs yet. Add the first entry!</p>
      )}

      {logs.length === 0 || isFormVisible ? (
        <form onSubmit={handleAddLog}>
          <label>Start Time: <input type="time" name="startTime" required /></label>
          <label>End Time: <input type="time" name="endTime" required /></label>
          <label>Quantity (ml): <input type="number" name="quantity" required /></label>
          <label>Breast Milk Left (min): <input type="number" name="breastMilkLeft" /></label>
          <label>Breast Milk Right (min): <input type="number" name="breastMilkRight" /></label>
          <label>Depositions: 
            <select name="depositions">
              <option value="pee">Pee</option>
              <option value="poop">Poop</option>
              <option value="both">Both</option>
            </select>
          </label>
          <label>Comments: <textarea name="comments"></textarea></label>
          <button type="submit">Add Log</button>
        </form>
      ) : (
        <button onClick={() => setIsFormVisible(true)}>Add Entry</button>
      )}
      <button onClick={handleBackClick}>Back</button>
    </div>
  );
};

export default DailyLogView;
