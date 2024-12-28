import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting users
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';
import { auth } from '../firebaseConfig'; // Ensure Firestore is correctly imported
import '../styles/styles.css';


const SearchPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // For redirecting to login page
    var userEmail = null
    useEffect(() => {

      // Check if the user is logged in
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          userEmail = currentUser.email; // Set user email for search request
        } else {
          // If no user is logged in, redirect to the login page
          navigate('/login');
        }
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, [navigate]);

    const handleSearch = async (keyword, location, numberOfResults, userEmail) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keyword, location, numberOfResults, userEmail }),
            });
            
            if (!response.ok) {
                throw new Error('Search failed. Please try again.');
            }

            const data = await response.json();
            setResults(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => {
      setResults([]); // Clear results
    };

    return (
      <div className="search-page">
        <div className="search-input"> {/* Search input section */}
          <SearchForm onSearch={handleSearch} />
        </div>
  
        <div className="output-section"> {/* Output section */}
          {loading && <p>Loading...</p>} {/* Loading indicator */}
          {error && <p className="error-message">{error}</p>} {/* Error message */}
          <SearchResults results={results} onClear={clearResults} />
        </div>
      </div>
    );
};

export default SearchPage;
