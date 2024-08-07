// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNtLAdiiroSOztZArouQ8Io1Q7ADCENGk",
  authDomain: "inventory-management-d8ca6.firebaseapp.com",
  projectId: "inventory-management-d8ca6",
  storageBucket: "inventory-management-d8ca6.appspot.com",
  messagingSenderId: "158849895719",
  appId: "1:158849895719:web:15494de158469c59682d02",
  measurementId: "G-9D6E79V070"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export{firestore}