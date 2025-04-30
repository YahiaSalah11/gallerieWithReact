import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import SignUp from './SignUp';
import HelloPage from './HelloPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/check-session', { withCredentials: true })
      .then((response) => {
        console.log(response.data); // تحقق من البيانات القادمة من السيرفر
        if (response.data.loggedIn) {
          setLoggedIn(true);
          setUser(response.data.user);
        }
      })
      .catch((err) => console.error('Error checking session:', err));
  }, []);

  return (
    <Routes>
      <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <Login setLoggedIn={setLoggedIn} setUser={setUser} />} />
      <Route path="/signup" element={loggedIn ? <Navigate to="/" /> : <SignUp />} />
      <Route path="/" element={<HelloPage loggedIn={loggedIn} user={user} setLoggedIn={setLoggedIn} setUser={setUser} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
