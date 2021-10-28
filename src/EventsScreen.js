import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { BsBookmarkHeart, BsBookmarkHeartFill } from 'react-icons/bs';

import { withRouter, Redirect } from 'react-router-dom';

import MuseumBadgeOps from "./MuseumBadgeOps";

import {
  useParams
} from "react-router-dom";

import './App.css';

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

class EventsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.museumBadgeOps = new MuseumBadgeOps();
    this.state = {
      wantToVisit: {},
      userId: ""
    }
  }

  async componentDidMount() {
    const userId = await this.museumBadgeOps.signIn();
    const wantToVisitRes = await this.museumBadgeOps.getWantToVisit(userId);

    this.setState({
      wantToVisit: wantToVisitRes,
      userId: userId,
    });
  }

  handleClick(i) {
    var toRemove = false;
    if (i in this.state.wantToVisit) {
      delete this.state.wantToVisit[i];
      toRemove = true;
    } else {
      this.state.wantToVisit[i] = {};
    }
    this.museumBadgeOps.markWantToVisit(this.state.userId, i, toRemove);
    this.forceUpdate();
  }

  renderEvents() {
    return events.map((event, i) => {
      const name = event['name'];
      const location = event['location'];
      const startDate = event['startDate'];
      const endDate = event['endDate'];
      const imgUrl = event['imgUrl'];

      return (
        <Card className="Event-card">
          {i in this.state.wantToVisit ?
            <BsBookmarkHeartFill onClick={() => this.handleClick(i)} className="icon" size="35" /> :
            <BsBookmarkHeart onClick={() => this.handleClick(i)} className="icon" size="35" />
          }
          <Card.Img variant="top" className="Event-card-image" src={imgUrl} />
          <Card.Body>
            <Card.Title className="Event-title">{ name }</Card.Title>
            <Card.Subtitle >
              { location }<br />
              <text className="Event-subtitle">{ startDate } - { endDate }</text>
            </Card.Subtitle>
          </Card.Body>
        </Card>
      )
    });
  }

  renderWantToVisit() {
    return Object.keys(this.state.wantToVisit).map((i) => {
      var event = events[i];
      const name = event['name'];
      const location = event['location'];
      const startDate = event['startDate'];
      const endDate = event['endDate'];
      const imgUrl = event['imgUrl'];

      return (
        <Card className="Event-card">
          {i in this.state.wantToVisit ?
            <BsBookmarkHeartFill onClick={() => this.handleClick(i)} className="icon" size="35" /> :
            <BsBookmarkHeart onClick={() => this.handleClick(i)} className="icon" size="35" />
          }
          <Card.Img variant="top" className="Event-card-image" src={imgUrl} />
          <Card.Body>
            <Card.Title className="Event-title">{ name }</Card.Title>
            <Card.Subtitle >
              { location }<br />
              <text className="Event-subtitle">{ startDate } - { endDate }</text>
            </Card.Subtitle>
          </Card.Body>
        </Card>
      )
    });
  }

  render() {
    return (
      <div className="App">
        <h2>Events</h2>
        <div className="Events-container">
          { this.renderEvents() }
        </div>
        <h3>Want to Visit</h3>
        <div className="Events-container">
          { this.renderWantToVisit() }
        </div>
      </div>
    );
  }
}

export default withRouter(EventsScreen);
