// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdFcJqUoucAf3lT-UzVuWV__JSivmAlW0",
  authDomain: "sticky-notes-99360.firebaseapp.com",
  projectId: "sticky-notes-99360",
  storageBucket: "sticky-notes-99360.appspot.com",
  messagingSenderId: "611233628679",
  appId: "1:611233628679:web:c54053c1cac49b3d4920a2",
  measurementId: "G-KXJL1T4BVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);