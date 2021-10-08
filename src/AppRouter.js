import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// import Navbar from "react-bootstrap/Navbar";
// import Nav from "react-bootstrap/Nav";

import App from "./App";

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
          <Route path="/">
            <QuestionScreen />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
