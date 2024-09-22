import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Import Firebase auth and db
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const BabyForm = () => {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = auth.currentUser.uid; // Get the logged-in user's ID
    const userDocRef = doc(db, `users/${userId}`); // Reference to the user doc

    // Save baby info to Firestore
    await setDoc(userDocRef, {
      babyInfo: {
        name,
        birthday,
      },
    }, { merge: true });

    // Redirect to CalendarView after saving
    navigate('/');
  };

  return (
    <div>
      <h2>Complete Baby Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Baby's Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Baby's Birthday</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save Baby Info</button>
      </form>
    </div>
  );
};

export default BabyForm;
