import { initializeApp } from "firebase/app";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLLUOKp0GxHqDlfUSl4lBDu00bYHariEQ",
    authDomain: "ugc-bot-bf5e8.firebaseapp.com",
    databaseURL: "https://ugc-bot-bf5e8-default-rtdb.firebaseio.com",
    projectId: "ugc-bot-bf5e8",
    storageBucket: "ugc-bot-bf5e8.appspot.com",
    messagingSenderId: "203853613192",
    appId: "1:203853613192:web:1481ec2a2310aed820b73d",
    measurementId: "G-70CMKBHQ75"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore instance
const auth = getAuth(app); // Auth instance

export { db, auth };
