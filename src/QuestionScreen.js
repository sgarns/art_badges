import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import MuseumBadgeOps from "./MuseumBadgeOps";

import {
  useParams
} from "react-router-dom";

import './App.css';

class QuestionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.museumBadgeOps = new MuseumBadgeOps();
    this.state = {
      'visitedMuseums': {
      },
      'visitedArtworks': {
      },
      'userId': "",
    };
  }

  renderVisitedMuseums() {
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

    return museums.map((museum, i) => {
      var name = museum['key'];
      var city = museum['city'];
      var imgUrl = museum['imgUrl'];
      return (
        <div className="Art-checkbox">
          <input
            type="checkbox"
            name={name}
            id={name}
            onChange={this.onVisitedMuseumChange.bind(this)}
            value={this.state.visitedMuseums[name]}
          />
          <label key={i} for={name}>
            <div className="Art-icon">
                <img className="Art-icon-photo" src={imgUrl} alt={name} />
                <div className="Art-details">
                  <b>{name}</b>
                  {city}
                </div>
            </div>
          </label>
        </div>
      )
    })
  }

  renderVisitedArtworks() {
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
    return artworks.map((artwork, i) => {
      var name = artwork['key'];
      var museum = artwork['museum'];
      var imgUrl = artwork['imgUrl'];
      return (
        <div className="Art-checkbox">
          <input
            type="checkbox"
            name={name}
            id={name}
            onChange={this.onVisitedArtworkChange.bind(this)}
            value={this.state.visitedArtworks[name]}
          />
          <label key={i} for={name}>
            <div className="Art-icon">
                <img className="Art-icon-photo" src={imgUrl} alt={name} />
                <div className="Art-details">
                  <b>{name}</b>
                  {museum}
                </div>
            </div>
          </label>
        </div>
      )
    })
  }

  // On click of museum checkbox, update state
  onVisitedMuseumChange(e) {
    const val = e.target.checked;
    const name = e.target.name;
    let updatedVisitedMuseums = Object.assign({}, this.state.visitedMuseums, {[name]: val});
    this.setState({
      'visitedMuseums': updatedVisitedMuseums
    });
  }

  // On click of artwork checkbox, update state
  onVisitedArtworkChange(e) {
    const val = e.target.checked;
    const name = e.target.name;
    let updatedVisitedArtworks = Object.assign({}, this.state.visitedArtworks, {[name]: val});
    this.setState({
      'visitedArtworks': updatedVisitedArtworks
    });
  }

  // When form is submitted, add to db and go to profile
  async onFormSubmit(e) {
    e.preventDefault();
    console.log('visited museums', this.state.visitedMuseums);
    console.log('visited artworks', this.state.visitedArtworks);
    const userId = await this.museumBadgeOps.signIn();
    this.setState({'userId': userId});

    this.museumBadgeOps.markVisited(userId, this.state.visitedMuseums, this.state.visitedArtworks);
    this.props.history.push({
      pathname: '/profile/' + userId,
      state: { userId: userId }
    });
  }

  render() {
    return (
      <div className="App">
          <div className="Museum-container">
            <form onSubmit={this.onFormSubmit.bind(this)}>
              <h3>Which museums have you visited?</h3>
              <div className="Art-checkbox-container">
                { this.renderVisitedMuseums() }
              </div>
              <h3>What artworks have you seen?</h3>
              <div className="Art-checkbox-container">
                { this.renderVisitedArtworks() }
              </div>
              <br /><input className="Submit-button" type="submit" value="Save"/>
            </form>
          </div>
      </div>
    );
  }
}

export default withRouter(QuestionScreen);
