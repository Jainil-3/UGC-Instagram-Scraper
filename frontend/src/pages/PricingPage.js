import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import '../styles/styles.css'; // Import your CSS file

const PricingPage = () => {
    const navigate = useNavigate();

    const handlePurchase = (plan) => {
        // Redirect to payment processing based on selected plan
        navigate(`/checkout?plan=${plan}`);
    };

    return (
        <div className="pricing-page">
            <h2>Our Plans</h2>
            <div className="pricing-cards-container">
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
                    <button className="upgrade-btn" onClick={() => handlePurchase('starter')}>
                        Upgrade to Starter
                    </button>
                </div>
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
                    <button className="upgrade-btn" onClick={() => handlePurchase('pro')}>
                        Upgrade to Pro
                    </button>
                </div>
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
                    <button className="upgrade-btn" onClick={() => handlePurchase('enterprise')}>
                        Upgrade to Enterprise
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
