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
    // var museums = {
    //   "SFMOMA": {
    //     key: "SFMOMA",
    //     city: "San Francisco, CA",
    //     imgUrl: "https://www.sftravel.com/sites/sftravel.prod.acquia-sites.com/files/field/image/SFMOMA-Header.jpg",
    //   },
    //   "MoMA": {
    //     key: "MoMA",
    //     city: "New York, NY",
    //     imgUrl: "https://www.moma.org/assets/visit/entrance-image--museum-crop-7516b01003659172f2d9dbc7a6c2e9d9.jpg",
    //   },
    //   "The Art Institute of Chicago": {
    //     key: "The Art Institute of Chicago",
    //     city: "Chicago, IL",
    //     imgUrl: "https://media.timeout.com/images/102850781/image.jpg",
    //   },
    // };

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
        <h2>Museums you've visited</h2>
        <div className="Art-checkbox-container">
          { this.renderVisitedMuseums() }
        </div>
        <h2>Artworks you've seen</h2>
        <div className="Art-checkbox-container">
          { this.renderVisitedArtworks() }
        </div>
      </div>
    );
  }
}

export default ProfileScreen;
