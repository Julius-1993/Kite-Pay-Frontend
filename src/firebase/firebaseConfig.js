 // firebaseConfig.js
 import { initializeApp } from "firebase/app";
 import { getStorage } from "firebase/storage";

 const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "FIREBASE_AUTH_DOMAIN",
  projectId: "FIREBASE_PROJECT_ID",
  storageBucket: "FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "FIREBASE_MESSAGE_SENDER_ID",
  appId: "FIREBASE_APP_ID"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const storage = getStorage(app);

 export { storage };