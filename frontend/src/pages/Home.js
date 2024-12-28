import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { auth } from '../firebaseConfig'; // Import Firebase authentication
import '../styles/styles.css'; // Ensure to import your CSS file

const Home = () => {
    const navigate = useNavigate();
    const [openFAQ, setOpenFAQ] = useState(null);

    const handleGetStarted = () => {
        const user = auth.currentUser;
        if (user) {
            navigate('/search');
        } else {
            navigate('/login');
        }
    };

    const handleUpgrade = (plan) => {
        navigate(`/checkout?plan=${plan}`);
    };

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index); // Toggle the FAQ visibility
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="hero">
                <div className="overlay">
                    <h1>Instagram UGC Creator Scraper</h1>
                    <p>Find the best UGC creators on Instagram in seconds!</p>
                    <button className="cta-btn" onClick={handleGetStarted}>Get Started</button>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="pricing-section">
                <h2>Our Plans</h2>
                <div className="pricing-cards-container">
                    {/* Starter Plan */}
                    <div className="pricing-card">
                        <h3>Starter</h3>
                        <ul>
                            <li>75 DMs daily</li>
                            <li>Automated Lead Generation</li>
                            <li>24/7 Support</li>
                            <li>Single Browser</li>
                            <li>Unlimited Traffic</li>
                        </ul>
                        <div className="price">$29 / month</div>
                        <button className="upgrade-btn" onClick={() => handleUpgrade('starter')}>
                            Upgrade to Starter
                        </button>
                    </div>
                    {/* Pro Plan */}
                    <div className="pricing-card">
                        <h3>Pro</h3>
                        <ul>
                            <li>375 DMs daily</li>
                            <li>Automated Lead Generation</li>
                            <li>24/7 Support</li>
                            <li>Dual Browser</li>
                            <li>Unlimited Traffic</li>
                        </ul>
                        <div className="price">$59 / month</div>
                        <button className="upgrade-btn" onClick={() => handleUpgrade('pro')}>
                            Upgrade to Pro
                        </button>
                    </div>
                    {/* Enterprise Plan */}
                    <div className="pricing-card">
                        <h3>Enterprise</h3>
                        <ul>
                            <li>Unlimited DMs daily</li>
                            <li>Automated Lead Generation</li>
                            <li>24/7 Priority Support</li>
                            <li>Dual Browser</li>
                            <li>Unlimited Traffic</li>
                        </ul>
                        <div className="price">$129 / month</div>
                        <button className="upgrade-btn" onClick={() => handleUpgrade('enterprise')}>
                            Upgrade to Enterprise
                        </button>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
                <h2>FAQs</h2>
                <div className="faq-item" onClick={() => toggleFAQ(1)}>
                    <div className="faq-question">
                        <span>What is Instagram UGC Creator Scraper?</span>
                        <span className="faq-icon">{openFAQ === 1 ? '-' : '+'}</span>
                    </div>
                    {openFAQ === 1 && (
                        <p className="faq-answer">
                            This tool helps you find the best user-generated content (UGC) creators on Instagram based on your keywords, location, and more.
                        </p>
                    )}
                </div>
                <div className="faq-item" onClick={() => toggleFAQ(2)}>
                    <div className="faq-question">
                        <span>How many searches can I perform with each plan?</span>
                        <span className="faq-icon">{openFAQ === 2 ? '-' : '+'}</span>
                    </div>
                    {openFAQ === 2 && (
                        <p className="faq-answer">
                            The Starter plan allows 75 DMs daily, while the Pro plan allows 375 DMs daily, and the Enterprise plan allows unlimited DMs.
                        </p>
                    )}
                </div>
                <div className="faq-item" onClick={() => toggleFAQ(3)}>
                    <div className="faq-question">
                        <span>Can I cancel my subscription at any time?</span>
                        <span className="faq-icon">{openFAQ === 3 ? '-' : '+'}</span>
                    </div>
                    {openFAQ === 3 && (
                        <p className="faq-answer">
                            Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of your current billing cycle.
                        </p>
                    )}
                </div>
                <div className="faq-item" onClick={() => toggleFAQ(4)}>
                    <div className="faq-question">
                        <span>What kind of support is available?</span>
                        <span className="faq-icon">{openFAQ === 4 ? '-' : '+'}</span>
                    </div>
                    {openFAQ === 4 && (
                        <p className="faq-answer">
                            We offer 24/7 support for all plans, with priority support available for Enterprise plan subscribers.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
