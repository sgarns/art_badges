import logo from './logo.svg';
import React from 'react';

import MuseumBadgeOps from "./MuseumBadgeOps";

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.museumBadgeOps = new MuseumBadgeOps();
    this.state = {
      badgesEarned: {},
      userId: "NTel3ogKlOeJMrEbAjttQoyeeUi2",
    };

    var promise = this.museumBadgeOps.getBadgesEarned(this.state.userId);
    var that = this;
    promise
    .then(function (result) {
      that.setState({badgesEarned: result});
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });

    // add to state somewhere
    // this.museumBadgeOps.login().then(userId => {
    //   console.log("inside login");
    //   this.setState({userId: userId});
    //   var promise = that.museumBadgeOps.getBadgesEarned(userId);
    //   promise
    //   .then(function (result) {
    //     console.log("done getting badges earned");
    //     console.log(result);
    //   })
    //   .catch(function (error) {
    //     console.error("Error adding document: ", error);
    //   });
    // });
  }

  addBadge(name) {
    var currentBadgeState = (name in this.state.badgesEarned) && this.state.badgesEarned[name];
    var promise = this.museumBadgeOps.updateBadgeStatus(name, this.state.userId, currentBadgeState);
    var that = this;
    promise
    .then(function () {
      that.setState(prevState => ({
        badgesEarned: {                   // object that we want to update
            ...prevState.badgesEarned,    // keep all other key-value pairs
            [name]: !prevState.badgesEarned[name]      // update the value of specific key
        }
      }));
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
  }

  getMuseumBadges() {
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

    return museums.map(museum => {
      var name = museum['key'];
      var city = museum['city'];
      var imgUrl = museum['imgUrl'];

      return (
          <div className="Museum-badge" key={name}>
            <a href="#" onClick={() => this.addBadge(name)}>
              {this.state.badgesEarned[name] == true ?
                <img className="Museum-visited-icon" src={imgUrl} alt={name} />
                :
                <img className="Museum-icon" src={imgUrl} alt={name} />
              }
              <p className="Museum-name">{name}</p>
              <p className="Museum-subtitle">{city}</p>
            </a>
          </div>
      )
    });
  }

  render() {
    return (
      <div className="App">
          <h1> Museum Badges </h1>
          <div className="Museum-container">
            {this.getMuseumBadges()}
          </div>
      </div>
    );
  }
}

export default App;
