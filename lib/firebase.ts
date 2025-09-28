// import { initializeApp } from 'firebase/app';
// import { getDatabase } from 'firebase/database';

// const firebaseConfig = {
//   // Replace these with your Firebase project configuration
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   databaseURL: "YOUR_DATABASE_URL",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// export { db }; 

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, set, get } from 'firebase/database'
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBihwvnb7Ec0pFYYX_i2_MhriOfULRSUtk",
  authDomain: "finalfabc.firebaseapp.com",
  databaseURL: "https://finalfabc-default-rtdb.firebaseio.com",
  projectId: "finalfabc",
  storageBucket: "finalfabc.appspot.com",
  messagingSenderId: "198379653544",
  appId: "1:198379653544:web:5bd9dfab0e5ceb0f7ab59d",
  measurementId: "G-07Z6KSXPNF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

// Initialize Analytics only on client side
let analytics = null;

if (typeof window !== 'undefined') {
  // Initialize Analytics only on client side
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

// Function to get fan status
export const getFanStatus = async () => {
  const fanRef = ref(db, 'fan/status');
  try {
    const snapshot = await get(fanRef);
    return snapshot.val();
  } catch (error) {
    console.error('Error getting fan status:', error);
    return null;
  }
};

// Function to set fan status
export const setFanStatus = async (status: boolean) => {
  const fanRef = ref(db, 'fan/status');
  try {
    await set(fanRef, status);
    return true;
  } catch (error) {
    console.error('Error setting fan status:', error);
    return false;
  }
};

// Function to listen to fan status changes
export const onFanStatusChange = (callback: (status: boolean) => void) => {
  const fanRef = ref(db, 'fan/status');
  return onValue(fanRef, (snapshot) => {
    const status = snapshot.val();
    callback(status);
  });
};

// Function to get ESP8266 data
export const getESP8266Data = async () => {
  const espRef = ref(db, 'esp8266/data');
  try {
    const snapshot = await get(espRef);
    return snapshot.val();
  } catch (error) {
    console.error('Error getting ESP8266 data:', error);
    return null;
  }
};

// Function to listen to ESP8266 data changes
export const onESP8266DataChange = (callback: (data: any) => void) => {
  const espRef = ref(db, 'esp8266/data');
  return onValue(espRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export { db, analytics };