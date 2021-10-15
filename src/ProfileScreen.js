import React from "react";

import MuseumBadgeOps from "./MuseumBadgeOps";

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.museumBadgeOps = new MuseumBadgeOps();
    this.state = {
      "museumsVisited": [],
      "artworksVisited": [],
    }
  }

  renderVisitedArtworks() {
    var artworks = {
      "American Gothic": {
        key: "American Gothic",
        museum: "The Art Institute of Chicago",
        imgUrl: "https://www.artic.edu/iiif/2/b272df73-a965-ac37-4172-be4e99483637/full/843,/0/default.jpg",
      },
      "Mona Lisa": {
        key: "Mona Lisa",
        museum: "Louvre",
        imgUrl: "https://s.abcnews.com/images/International/mona_lisa_file_getty_190717_hpMain_20190717-061249_4x5_992.jpg",
      },
      "Christina's World": {
        key: "Christina's World",
        museum: "MoMA",
        imgUrl: "https://www.moma.org/media/W1siZiIsIjE2NTQ1NyJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4MTQ0MFx1MDAzZSJdXQ.jpg?sha=87dcd730f5d306a4",
      },
    };

    return this.state.artworksVisited.map((name) => {
      var imgUrl = artworks[name]["imgUrl"];
      var museum = artworks[name]["museum"];
      return (
        <div className="Art-checkbox">
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

    return(<div>Hello</div>);
  }

  async componentDidMount() {
    const id = this.props.match.params.id;
    console.log("SARA id");
    console.log(id);
    const museumsVisitedList = await this.museumBadgeOps.getMuseumsVisited(id);
    const artworksVisitedList = await this.museumBadgeOps.getArtworksVisited(id);
    this.setState({
      "museumsVisited": museumsVisitedList,
      "artworksVisited": artworksVisitedList,
    });
  }

  renderVisitedMuseums() {
    var museums = {
      "SFMOMA": {
        key: "SFMOMA",
        city: "San Francisco, CA",
        imgUrl: "https://www.sftravel.com/sites/sftravel.prod.acquia-sites.com/files/field/image/SFMOMA-Header.jpg",
      },
      "MoMA": {
        key: "MoMA",
        city: "New York, NY",
        imgUrl: "https://www.moma.org/assets/visit/entrance-image--museum-crop-7516b01003659172f2d9dbc7a6c2e9d9.jpg",
      },
      "The Art Institute of Chicago": {
        key: "The Art Institute of Chicago",
        city: "Chicago, IL",
        imgUrl: "https://media.timeout.com/images/102850781/image.jpg",
      },
    };

    return this.state.museumsVisited.map((name) => {
      var imgUrl = museums[name]["imgUrl"];
      var city = museums[name]["city"];
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
