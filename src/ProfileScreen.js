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
      favorites: {},
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

    const allFavorites = Object.assign({}, museumFavorites, artworkFavorites);

    this.setState({
      allArtworks: artworksObj,
      allMuseums: museumsObj,
      artworksVisited: artworksVisitedList,
      museumsVisited: museumsVisitedList,
      favorites: allFavorites,
    });
  }

  clickFavorite(name, isMuseum) {
    const userId = this.props.match.params.id;
    var isFavorite = false;

    if (name in this.state.favorites) {
      delete this.state.favorites[name];
    } else {
      this.state.favorites[name] = {};
      isFavorite = true;
    }
    this.museumBadgeOps.markFavorite(userId, name, isFavorite, isMuseum);
    this.forceUpdate();
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
          {name in this.state.favorites ?
            <BsBookmarkHeartFill onClick={() => this.clickFavorite(name, false)} className="icon" size="25" /> :
            <BsBookmarkHeart onClick={() => this.clickFavorite(name, false)} className="icon" size="25" />
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
          {name in this.state.favorites ?
            <BsBookmarkHeartFill onClick={() => this.clickFavorite(name, true)} className="icon" size="25" /> :
            <BsBookmarkHeart onClick={() => this.clickFavorite(name, true)} className="icon" size="25" />
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
    return (
      <div className="App">
        <h1>{this.props.location.state.name}'s Collection</h1>
        <h3>Museums you've visited</h3>
        <div className="Art-checkbox-container">
          { this.renderVisitedMuseums() }
        </div>
        <h3>Artworks you've seen</h3>
        <div className="Art-checkbox-container">
          { this.renderVisitedArtworks() }
        </div>
      </div>
    );
  }
}

export default ProfileScreen;
