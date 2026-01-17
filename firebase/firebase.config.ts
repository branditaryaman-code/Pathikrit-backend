// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYtut-7YYlPrcqdYNgv_fX0KfW89BMPxU",
  authDomain: "mera-attempt.firebaseapp.com",
  projectId: "mera-attempt",
  storageBucket: "mera-attempt.firebasestorage.app",
  messagingSenderId: "165104749250",
  appId: "1:165104749250:web:9a27b9b577beef9524895b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
auth.useDeviceLanguage();