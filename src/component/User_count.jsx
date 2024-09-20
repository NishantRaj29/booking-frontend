import React, { useEffect, useState } from 'react';
import Seat from './Seat';
import ReactConfetti from 'react-confetti';

const UserCount = () => {
    const [seatCount, setSeatCount] = useState(1);  // Default seat count to 1
    const [message, setMessage] = useState('');
    const [update, setUpdate] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [confettiVisible, setConfettiVisible] = useState(false);
    const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Handle window resize for confetti effect
    useEffect(() => {
        const handleResize = () => {
            setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reset update after seat booking is reflected
    useEffect(() => {
        if (update) {
            setUpdate(false);
        }
    }, [update]);

    // Function to handle data reset
    const handleDataReset = async () => {
        try {
            const response = await fetch("https://booking-server-3fno.onrender.com/api/tickets/reset", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                setMessage('Data has been reset successfully.');
                setUpdate(true);
                setShowPopup(true);  // Show popup after reset
            } else {
                const errorData = await response.json();
                setMessage(`Failed to reset data: ${errorData.message}`);
                setShowPopup(true);
            }
        } catch (error) {
            console.error('Error resetting data:', error);
            setMessage('Error resetting data. Please try again.');
            setShowPopup(true);
        }
    };

    // Function to handle seat booking submission
    const handleSubmit = async () => {
        try {
            const response = await fetch("https://booking-server-3fno.onrender.com/api/tickets/book", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numSeats: seatCount }),  // Send seat count in the request body
            });

            if (response.ok) {
                const data = await response.json();
                setUpdate(true);
                setMessage(`Seats booked successfully: ${data.seatsAssigned.join(', ')}`);
                setShowPopup(true);
                setConfettiVisible(true);  // Show confetti on success

                
            } else {
                const errorData = await response.json();
                setMessage(`Sorry, ${errorData.message}`);
                setShowPopup(true);
            }
        } catch (error) {
            console.error('Error booking seats:', error);
            setMessage('Error booking seats. Please try again.');
            setShowPopup(true);
        }
    };

    // Function to close the popup
    const closePopup = () => {
        setShowPopup(false);
        setConfettiVisible(false); 
    }

    return (
        <>
            <div className='seat-box'>
                <Seat key={update} />
            </div>
            <div className='user-box'>
                <h2>Book Your Seats</h2>
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="number"
                        value={seatCount}
                        min="1"
                        max="7"
                        onChange={(e) => setSeatCount(e.target.value)}
                        style={{ width: '50px', marginRight: '10px',height:'2rem' }}
                    />
                    <button id = "submit" onClick={handleSubmit}>Submit</button>
                </div>
                <button onClick={handleDataReset} id="data-reset">
                    Data Reset
                </button>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>{message}</p>
                        <button onClick={closePopup}>OK</button>
                    </div>
                </div>
            )}

            {confettiVisible && (
                <ReactConfetti
                    width={windowDimension.width}
                    height={windowDimension.height}
                    tweenDuration={1000}
                />
            )}
        </>
    );
};

export default UserCount;
