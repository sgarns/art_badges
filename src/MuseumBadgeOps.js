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
    this.state = {
      userId: "",
    }
  }

  async signIn() {
    const auth = getAuth();
    return signInAnonymously(auth).then(() => {
      userId = auth.currentUser.uid;
      this.setState({ userId: userId });
      return userId;
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`error logging in: ${errorMessage}`);
    });
  }


  async markVisited(userId, museumsVisited, artworksVisited) {
    var today = new Date();
    setDoc(doc(db, "museumsVisited", userId), {
      timestamp: today,
      uid: userId,
      museumsVisited: museumsVisited
    });
    setDoc(doc(db, "artworksVisited", userId), {
      timestamp: today,
      uid: userId,
      artworksVisited: artworksVisited
    });
  }

  async getMuseumsVisited(userId) {
    const q = query(collection(db, "museumsVisited"), where("uid", "==", userId));

    const querySnapshot = await getDocs(q);
    var museumsVisited = [];
    querySnapshot.forEach((doc) => {
      museumsVisited = Object.keys(doc.data().museumsVisited);
    });
    return museumsVisited;
  }

  async getArtworksVisited(userId) {
    const q = query(collection(db, "artworksVisited"), where("uid", "==", userId));

    const querySnapshot = await getDocs(q);
    var artworksVisited = [];
    querySnapshot.forEach((doc) => {
      artworksVisited = Object.keys(doc.data().artworksVisited);
    });
    return artworksVisited;
  }

}

export default MuseumBadgeOps;
