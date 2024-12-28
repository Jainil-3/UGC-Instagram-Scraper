from flask import Flask, request, jsonify
from flask_cors import CORS
from InstagramScraper import InstagramScraperManager
import firebase_admin
from firebase_admin import credentials, firestore
import stripe
import json

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin
cred = credentials.Certificate('backend/config/firebase-adminsdk.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize Stripe
stripe.api_key = 'sk_test_51Q9RmVIAxBjIzltmaTnBZBccISQPSsEj3KXBgsriuReb90ptXZuSOASCv1uoSejpp3exO7Xp6x2aYEc02YzA5dnU00Nk50Xv5Q'
webhook_secret = 'whsec_qCiOPPUWUrEUSXgZOLxoORQXfNZczXUB'  # Replace with your webhook secret

# API key and CSE ID for Google Custom Search
API_KEY = 'AIzaSyBsAsM3oFM8gISN8zUnZ3HVsXrk9G32ngE'
CSE_ID = '9012d775b6bf24d7f'

# Route to search Instagram profiles
@app.route('/api/search', methods=['POST'])
def search_profiles():
    
    data = request.get_json()
    keyword = data.get('keyword')
    location = data.get('location')
    number_of_results = int(data.get('numberOfResults'))
    user_email = data.get('userEmail')  # Get the user email from request
    
    print(data)
    print(user_email)
    # Find the user by email to get their uid
    user_ref = db.collection('users').document(user_email)
    print(user_ref)
    user_doc = user_ref.get()
    print(user_doc)

    if user_doc.exists:
        print('user_doc exists')
        uid = user_doc.id
        # Create the InstagramScraperManager instance
        manager = InstagramScraperManager( API_KEY, CSE_ID, username='sidhomei2', password='jaiC@123')
        
        try:
            search_query = f'site:instagram.com "{keyword}" intext:"bio"'
            scraped_data = manager.start_scraping(search_query=search_query, num_results=number_of_results)
            print(scraped_data)
            # Store the search results in Firestore
            user_search_collection = db.collection('searchResults').document(uid).collection('pastSearches')
            user_search_collection.add({
                'keyword': keyword,
                'location': location,
                'numberOfResults': number_of_results,
                'timestamp': firestore.SERVER_TIMESTAMP,  # Automatically add timestamp
                'results': scraped_data,  # Optionally store the search results
            })

            response_data = [
                {"username": username, "bio": data['bio'], "followers": data['followers']}
                for username, data in scraped_data.items()
            ]
            
            return jsonify(response_data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "User not found"}), 404

# Route for creating Stripe Checkout Session
@app.route('/api/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.get_json()

    # Extract price_id from the JSON payload
    try:
        price_id = data['price_id']
    except KeyError:
        return jsonify({"error": "price_id is required"}), 400

    # Create the Stripe session with the provided price_id
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,  # Use the price_id from the request
                'quantity': 1,
            }],
            mode='subscription',
            success_url='http://localhost:3000/search',
            cancel_url='http://localhost:3000/pricing',
        )
        return jsonify({'id': session.id})
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/webhook', methods=['POST'])
def stripe_webhook():
    event = None
    print("Triggered stripe")
   
    payload = request.data.decode('utf-8')  # Decode to UTF-8
    sig_header = request.headers.get('STRIPE_SIGNATURE')
    

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        print(f'Received a {event["type"]}', event)
    except ValueError:
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError as e:
        print("Signature verification error:", str(e))
        return 'Invalid signature', 400

    # Handle successful checkout session completion
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        customer_id = session['customer']
        subscription_id = session['subscription']

        customer = stripe.Customer.retrieve(customer_id)
        payment_email = customer.get('email')
        amount_total = session['amount_total']//100
        user_ref = db.collection('users').document(payment_email)
        user_doc = user_ref.get()
        price_tiers = {
            'Starter': 29,
            'Pro': 59,
            'Enterprise': 129,
        }
        subscription_tier = 'Free'
        for tier in price_tiers:
            if amount_total == price_tiers[tier]:
                subscription_tier = tier
                break

        if not user_doc.exists:
            user_ref.set({
                'name': customer.get('name'),
                'session_id': session['id'],
                'email': payment_email,
                'subscription_tier': subscription_tier,
                'total_results': 0,
                'subscription_id': subscription_id,
                'customer_details': session['customer_details'],
                'created_at': firestore.SERVER_TIMESTAMP
                
            })
        else:
            user_ref.update({
                'subscription_tier': subscription_tier,
                'subscription_id': subscription_id,
                'customer_details': session['customer_details'],
                'session_id': session['id']

            })

    return 'Success', 200


# Route to retrieve the user's subscription status and search limit
@app.route('/api/subscription-status', methods=['GET'])
def subscription_status():
    # Replace this with logic to fetch real user data from Firebase
    user_email = request.args.get('email')  # Assume email is passed via query params
    user_ref = db.collection('users').document(user_email)
    user_doc = user_ref.get()

    if user_doc.exists:
        user_data = user_doc.to_dict()
        subscription_tier = user_data['subscription_tier']
        searches_today = user_data['total_results']
        return jsonify({"subscription_tier": subscription_tier, "searches_today": searches_today})
    else:
        return jsonify({"error": "User not found"}), 404

# Route to handle daily search limits
@app.route('/api/track-search', methods=['POST'])
def track_search():
    data = request.get_json()
    email = data.get('email')
    number_of_results = data.get('numberOfResults', 0)  # Get the number of results
    user_ref = db.collection('users').document(email)
    user_doc = user_ref.get()
    
    if user_doc.exists:
        user_data = user_doc.to_dict()
        subscription_tier = user_data['subscription_tier']
        total_results = user_data.get('total_results', 0)  # Get current total results

        # Define the result limits per tier
        result_limits = {
            'Free': 10,
            'Starter': 200,
            'Pro': 800,
            'Enterprise': float('inf')  # Unlimited results
        }

        new_total_results = total_results + number_of_results

        if new_total_results <= result_limits[subscription_tier]:
            # Update the total_results count
            user_ref.update({"total_results": new_total_results})
            return jsonify({"success": True, "message": "Search logged.", "remaining": result_limits[subscription_tier] - new_total_results})
        else:
            return jsonify({"success": False, "message": "Result limit reached.", "remaining": result_limits[subscription_tier] - total_results}), 403
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/api/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        data = request.json
        plan = data['plan']
        price = data['price']

        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=int(price * 100),  # Convert to cents
            currency='usd',
            automatic_payment_methods={
                'enabled': True,
            },
        )

        return jsonify({
            'clientSecret': intent.client_secret
        })
    except Exception as e:
        return jsonify(error=str(e)), 403

if __name__ == '__main__':
    app.run(debug=True)
