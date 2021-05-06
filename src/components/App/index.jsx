import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';

import Login from '../Login';

export default function App() {
  return (
    <Switch>
      <Route path="login">
        <Login />
      </Route>
      <Route path="*">
        <Redirect to="/login" />
      </Route>
    </Switch>
  )
}
