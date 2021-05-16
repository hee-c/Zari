import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Room from '../../pages/Room';
import WaitingArea from '../../pages/WaitingArea';
import Home from '../../pages/Home';
import { imageLoader } from '../../pixi';

export default function App() {
  useEffect(() => {
    imageLoader();
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/waitingarea">
          <WaitingArea />
        </Route>
        <Route path="/room/:roomId">
          <Room />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  )
}
