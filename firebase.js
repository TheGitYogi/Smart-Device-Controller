// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBihwvnb7Ec0pFYYX_i2_MhriOfULRSUtk",
  authDomain: "finalfabc.firebaseapp.com",
  databaseURL: "https://finalfabc-default-rtdb.firebaseio.com/",
  projectId: "finalfabc",
  storageBucket: "finalfabc.appspot.com",
  messagingSenderId: "198379653544",
  appId: "1:198379653544:web:5bd9dfab0e5ceb0f7ab59d"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue };
