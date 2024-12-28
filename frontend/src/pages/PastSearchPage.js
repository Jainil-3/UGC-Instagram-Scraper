import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig'; // Ensure firebaseConfig exports the Firestore instance
import '../styles/styles.css'; // Ensure your styles are correctly imported

function PastSearchesPage() {
  const [pastSearches, setPastSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedSearch, setSelectedSearch] = useState(null); // State to handle selected search for modal
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const searchCollection = collection(db, 'searchResults', currentUser.email, 'pastSearches'); // Use uid
        try {
          const searchSnapshot = await getDocs(searchCollection);

          const searches = searchSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setPastSearches(searches);
        } catch (error) {
          console.error("Error fetching past searches:", error);
          setError("Failed to load past searches. Please try again later.");
          setPastSearches([]); // Optionally, clear past searches on error
        }
      } else {
        // No user is signed in
        setUser(null);
        setPastSearches([]); // Clear past searches if no user is logged in
      }
      setLoading(false); // Stop loading
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const handleRowClick = (search) => {
    console.log("Selected Search:", search); // Debugging line
    setSelectedSearch(search); // Set selected search to show in modal
  };

  const closeModal = () => {
    setSelectedSearch(null); // Close the modal
  };

  return (
    <div>
      <h2>Your Past Searches</h2>
      <h3>Click on a row to view search details.</h3>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          {error && <p className="error-message">{error}</p>}
          {pastSearches.length > 0 ? (
            <table className="past-searches-table">
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>Location</th>
                  <th>Number of Results</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {pastSearches.map((search) => (
                  <tr key={search.id} onClick={() => handleRowClick(search)}>
                    <td>{search.keyword}</td>
                    <td>{search.location}</td>
                    <td>{search.numberOfResults}</td>
                    <td>{new Date(search.timestamp.seconds * 1000).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No past searches found.</p>
          )}
        </>
      ) : (
        <p>Please log in to view your past searches.</p>
      )}

      {/* Modal to display selected search details */}
      {selectedSearch && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={closeModal}
              tabIndex="0"
              role="button"
              aria-label="Close Modal"
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  closeModal();
                }
              }}
            >
              &times;
            </span>
            
            <ul>
              {selectedSearch.results && typeof selectedSearch.results === 'object' && Object.keys(selectedSearch.results).length > 0 ? (
                Object.values(selectedSearch.results).map((result, index) => (
                  <li key={result.username || index}>
                    <p><strong>Username:</strong> {result.username}</p>
                    <p><strong>Followers:</strong> {result.followers}</p>
                    <p><strong>Bio:</strong> {result.bio}</p>
                  </li>
                ))
              ) : (
                <p>No results available for this search.</p>
              )}
            
              <button className="close-button" onClick={closeModal}>Close</button>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default PastSearchesPage;
