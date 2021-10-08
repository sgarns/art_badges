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
// var userId = "";

class MuseumBadgeOps extends React.Component {
  async login() {
    const auth = getAuth();
    signInAnonymously(auth).then(() => {
      const uid = auth.currentUser.uid;
      // userId = uid;
      return uid;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`error logging in: ${errorMessage}`);
    });
  }

  constructor(props) {
    super(props);
    this.login();
  }

  async getBadgesEarned(userId) {
    const q = query(collection(db, "badgesEarned"), where("uid", "==", userId));

    const querySnapshot = await getDocs(q);
    var badgesEarned = {};
    querySnapshot.forEach((doc) => {
      var badgeName = doc.data().badgeName;
      badgesEarned[badgeName] = true;
    });
    console.log("badges earned in ops");
    console.log(badgesEarned);
    return badgesEarned;
  }

  async updateBadgeStatus(badgeName, userId, earnedBadge) {
    // Add a new document in collection "cities"
    var today = new Date();
    try {
      if (!earnedBadge) {
        const docRef = await addDoc(collection(db, "badgesEarned"), {
          timestamp: today,
          uid: userId,
          badgeName: badgeName
        });
      } else {
        console.log("deleting");
        const q = query(
          collection(db, "badgesEarned"),
          where("uid", "==", userId),
          where("badgeName", "==", badgeName)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log("hi");
          console.log(doc.data());
          // const docRef = await deleteDoc(doc);
        });

      }
      // console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}

export default MuseumBadgeOps;
