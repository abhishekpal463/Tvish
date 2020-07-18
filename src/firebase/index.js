import firebase from 'firebase'
const firebaseConfig = {
  apiKey: "AIzaSyARXf2wdmACZax7gaiGt4FvZXIHm6ALbXA",
  authDomain: "tvish-5f65e.firebaseapp.com",
  databaseURL: "https://tvish-5f65e.firebaseio.com",
  projectId: "tvish-5f65e",
  storageBucket: "tvish-5f65e.appspot.com",
  messagingSenderId: "113521192857",
  appId: "1:113521192857:web:982715eff608518d766d08",
  measurementId: "G-0LVR3JVG6V"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth;
var signUp = async (email, password) => await auth().createUserWithEmailAndPassword(email, password);
const signOut = () => auth().signOut();
const signIn = async (email, password) => await auth().signInWithEmailAndPassword(email, password);
var authOnChange=auth().onAuthStateChanged((user) => user);

export {
  signUp,
  signOut,
  signIn,
  authOnChange,
  db,
  auth
}