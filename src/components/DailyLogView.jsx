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
        unsubscribe();
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
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-4">Logs for {`${day}/${month}/${year}`}</h2>

        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={index} className="log-card mb-4 p-3 bg-light border rounded">
              <p><strong>Start Time:</strong> {log.startTime}</p>
              <p><strong>End Time:</strong> {log.endTime}</p>
              <p><strong>Quantity:</strong> {log.quantity} ml</p>
              <p><strong>Breast Milk:</strong> Left: {log.breastMilk.left} min, Right: {log.breastMilk.right} min</p>
              <p><strong>Depositions:</strong> {log.depositions}</p>
              <p><strong>Comments:</strong> {log.comments}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No logs yet. Add the first entry!</p>
        )}

        {logs.length === 0 || isFormVisible ? (
          <form onSubmit={handleAddLog} className="mt-4">
            <div className="form-group mb-3">
              <label>Start Time</label>
              <input type="time" name="startTime" className="form-control" required />
            </div>
            <div className="form-group mb-3">
              <label>End Time</label>
              <input type="time" name="endTime" className="form-control" required />
            </div>
            <div className="form-group mb-3">
              <label>Quantity (ml)</label>
              <input type="number" name="quantity" className="form-control" required />
            </div>
            <div className="form-group mb-3">
              <label>Breast Milk Left (min)</label>
              <input type="number" name="breastMilkLeft" className="form-control" />
            </div>
            <div className="form-group mb-3">
              <label>Breast Milk Right (min)</label>
              <input type="number" name="breastMilkRight" className="form-control" />
            </div>
            <div className="form-group mb-3">
              <label>Depositions</label>
              <select name="depositions" className="form-control">
                <option value="pee">Pee</option>
                <option value="poop">Poop</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Comments</label>
              <textarea name="comments" className="form-control"></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">Add Log</button>
          </form>
        ) : (
          <button onClick={() => setIsFormVisible(true)} className="btn btn-secondary w-100 mt-4">Add Entry</button>
        )}

        <button onClick={handleBackClick} className="btn btn-danger w-100 mt-3">Back</button>
      </div>
    </div>
  );
};

export default DailyLogView;
