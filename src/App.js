import React from "react";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import Characters from "./Characters";
import "./App.css";
import Location from "./Location";
import Episode from "./Episode";

function App() {
  return (
    <Router>
      <div className="App">
        <Link to="/" className="Container__home">
          <p className="Home__text">H</p>
          <img className="Img__loc Home__text" src="/portal.png" alt="home" />
          <p className="Home__text">M</p>
          <p className="Home__text">E</p>
        </Link>
        <header className="App-header">
          <img src="/logo.png" className="App-logo" alt="logo" />
        </header>
        <Switch>
          <Route path="/location/:locationId" component={Location} />
          <Route path="/episode/:lastEpisodeId" component={Episode} />
          <Route path="/" component={Characters} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
