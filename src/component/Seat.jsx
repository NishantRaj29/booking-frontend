import React, { useEffect, useState } from 'react';
import '../App.css'


const Seat = () => {
    const [seats, setSeats] = useState(null); // Set initial state to null to handle loading
    // console.log(refreshTrigger);
    // Fetch seat arrangement from backend
    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const response = await fetch("https://booking-server-3fno.onrender.com/api/tickets/show", {
                    method: "GET",
                });
                const data = await response.json();
                setSeats(data);
            } catch (error) {
                console.error('Error fetching seats:', error);
            }
        };
        fetchSeats();
    }, []);

    // Function to render seat row
    const renderSeatRow = (row, rowName) => {
        // Only render if row exists
        if (!row) return null;

        return (
            
            <div key={rowName} style={{ display: 'flex', justifyContent: 'center' }}>
                {row.split('').map((seat, index) => (
                    <div
                        key={index}
                        style={{
                            width: '40px',
                            height: '30px',
                            backgroundColor: seat === '0' ? 'green' : 'red',
                            margin: '5px',
                            textAlign: 'center',
                        }}
                    >
                        {rowName + (index + 1)}
                    </div>
                ))}
            </div>
        );
    };

    // Render loading state while seats are being fetched
    if (!seats) {
        return <div>Loading seat layout...</div>;
    }

    return (
        <div>
            <h2>Seat Layout</h2>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', marginRight: '20px' }}>
                    {['A', 'B', 'D', 'F', 'H', 'J', 'K'].map((rowName) =>
                        renderSeatRow(seats[rowName], rowName)
                    )}
                </div>
                <div style={{ flex: '1', marginLeft: '20px' }}>
                    {['C', 'E', 'G', 'I', 'L'].map((rowName) =>
                        renderSeatRow(seats[rowName], rowName)
                    )}
                </div>
            </div>
            {renderSeatRow(seats.M, 'M')}
        </div>
    );
};

export default Seat;
