import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import Navbar from 'react-bootstrap/Navbar';

import App from "./App";
import ProfileScreen from "./ProfileScreen";
import QuestionScreen from "./QuestionScreen";

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currPage: "/",
    };
  }

  route(path) {
    return this.setState({ currPage: path });
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={QuestionScreen} />
          <Route path="/profile/:id" component={ProfileScreen} />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
