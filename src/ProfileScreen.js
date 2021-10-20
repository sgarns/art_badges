import React from "react";

import MuseumBadgeOps from "./MuseumBadgeOps";

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.museumBadgeOps = new MuseumBadgeOps();
    this.state = {
      museumsVisited: [],
      artworksVisited: [],
      allArtworks: {},
      allMuseums: {},
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
    const museumsVisitedList = await this.museumBadgeOps.getMuseumsVisited(id);
    const artworksVisitedList = await this.museumBadgeOps.getArtworksVisited(id);

    this.setState({
      allArtworks: artworksObj,
      allMuseums: museumsObj,
      artworksVisited: artworksVisitedList,
      museumsVisited: museumsVisitedList,
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
        <div className="Art-checkbox">
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
