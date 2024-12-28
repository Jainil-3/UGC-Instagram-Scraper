import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Import Firebase configuration

function SearchForm({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [numberOfResults, setNumberOfResults] = useState(10);
  const [searchLimitMessage, setSearchLimitMessage] = useState(''); // State for search limit message
  const navigate = useNavigate();
  const user = auth.currentUser;  // Get current user

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user) {
      const userEmail = user.email;
      
      // Track search usage
      const response = await fetch('http://localhost:5000/api/track-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, numberOfResults: parseInt(numberOfResults) }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // If search is logged, proceed with the search
        onSearch(keyword, location, numberOfResults, userEmail);
        setSearchLimitMessage(`Search successful. Remaining results: ${data.remaining}`);
      } else {
        // If result limit is reached
        setSearchLimitMessage(`${data.message} Remaining results: ${data.remaining}`);
      }
    }
  };

  const handlePastSearchesClick = () => {
    navigate('/past-searches'); // Navigate to past searches page
  };

  return (
    <div className="search-section">
      <form onSubmit={handleSubmit}>
        <label>Enter Keywords:</label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g., dog mom, fashion, travel"
          required
        />
        <label>Location (Optional):</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., New York, USA"
        />
        <label>Number of Results:</label>
        <input
          type="number"
          value={numberOfResults}
          onChange={(e) => setNumberOfResults(e.target.value)}
          min="1"


          required
        />
        
        {/* Button group */}
        <div className="past-searches-button">
          <button type="submit">SEARCH</button>
          <button type="button" onClick={handlePastSearchesClick}>
            VIEW PAST SEARCHES
          </button>
        </div>
      </form>
      
      {/* Display search limit message */}
      {searchLimitMessage && (
        <div className="search-limit-message">
          {searchLimitMessage}
        </div>
      )}
    </div>
  );
}

export default SearchForm;
