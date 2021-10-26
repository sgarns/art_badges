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
      visitedMuseums: {},
      visitedArtworks: {},
      allMuseums: [],
      allArtworks: [],
      userId: "",
      name: "",
    };
  }

  async componentDidMount() {
    const artworks = await this.museumBadgeOps.getAllArtworks();
    const museums = await this.museumBadgeOps.getAllMuseums();
    this.setState({
      allArtworks: artworks,
      allMuseums: museums,
    });
  }

  renderVisitedMuseums() {
    return this.state.allMuseums.map((museum, i) => {
      var name = museum['name'];
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
    return this.state.allArtworks.map((artwork, i) => {
      var name = artwork['name'];
      var museum = artwork['museum'];
      var imgUrl = artwork['imgUrl'];
      var artist = artwork['artist'];
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
                  {artist}<br />
                  <div className="Art-icon-subtitle">{museum}</div>
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
      visitedMuseums: updatedVisitedMuseums,
    });
  }

  // On click of artwork checkbox, update state
  onVisitedArtworkChange(e) {
    const val = e.target.checked;
    const name = e.target.name;
    let updatedVisitedArtworks = Object.assign({}, this.state.visitedArtworks, {[name]: val});
    this.setState({
      visitedArtworks: updatedVisitedArtworks,
    });
  }

  onNameChange(e) {
    const val = e.target.value;
    this.setState({
      name: val,
    });
  }

  // When form is submitted, add to db and go to profile
  async onFormSubmit(e) {
    e.preventDefault();
    const userId = await this.museumBadgeOps.signIn();
    this.setState({ userId: userId });

    this.museumBadgeOps.markVisited(userId, this.state.visitedMuseums, this.state.visitedArtworks);
    this.museumBadgeOps.saveUserInfo(this.state.name);

    this.props.history.push({
      pathname: '/profile/' + userId,
      state: {
        userId: userId,
        name: this.state.name,
      }
    });
  }

  render() {
    this.museumBadgeOps.addArtworkstoDb();
    this.museumBadgeOps.addMuseumstoDb();
    return (
      <div className="App">
          <div className="Museum-container">
            <form onSubmit={this.onFormSubmit.bind(this)}>
              <h3>What's your name?</h3>
              <input
                type="text"
                id="name"
                onChange={this.onNameChange.bind(this)}
                value={this.state.name}
              />
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
