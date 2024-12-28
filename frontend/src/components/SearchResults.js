import React from 'react';
import '../styles/styles.css'; // Ensure to import your CSS file

function SearchResults({ results, onClear }) {
  
  return (
    <div id="searchResults" className="results-container">
      {results.length > 0 ? (
        <>
          <button onClick={onClear} className="clear-results-button">Clear Results</button> {/* Clear results button */}
          <table className="results-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Bio</th>
                <th>Followers</th>
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.username}>
                  <td>{result.username}</td>
                  <td>{result.bio}</td>
                  <td>{result.followers}</td>
                  <td>
                    <a 
                      className="profile-link" // Add this class
                      href={`https://www.instagram.com/${result.username}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View Profile
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default SearchResults;
