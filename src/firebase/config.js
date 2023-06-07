import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: "movie-mania-18023.firebaseapp.com",
  projectId: "movie-mania-18023",
  storageBucket: "movie-mania-18023.appspot.com",
  messagingSenderId: "640274348032",
  appId: "1:640274348032:web:1b549841e9308957f240e5",
};

//init firebase
firebase.initializeApp(firebaseConfig);

//init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

//timestamp
const timestamp = firebase.firestore.Timestamp;

export { projectAuth, projectFirestore, timestamp, projectStorage };
