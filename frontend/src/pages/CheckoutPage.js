import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js'; // Load Stripe.js

const stripePromise = loadStripe('pk_test_51Q9RmVIAxBjIzltmuUKUPei1KsgmHOFDfyAAgcoqAXoW6Fh49ek4DmNaTQN2BmhrrPjr4uNPbuwNwvHOQK0JFOd2006aTugo35'); // Replace with your Stripe public key

const CheckoutPage = () => {
    const location = useLocation();
    const plan = new URLSearchParams(location.search).get('plan'); // Get selected plan from URL
    
    const handleCheckout = async () => {
        const stripe = await stripePromise;
        
        // Map the selected plan to a Stripe price ID
        const priceIdMap = {
            'starter': 'price_1QA0ZjIAxBjIzltmNqUorQ1l',
            'pro': 'price_1QA0a0IAxBjIzltmA19Lqfey',
            'enterprise': 'price_1QA0aJIAxBjIzltmLXwYoCdV'
        };
        
        const price_id = priceIdMap[plan]; // Get price_id based on selected plan
    
        const response = await fetch('http://localhost:5000/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ price_id }), // Send price_id instead of plan
        });
    
        const session = await response.json();
        
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({ sessionId: session.id });
        if (result.error) {
            alert(result.error.message);
        }
    };
    

    useEffect(() => {
        handleCheckout();
    }, []);

    return (
        <div>
            <h1>Processing Checkout...</h1>
        </div>
    );
};

export default CheckoutPage;
