
import React, { useState } from 'react';
import './App.css';

import UserCount from './component/User_count.jsx';

const App = () => {
  const [refresh, setRefresh] = useState(false);

  // Toggle refresh to re-fetch seat data after booking
  const handleBookingSuccess = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="App">
      <h1>Train Seat Reservation System</h1>
      
      <UserCount onBookingSuccess={handleBookingSuccess} />
    </div>
  );
};

export default App;

