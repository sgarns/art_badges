import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import App from "./App";
import EventsScreen from "./EventsScreen";
import MuseumBadgeOps from "./MuseumBadgeOps";
import ProfileScreen from "./ProfileScreen";
import QuestionScreen from "./QuestionScreen";

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.museumBadgeOps = new MuseumBadgeOps();
    this.state = {
      currPage: "/",
      userId: "",
    };
  }

  async componentDidMount() {
    const userId = await this.museumBadgeOps.signIn();
    this.setState({
      userId: userId,
    });
  }

  route(path) {
    return this.setState({ currPage: path });
  }

  render() {
    return (
      <Router>
      <Navbar expand="lg">
        <Navbar.Brand href='/'>
          Art Badges
        </Navbar.Brand>
        <Nav className="mr-auto" navbar>
          <Nav.Link href={`/profile/${this.state.userId}`}>Profile</Nav.Link>
          <Nav.Link href="/events">Events</Nav.Link>
        </Nav>
      </Navbar>
        <Switch>
          <Route path="/" exact component={QuestionScreen} />
          <Route path="/profile/:id" component={ProfileScreen} />
          <Route path="/events" component={EventsScreen} />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
