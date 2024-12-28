import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; 
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import SearchPage from './pages/SearchPage'; 
import Footer from './components/Footer'; 
import Header from './components/Header'; 
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import PastSearchesPage from './pages/PastSearchPage';
import './styles/styles.css';

const App = () => {
    return (
        <Router> {/* Ensure Router is wrapping everything */}
            <div className="app-container">
                <Header />
                <Routes> {/* Use Routes component */}
                    <Route path="/" element={<Home />} /> 
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/past-searches" element={<PastSearchesPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
