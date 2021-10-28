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

  async saveUserInfo(name) {
    setDoc(doc(db, "userInfo", userId), {
      name: name,
    });
  }

  async getUserInfo() {
    const querySnapshot = await getDocs(collection(db, "userInfo"), where("uid", "==", userId));
    var name = ""
    querySnapshot.forEach((doc) => {
      name = doc.data()['name'];
    });
    console.log(name);
    return name;
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

  async markVisited(userId, museumsVisited, artworksVisited) {
    var today = new Date();
    setDoc(doc(db, "wantToVisit", userId), {
      uid: userId,
      eventIds: [],
    });
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

  async markWantToVisit(userId, eventId, toRemove) {
    var currDoc = doc(db, "wantToVisit", userId);
    if (toRemove) {
      updateDoc(currDoc, {
        eventIds: arrayRemove(eventId)
      });
    } else {
      updateDoc(currDoc, {
        eventIds: arrayUnion(eventId)
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
    return [artworksVisited, favorites];
  }

  async getMuseumsVisited(userId) {
    const q = query(collection(db, "museumsVisited"), where("uid", "==", userId));

    const querySnapshot = await getDocs(q);
    var museumsVisited = [];
    var favorites = {};
    querySnapshot.forEach((doc) => {
      museumsVisited = Object.keys(doc.data().museumsVisited);
      for (let name of doc.data()['favorites']) {
        favorites[name] = {};
      }
    });
    return [museumsVisited, favorites];
  }

  async getWantToVisit(userId) {
    const q = query(collection(db, "wantToVisit"), where("uid", "==", userId));

    const querySnapshot = await getDocs(q);
    var wantToVisit = {};
    querySnapshot.forEach((doc) => {
      for (let id of doc.data()['eventIds']) {
        wantToVisit[id] = {};
      }
    });

    return wantToVisit;
  }

  async addArtworkstoDb(artworks) {
    var artworks = [
      {
        key: "American Gothic",
        museum: "The Art Institute of Chicago",
        artist: "Grant Wood",
        imgUrl: "https://www.artic.edu/iiif/2/b272df73-a965-ac37-4172-be4e99483637/full/843,/0/default.jpg",
      },
      {
        key: "Mona Lisa",
        museum: "Louvre",
        artist: "Leonardo da Vinci",
        imgUrl: "https://s.abcnews.com/images/International/mona_lisa_file_getty_190717_hpMain_20190717-061249_4x5_992.jpg",
      },
      {
        key: "Christina's World",
        museum: "MoMA",
        artist: "Andrew Wyeth",
        imgUrl: "https://www.moma.org/media/W1siZiIsIjE2NTQ1NyJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4MTQ0MFx1MDAzZSJdXQ.jpg?sha=87dcd730f5d306a4",
      },
      {
        key: "The Starry Night",
        museum: "MoMA",
        artist: "Vincent van Gogh",
        imgUrl: "https://www.vangoghgallery.com/img/starry_night_full.jpg",
      },
      {
        key: "Guernica",
        museum: "Museo Nacional Centro de Arte Reina Sofía",
        artist: "Pablo Picasso",
        imgUrl: "https://amuraworld.com/images/articles/140-groenlandia/01-full/090-guernica.jpg",
      },
      {
        key: "The Persistence of Memory",
        museum: "MoMA",
        artist: "Salvador Dalí",
        imgUrl: "https://www.moma.org/media/W1siZiIsIjM4NjQ3MCJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4MTQ0MFx1MDAzZSJdXQ.jpg?sha=4c0635a9ee70d63e",
      },
      {
        key: "Woman in Gold",
        museum: "Neue Galerie",
        artist: "Gustav Klimt",
        imgUrl: "https://news.artnet.com/app/news-upload/2016/10/3.-Klimt-Portrait-of-Adele-Bloch-Bauer-I-1907.jpg",
      },
      {
        key: "The Birth of Venus",
        museum: "Uffizi Gallery",
        artist: "Sandro Botticelli",
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1200px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
      },
      {
        key: "The Rape of Proserpina",
        museum: "Galleria Borghese",
        artist: "Gian Lorenzo Bernini",
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/The_Rape_of_Proserpina_%28Rome%29.jpg/1200px-The_Rape_of_Proserpina_%28Rome%29.jpg",
      },
      {
        key: "The Night Watch",
        museum: "Rijksmuseum",
        artist: "Rembrandt van Rijn",
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_Night_Watch_-_HD.jpg/1200px-The_Night_Watch_-_HD.jpg",
      },
      {
        key: "Las Meninas",
        museum: "Museo del Prado",
        artist: "Diego Velázquez",
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg/1200px-Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg",
      },
      {
        key: "David",
        museum: "Galleria dell'Accademia",
        artist: "Michelangelo",
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/%27David%27_by_Michelangelo_Fir_JBU005_denoised.jpg/1200px-%27David%27_by_Michelangelo_Fir_JBU005_denoised.jpg",
      },
    ];

    artworks.map((artwork) => {
      const name = artwork['key'];
      const museum = artwork['museum'];
      const imgUrl = artwork['imgUrl'];
      const artist = artwork['artist'];

      setDoc(doc(db, "artworks", name),{
        name: name,
        museum: museum,
        imgUrl: imgUrl,
        artist: artist,
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
      {
        key: "Louvre",
        city: "Paris, France",
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Louvre_Museum_%2827128035747%29.jpg/1200px-Louvre_Museum_%2827128035747%29.jpg",
      },
      {
        key: "Musée d'Orsay",
        city: "Paris, France",
        imgUrl: "https://cdn-imgix-open.headout.com/Orsay/6235-paris-musee-d-orsay-skip-the-line-entry-tickets-01.jpg?auto=compress%2Cformat&fm=pjpg&w=750&q=75&ar=1%3A1.07&fit=crop&crop=faces",
      },
      {
        key: "The Dalí Museum",
        city: "St. Petersburg, FL",
        imgUrl: "https://thedali.org/wp-content/uploads/2020/08/1200x500-Dali-Museum-Building-Daytime.jpg",
      },
      {
        key: "Metropolitan Museum of Art",
        city: "New York, NY",
        imgUrl: "https://media.timeout.com/images/105666959/image.jpg",
      },
      {
        key: "Van Gogh Museum",
        city: "Amsterdam, Netherlands",
        imgUrl: "http://justfunfacts.com/wp-content/uploads/2017/08/van-gogh-museum.jpg",
      },
      {
        key: "Sistine Chapel",
        city: "Vatican City, Italy",
        imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Sistine_Chapel_ceiling_02.jpg/350px-Sistine_Chapel_ceiling_02.jpg",
      },
      {
        key: "The Broad",
        city: "Los Angeles, CA",
        imgUrl: "https://www.thebroad.org/sites/default/files/images/image-thebroad%402x.jpg",
      },
      {
        key: "National Gallery",
        city: "London, U.K.",
        imgUrl: "https://www.ceeh.es/wp-content/uploads/2018/03/P3598_005_pr_.jpg",
      },
      {
        key: "National Museum of African American History & Culture",
        city: "Washington, D.C.",
        imgUrl: "https://civilrightstrail.com/app/uploads/2017/10/DC_Washington_AAHCMuseum2.jpg",
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
