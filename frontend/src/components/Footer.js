// components/Footer.js
import React from 'react';
import '../styles/styles.css'; // Ensure your styles are correctly imported

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      <p>
        <a href="/privacy">Privacy Policy</a> |{' '}
        <a href="/terms">Terms of Service</a> |{' '}
        <a href="/contact">Contact Us</a>
      </p>
      <p>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> |{' '}
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> |{' '}
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
      </p>
    </footer>
  );
}

export default Footer;
