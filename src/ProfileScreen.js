import React from "react";

import MuseumBadgeOps from "./MuseumBadgeOps";
import { BsBookmarkHeart, BsBookmarkHeartFill } from 'react-icons/bs';


class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.museumBadgeOps = new MuseumBadgeOps();
    this.state = {
      museumsVisited: [],
      artworksVisited: [],
      allArtworks: {},
      allMuseums: {},
      artworkFavorites: {},
      museumFavorites: {},
      wantToVisit: {},
      name: "",
    }
  }

  async componentDidMount() {
    const artworks = await this.museumBadgeOps.getAllArtworks();
    const museums = await this.museumBadgeOps.getAllMuseums();

    var artworksObj = {}
    for (let artwork of artworks) {
      const name = artwork['name'];
      artworksObj[name] = artwork;
    }

    var museumsObj = {}
    for (let museum of museums) {
      const name = museum['name'];
      museumsObj[name] = museum;
    }

    const id = this.props.match.params.id;
    const museumsVisitedRes = await this.museumBadgeOps.getMuseumsVisited(id);
    const museumsVisitedList = museumsVisitedRes[0];
    const museumFavorites = museumsVisitedRes[1];


    const artworksVisitedRes = await this.museumBadgeOps.getArtworksVisited(id);
    const artworksVisitedList = artworksVisitedRes[0];
    const artworkFavorites = artworksVisitedRes[1];

    const wantToVisitRes = await this.museumBadgeOps.getWantToVisit(id);

    var name = ""
    if (this.props.location.state != null) {
      name = this.props.location.state.name;
    } else {
      name = await this.museumBadgeOps.getUserInfo();
      console.log(name);
    }

    this.setState({
      allArtworks: artworksObj,
      allMuseums: museumsObj,
      artworksVisited: artworksVisitedList,
      museumsVisited: museumsVisitedList,
      museumFavorites: museumFavorites,
      artworkFavorites: artworkFavorites,
      wantToVisit: wantToVisitRes,
      name: name,
    });
  }

  clickFavorite(name, imgUrl, subtitle, isMuseum) {
    const userId = this.props.match.params.id;
    var isFavorite = false;
    const allFavorites = Object.assign({}, this.state.museumFavorites, this.state.artworkFavorites);

    if (name in allFavorites) {
      delete this.state.museumFavorites[name];
      delete this.state.artworkFavorites[name];
    } else {
      if (isMuseum === true) {
        this.state.museumFavorites[name] = {
          imgUrl: imgUrl,
          subtitle: subtitle,
        };
      } else {
        this.state.artworkFavorites[name] = {
          imgUrl: imgUrl,
          subtitle: subtitle,
        };
      }
      isFavorite = true;
    }
    this.museumBadgeOps.markFavorite(userId, name, isFavorite, isMuseum);
    this.forceUpdate();
  }

  renderFavoriteArtworks() {
    if (Object.keys(this.state.artworkFavorites).length === 0 || Object.keys(this.state.allArtworks).length === 0) {
      return ( <div /> );
    }

    return Object.keys(this.state.artworkFavorites).map((name) => {
      var imgUrl = this.state.allArtworks[name]["imgUrl"];
      var artist = this.state.allArtworks[name]["artist"];
      return (
        <div key={name} className="Art-checkbox">
          <div className="Art-icon">
              <img className="Art-icon-photo" src={imgUrl} alt={name} />
              <div className="Art-details">
                <b>{name}</b>
                {artist}
              </div>
          </div>
        </div>
      )
    });
  }

  renderFavoriteMuseums() {
    if (Object.keys(this.state.museumFavorites).length === 0 || Object.keys(this.state.allMuseums).length === 0) {
      return ( <div /> );
    }

    return Object.keys(this.state.museumFavorites).map((name) => {
      var imgUrl = this.state.allMuseums[name]["imgUrl"];
      var city = this.state.allMuseums[name]["city"];
      return (
        <div key={name} className="Art-checkbox">
          <div className="Art-icon">
              <img className="Art-icon-photo" src={imgUrl} alt={name} />
              <div className="Art-details">
                <b>{name}</b>
                {city}
              </div>
          </div>
        </div>
      )
    });
  }

  renderVisitedArtworks() {
    if (Object.keys(this.state.allArtworks).length === 0) {
      return ( <div /> );
    }

    return this.state.artworksVisited.map((name) => {
      var imgUrl = this.state.allArtworks[name]["imgUrl"];
      var artist = this.state.allArtworks[name]["artist"];
      var museum = this.state.allArtworks[name]["museum"];
      return (
        <div key={name} className="Art-checkbox">
          {name in this.state.artworkFavorites ?
            <BsBookmarkHeartFill onClick={() => this.clickFavorite(name, imgUrl, museum, false)} className="icon" size="30" /> :
            <BsBookmarkHeart onClick={() => this.clickFavorite(name, imgUrl, museum, false)} className="icon" size="30" />
          }
          <div className="Art-icon">
              <img className="Art-icon-photo" src={imgUrl} alt={name} />
              <div className="Art-details">
                <b>{name}</b>
                {artist}<br />
                <text className="Art-details-subtitle">{museum}</text>
              </div>
          </div>
        </div>
      )
    });
  }

  renderVisitedMuseums() {
    if (Object.keys(this.state.allMuseums).length === 0) {
      return ( <div /> );
    }

    return this.state.museumsVisited.map((name) => {
      var imgUrl = this.state.allMuseums[name]["imgUrl"];
      var city = this.state.allMuseums[name]["city"];
      return (
        <div key={name} className="Art-checkbox">
          {name in this.state.museumFavorites ?
            <BsBookmarkHeartFill onClick={() => this.clickFavorite(name, imgUrl, city, true)} className="icon" size="30" /> :
            <BsBookmarkHeart onClick={() => this.clickFavorite(name, imgUrl, city, true)} className="icon" size="30" />
          }
          <div className="Art-icon">
              <img className="Art-icon-photo" src={imgUrl} alt={name} />
              <div className="Art-details">
                <b>{name}</b>
                {city}
              </div>
          </div>
        </div>
      )
    });
  }

  renderWantToVisit() {
    if (Object.keys(this.state.wantToVisit).length === 0) {
      return ( <div /> );
    }

    const events = [
      {
        name: "2021 Triennial",
        location: "New Museum",
        startDate: "10/28/2021",
        endDate: "01/23/2022",
        imgUrl: "https://235bowery.s3.amazonaws.com/exhibitions/293/thumbnails/1280x1024x1.jpg",
      },
      {
        name: "Fragile Future",
        location: "The Shed",
        startDate: "09/29/2021",
        endDate: "12/19/2021",
        imgUrl: "https://cdn.filepicker.io/api/file/8WlywWEzSayqncjLKQ3r/convert?w=2048&compress=true&fit=max",
      },
      {
        name: "Jasper Johns: Mind/Mirror",
        location: "Whitney Museum",
        startDate: "09/29/2021",
        endDate: "02/13/2022",
        imgUrl: "https://whitneymedia.org/assets/image/826730/medium_ARCH_WMAA-15.jpg",
      },
    ];

    return Object.keys(this.state.wantToVisit).map((i) => {
      var name = events[i]['name'];
      var location = events[i]['location'];
      var imgUrl = events[i]['imgUrl'];
      return (
        <div key={name} className="Art-checkbox">
          <div className="Art-icon">
              <img className="Art-icon-photo" src={imgUrl} alt={name} />
              <div className="Art-details">
                <b>{name}</b>
                {location}
              </div>
          </div>
        </div>
      )
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.name != "" ? <h1>{this.state.name}'s Collection</h1> : <div />}
        <hr />
        <h3>Favorites</h3>
        <div className="Art-checkbox-container">
          { this.renderFavoriteArtworks() }
          { this.renderFavoriteMuseums() }
        </div><br />
        <h3>Museums visited</h3>
        <div className="Art-checkbox-container">
          { this.renderVisitedMuseums() }
        </div><br />
        <h3>Artworks seen</h3>
        <div className="Art-checkbox-container">
          { this.renderVisitedArtworks() }
        </div><br />
        <h3>Want to visit</h3>
        <div className="Art-checkbox-container">
          { this.renderWantToVisit() }
        </div>
      </div>
    );
  }
}

export default ProfileScreen;
