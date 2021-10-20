import React from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
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
      museumsVisited: museumsVisited,
      favorites: [],
    });
    setDoc(doc(db, "artworksVisited", userId), {
      timestamp: today,
      uid: userId,
      artworksVisited: artworksVisited,
      favorites: [],
    });
  }

  async markFavorite(userId, name, isFavorite, isMuseum) {
    var currDoc = {};
    if (isMuseum) {
      currDoc = doc(db, "museumsVisited", userId);
    } else {
      currDoc = doc(db, "artworksVisited", userId);
    }

    if (isFavorite) {
      updateDoc(currDoc, {
        favorites: arrayUnion(name)
      });
    } else {
      updateDoc(currDoc, {
        favorites: arrayRemove(name)
      });
    }
  }

  async getAllArtworks() {
    var allArtworks = [];

    const querySnapshot = await getDocs(collection(db, "artworks"));
    querySnapshot.forEach((doc) => {
      allArtworks.push(doc.data());
    });

    return allArtworks;
  }

  async getAllMuseums() {
    var allMuseums = [];

    const querySnapshot = await getDocs(collection(db, "museums"));
    querySnapshot.forEach((doc) => {
      allMuseums.push(doc.data());
    });

    return allMuseums;
  }

  async getMuseumsVisited(userId) {
    const q = query(collection(db, "museumsVisited"), where("uid", "==", userId));

    const querySnapshot = await getDocs(q);
    var museumsVisited = [];
    var favorites = {};
    querySnapshot.forEach((doc) => {
      museumsVisited = Object.keys(doc.data().museumsVisited);
      for (let name of doc.data()['favorites']) {
        favorites[name] = {}
      }
    });
    return [museumsVisited, favorites];
  }

  async getArtworksVisited(userId) {
    const q = query(collection(db, "artworksVisited"), where("uid", "==", userId));

    const querySnapshot = await getDocs(q);
    var artworksVisited = [];
    var favorites = {};
    querySnapshot.forEach((doc) => {
      artworksVisited = Object.keys(doc.data().artworksVisited);
      for (let name of doc.data()['favorites']) {
        favorites[name] = {}
      }
    });
    console.log(favorites);
    return [artworksVisited, favorites];
  }

  async addArtworkstoDb(artworks) {
    var artworks = [
      {
        key: "American Gothic",
        museum: "The Art Institute of Chicago",
        imgUrl: "https://www.artic.edu/iiif/2/b272df73-a965-ac37-4172-be4e99483637/full/843,/0/default.jpg",
      },
      {
        key: "Mona Lisa",
        museum: "Louvre",
        imgUrl: "https://s.abcnews.com/images/International/mona_lisa_file_getty_190717_hpMain_20190717-061249_4x5_992.jpg",
      },
      {
        key: "Christina's World",
        museum: "MoMA",
        imgUrl: "https://www.moma.org/media/W1siZiIsIjE2NTQ1NyJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4MTQ0MFx1MDAzZSJdXQ.jpg?sha=87dcd730f5d306a4",
      },
    ];

    artworks.map((artwork) => {
      const name = artwork['key'];
      const museum = artwork['museum'];
      const imgUrl = artwork['imgUrl'];

      setDoc(doc(db, "artworks", name),{
        name: name,
        museum: museum,
        imgUrl: imgUrl,
      });
    });
  }

  async addMuseumstoDb(museums) {
    var museums = [
      {
        key: "SFMOMA",
        city: "San Francisco, CA",
        imgUrl: "https://www.sftravel.com/sites/sftravel.prod.acquia-sites.com/files/field/image/SFMOMA-Header.jpg",
      },
      {
        key: "MoMA",
        city: "New York, NY",
        imgUrl: "https://www.moma.org/assets/visit/entrance-image--museum-crop-7516b01003659172f2d9dbc7a6c2e9d9.jpg",
      },
      {
        key: "The Art Institute of Chicago",
        city: "Chicago, IL",
        imgUrl: "https://media.timeout.com/images/102850781/image.jpg",
      },
    ];

    museums.map((museum) => {
      const name = museum['key'];
      const city = museum['city'];
      const imgUrl = museum['imgUrl'];

      setDoc(doc(db, "museums", name),{
        name: name,
        city: city,
        imgUrl: imgUrl,
      });
    });
  }

}

export default MuseumBadgeOps;
