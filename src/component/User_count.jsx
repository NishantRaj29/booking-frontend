import React, { useEffect, useState } from 'react';
import Seat from './Seat';

const UserCount = () => {
    const [seatCount, setSeatCount] = useState(1);  // Default seat count to 1
    const [message, setMessage] = useState('');
    const [update,setUpdate] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [glitterVisible, setGlitterVisible] = useState(false);


    useEffect(() => {
        // Set update back to false after the booking is reflected
        if (update) {
            setUpdate(false);
        }
    }, [update]);

    

    // Function to handle seat booking submission
    const handleSubmit = async () => {
        try {
            
            const response = await fetch("https://booking-server-3fno.onrender.com/api/tickets/book", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numSeats: seatCount }),  // Send seat count in the request body
            });

            if (response.ok) {
                const data = await response.json();  // Parse the JSON response
                setUpdate(true);
                
                setMessage(`Seats booked successfully: ${data.seatsAssigned.join(', ')}`);  // Display assigned seats
                console.log(update);
                setShowPopup(true);
                setGlitterVisible(true);  

                setTimeout(() => {
                    setGlitterVisible(false);
                }, 3000);
            } else {
                const errorData = await response.json();  // Handle non-200 responses
                setMessage(`Sorry, ${errorData.message}`);
                setShowPopup(true);
            }
        } catch (error) {
            console.error('Error booking seats:', error);  // Log any errors
            setMessage('Error booking seats. Please try again.');
            setShowPopup(true);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <>
        <div className='seat-box'>
            <Seat key={update}/>
        </div>
        <div className='user-box'>
            <h2>Book Your Seats</h2>
            <div style={{ marginBottom: '20px' }}>
                {/* Input for seat count */}
                <input
                    type="number"
                    value={seatCount}
                    min="1"
                    max="7"
                    onChange={(e) => setSeatCount(e.target.value)}  // Update state on change
                    style={{ width: '50px', marginRight: '10px' }}
                />
                <button onClick={handleSubmit}>Submit</button>  {/* Button to submit the booking */}
            </div>

            {/* Display booking status message */}
            {/* {message && <div style={{ marginTop: '20px', color: 'blue' }}>{message}</div>} */}
        </div>
        {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>{message}</p>
                        <button onClick={closePopup}>OK</button>  {/* Close the popup */}
                    </div>
                </div>
            )}
        {glitterVisible && (
                <div className="glitter-effect">
                    <div className="glitter1"></div>
                    <div className="glitter"></div>
                </div>
        )}
        </>
    );
};

export default UserCount;
