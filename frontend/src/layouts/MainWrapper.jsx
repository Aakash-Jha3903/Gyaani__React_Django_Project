import React from 'react';
import { useEffect, useState } from 'react';
import { setUser } from '../utils/auth';
import '../App.css';
const MainWrapper = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handler = async () => {
            try {
                setLoading(true);

                await setUser(); // Set user authentication state
                // await new Promise(resolve => setTimeout(resolve, 4000));
            } catch (error) {
                console.error("Error setting user:", error);
            } finally {
                setLoading(false);
            }
        };

        handler();
    }, []);

    return (
        <>
            {loading ? (
                <div className="spinner-container">
                    <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p>Preparing your reading space...</p>
                </div>
            ) : (
                children
            )}
        </>
    );
};

export default MainWrapper;
