import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Home from '../Home';
import WaitingArea from '../WaitingArea';
import Room from '../Room';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/waitingarea">
          <WaitingArea />
        </Route>
        <Route path="/room">
          <Room />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  )
}
