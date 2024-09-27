import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { FaArrowLeft } from 'react-icons/fa';

const FeedingForm = () => {
  const { day, month, year } = useParams();
  const docId = `${year}-${month}-${day}`;
  const [feedingLogs, setFeedingLogs] = useState([]); // Define feeding logs
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Added to manage loading state
  const navigate = useNavigate();

  // Fetch logs (feeding) on component mount
  useEffect(() => {
    const fetchLogs = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const docRef = doc(db, `users/${userId}/dailyLogs/${docId}`);

      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setFeedingLogs(data.feedingLogs || []); // Fetch feeding logs
        } else {
          console.log('No such document!');
        }
        setLoading(false); // Stop loading
      });

      return () => {
        unsubscribe();
      };
    };

    fetchLogs();
  }, [docId]);

  // Handle adding a new feeding log
  const handleAddLog = async (event) => {
    event.preventDefault();
    const startTime = event.target.startTime.value;
    const endTime = event.target.endTime.value;
    const quantity = event.target.quantity.value;
    const breastMilkLeft = event.target.breastMilkLeft.value || 'N/A';
    const breastMilkRight = event.target.breastMilkRight.value || 'N/A';
    const depositions = event.target.depositions.value;
    const comments = event.target.comments.value;

    const newFeedingLog = {
      startTime,
      endTime,
      quantity,
      breastMilk: { left: breastMilkLeft, right: breastMilkRight },
      depositions,
      comments,
    };

    const userId = auth.currentUser?.uid;
    const docRef = doc(db, `users/${userId}/dailyLogs/${docId}`);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data();

      // Update feedingLogs
      const updatedFeedingLogs = existingData.feedingLogs
        ? [...existingData.feedingLogs, newFeedingLog]
        : [newFeedingLog];

      await setDoc(docRef, {
        ...existingData,
        feedingLogs: updatedFeedingLogs, // Save updated feeding logs
      });

      setFeedingLogs(updatedFeedingLogs);
    } else {
      await setDoc(docRef, {
        feedingLogs: [newFeedingLog], // Create new feeding log collection if it doesn't exist
      });
      setFeedingLogs([newFeedingLog]);
    }

    setIsFormVisible(false);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="log-container">
      <div className="log-box">
        <h2 className="log-title">Feeding Logs for {`${day}/${month}/${year}`}</h2>

        {feedingLogs.length > 0 ? (
          feedingLogs.map((log, index) => (
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
          <p className="no-logs-message">No feeding logs yet. Add the first entry!</p>
        )}

        {feedingLogs.length === 0 || isFormVisible ? (
          <form onSubmit={handleAddLog} className="log-form">
            <div className="form-group">
              <label>Start Time</label>
              <input type="time" name="startTime" className="form-control" required />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input type="time" name="endTime" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Quantity (ml)</label>
              <input type="number" name="quantity" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Breast Milk Left (min)</label>
              <input type="number" name="breastMilkLeft" className="form-control" />
            </div>
            <div className="form-group">
              <label>Breast Milk Right (min)</label>
              <input type="number" name="breastMilkRight" className="form-control" />
            </div>
            <div className="form-group">
              <label>Depositions</label>
              <select name="depositions" className="form-control">
                <option value="pee">Pee</option>
                <option value="poop">Poop</option>
                <option value="both">Both</option>
                <option value="none">None</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comments</label>
              <textarea name="comments" className="form-control"></textarea>
            </div>
            <button type="submit" className="btn login-btn">Add Entry</button>
          </form>
        ) : (
          <button onClick={() => setIsFormVisible(true)} className="btn">Add Entry</button>
        )}

        <button onClick={handleBackClick} className="btn back-btn mt-3">
          <FaArrowLeft />
        </button>
      </div>
    </div>
  );
};

export default FeedingForm;
