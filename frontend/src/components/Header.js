import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth"; // Firebase auth imports
import '../styles/styles.css'; // Ensure your styles are correctly imported
import { auth } from '../firebaseConfig'; // Make sure firebaseConfig exports the Firebase auth instance
import axios from 'axios'; // Import axios for API requests

const Header = () => {
    const [user, setUser] = useState(null); // State to hold the logged-in user
    const [subscriptionTier, setSubscriptionTier] = useState('Free'); // State to hold subscription tier
    const location = useLocation(); // To determine the active link

    useEffect(() => {
        // Listen for auth state changes and update user state
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser); // Set user if logged in
                // Fetch subscription status
                try {
                    const response = await axios.get('http://localhost:5000/api/subscription-status', {
                        params: { email: currentUser.email },
                    });
                    setSubscriptionTier(response.data.subscription_tier);
                } catch (error) {
                    console.error('Error fetching subscription status:', error);
                    setSubscriptionTier('Free'); // Default to Free on error
                }
            } else {
                setUser(null); // Clear user if logged out
                setSubscriptionTier('Free'); // Reset subscription tier
            }
        });
        
        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert('Successfully logged out.');
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Error logging out, please try again.');
        }
    };

    return (
        <header>
            <div className="header-container navbar">
                <div className="left-section">
                    <Link to="/" className="logo">YourLogo</Link>
                    <ul className="nav-links">
                        <li>
                            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                        </li>
                        <li>
                            <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>Search Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>Pricing</Link>
                        </li>
                        <li>
                            <Link to="/our-story" className={location.pathname === '/our-story' ? 'active' : ''}>Our Story</Link>
                        </li>
                    </ul>
                </div>
                <div className="signin-btn-container">
                    {/* Conditionally render based on user login status */}
                    {user ? (
                        <div className="user-info">
                            <span className="username">HELLO, {user.displayName || user.email}</span> {/* Show username or email */}
                            <span className="subscription-tier">Tier: {subscriptionTier}</span> {/* Display subscription tier */}
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="signin-btn">SIGN IN</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
