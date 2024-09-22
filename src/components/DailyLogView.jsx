import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const DailyLogView = () => {
  const { day, month, year } = useParams();
  const date = `${day}/${month}/${year}`;
  const docId = `${year}-${month}-${day}`;
  const [logs, setLogs] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const docRef = doc(db, 'dailyLogs', docId);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setLogs(doc.data().logs || []);
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [docId]);

  const addLog = async (newLog) => {
    const updatedLogs = [...logs, newLog];
    await setDoc(doc(db, 'dailyLogs', docId), { logs: updatedLogs });
    setLogs(updatedLogs);
    setIsFormVisible(false);
  };

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

    await addLog(newLog);
    event.target.reset();
  };

  const handleAddNewLog = () => {
    setIsFormVisible(true);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Logs for {date}</h2>

      <div className="log-cards">
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
      </div>

      {logs.length === 0 || isFormVisible ? (
        <form onSubmit={handleAddLog} className="log-form">
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
          <button type="submit" className="btn btn-primary">Add Log</button>
        </form>
      ) : (
        <button onClick={handleAddNewLog} className="btn btn-secondary mt-3">Add Entry</button>
      )}

      <button onClick={handleBackClick} className="btn btn-secondary mt-3">Back</button>
    </div>
  );
};

export default DailyLogView;
