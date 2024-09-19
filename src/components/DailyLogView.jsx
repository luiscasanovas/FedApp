import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase Firestore

const DailyLogView = () => {
  const { day, month, year } = useParams();
  const date = `${day}/${month}/${year}`;
  const docId = `${year}-${month}-${day}`; // Use yyyy-mm-dd as the document ID for Firestore

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const docRef = doc(db, "dailyLogs", docId);

    // Real-time listener for Firestore data
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setLogs(doc.data().logs);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, [docId]);

  const addLog = async (newLog) => {
    const updatedLogs = [...logs, newLog];
    await setDoc(doc(db, "dailyLogs", docId), { logs: updatedLogs });
    setLogs(updatedLogs); // Update local state
  };

  const handleAddLog = async (event) => {
    event.preventDefault();
    const startTime = event.target.startTime.value;
    const endTime = event.target.endTime.value;
    const quantity = event.target.quantity.value;
    const breastMilkLeft = event.target.breastMilkLeft.value || "0";
    const breastMilkRight = event.target.breastMilkRight.value || "0";
    const depositions = event.target.depositions.value;
    const comments = event.target.comments.value;

    const newLog = {
      startTime,
      endTime,
      quantity,
      breastMilk: {
        left: breastMilkLeft,
        right: breastMilkRight,
      },
      depositions,
      comments,
    };

    await addLog(newLog);
    event.target.reset(); // Clear the form after submission
  };

  return (
    <div className="container">
      <h2>Logs for {date}</h2>
      <div className="log-cards">
        {logs.map((log, index) => (
          <div key={index} className="log-card card">
            <div className="card-body">
              <p><strong>Start Time:</strong> {log.startTime}</p>
              <p><strong>End Time:</strong> {log.endTime}</p>
              <p><strong>Quantity:</strong> {log.quantity}</p>
              <p><strong>Breast Milk:</strong> Left: {log.breastMilk?.left || "N/A"} min, Right: {log.breastMilk?.right || "N/A"} min</p>
              <p><strong>Depositions:</strong> {log.depositions}</p>
              <p><strong>Comments:</strong> {log.comments}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddLog} className="log-form">
        <label>Start Time: <input type="time" name="startTime" className="form-control" required /></label>
        <label>End Time: <input type="time" name="endTime" className="form-control" required /></label>
        <label>Quantity (ml): <input type="number" name="quantity" className="form-control" required /></label>
        <label>Breast Milk Left (min): <input type="number" name="breastMilkLeft" className="form-control" /></label>
        <label>Breast Milk Right (min): <input type="number" name="breastMilkRight" className="form-control" /></label>
        <label>Depositions: 
          <select name="depositions" className="form-control">
            <option value="pee">Pee</option>
            <option value="poop">Poop</option>
            <option value="both">Both</option>
          </select>
        </label>
        <label>Comments: <textarea name="comments" className="form-control"></textarea></label>
        <button type="submit" className="btn btn-primary">Add Log</button>
      </form>
    </div>
  );
};

export default DailyLogView;
