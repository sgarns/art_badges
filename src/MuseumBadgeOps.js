import React from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDd8Un9AOsd-wNhpDyR0FrJZiqvINHl3qY",
  authDomain: "museum-badges.firebaseapp.com",
  projectId: "museum-badges",
  storageBucket: "museum-badges.appspot.com",
  messagingSenderId: "452335557075",
  appId: "1:452335557075:web:3e597070378004b7aaf726",
  measurementId: "G-C0M0LQG6H2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
var userId = "";

class MuseumBadgeOps extends React.Component {
  constructor(props) {
    super(props);
  }


  async markVisited(museumsVisited, artworksVisited) {
    const auth = getAuth();
    var today = new Date();
    signInAnonymously(auth).then(() => {
      userId = auth.currentUser.uid;
      addDoc(collection(db, "museumsVisited"), {
        timestamp: today,
        uid: userId,
        museumsVisited: museumsVisited
      });
      addDoc(collection(db, "artworksVisited"), {
        timestamp: today,
        uid: userId,
        artworksVisited: artworksVisited
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`error logging in: ${errorMessage}`);
    });
  }

}

export default MuseumBadgeOps;
