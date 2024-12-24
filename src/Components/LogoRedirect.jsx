import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/frankoIcon.png';

const LogoRedirect = () => {
    const [showLogo, setShowLogo] = useState(true);
    const navigate = useNavigate();

    // Use useEffect to delay navigation after showing the logo
    useEffect(() => {
        // Set a timeout to hide the logo after 3 seconds
        const timer = setTimeout(() => {
            setShowLogo(false); // Hide logo after 3 seconds
            // Navigate to the home page
            navigate("/home");
        }, 3000); // 3000ms = 3 seconds

        // Cleanup the timeout when the component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div>
            {showLogo && (
                <div className="logo-container">
                    <img src={logo} alt="Logo" />
                    {/* Optionally, you can display a loading spinner or any other indication */}
                </div>
            )}
        </div>
    );
};

export default LogoRedirect;
