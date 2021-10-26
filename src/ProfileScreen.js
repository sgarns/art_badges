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
      var artist = this.state.allMuseums[name]["artist"];
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

  renderVisitedArtworks() {
    if (Object.keys(this.state.allArtworks).length === 0) {
      return ( <div /> );
    }

    return this.state.artworksVisited.map((name) => {
      var imgUrl = this.state.allArtworks[name]["imgUrl"];
      var museum = this.state.allArtworks[name]["museum"];
      return (
        <div key={name} className="Art-checkbox">
          {name in this.state.artworkFavorites ?
            <BsBookmarkHeartFill onClick={() => this.clickFavorite(name, imgUrl, museum, false)} className="icon" size="25" /> :
            <BsBookmarkHeart onClick={() => this.clickFavorite(name, imgUrl, museum, false)} className="icon" size="25" />
          }
          <div className="Art-icon">
              <img className="Art-icon-photo" src={imgUrl} alt={name} />
              <div className="Art-details">
                <b>{name}</b>
                {museum}
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
            <BsBookmarkHeartFill onClick={() => this.clickFavorite(name, imgUrl, city, true)} className="icon" size="25" /> :
            <BsBookmarkHeart onClick={() => this.clickFavorite(name, imgUrl, city, true)} className="icon" size="25" />
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

  render() {
    console.log(this.state.name);

    return (
      <div className="App">
        {this.state.name != "" ? <h1>{this.state.name}'s Collection</h1> : <div />}
        <h3>Favorites</h3>
        <div className="Art-checkbox-container">
          { this.renderFavoriteArtworks() }
          { this.renderFavoriteMuseums() }
        </div>
        <h3>Museums visited</h3>
        <div className="Art-checkbox-container">
          { this.renderVisitedMuseums() }
        </div>
        <h3>Artworks seen</h3>
        <div className="Art-checkbox-container">
          { this.renderVisitedArtworks() }
        </div>
      </div>
    );
  }
}

export default ProfileScreen;
