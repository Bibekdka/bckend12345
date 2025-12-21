import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyB3F9I9IqAesY5b-m79UB4EVqUq7nw6PIQ",
    authDomain: "restaurant-app-4cb13.firebaseapp.com",
    projectId: "restaurant-app-4cb13",
    storageBucket: "restaurant-app-4cb13.firebasestorage.app",
    messagingSenderId: "755258756240",
    appId: "1:755258756240:web:3f6a23041bf04473309c15",
    measurementId: "G-ZB2SBX8503"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Auth and DB for use in other files
export const auth = getAuth(app);
export const db = getFirestore(app);
