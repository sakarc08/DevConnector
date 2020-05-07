import React, { Fragment, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/profile-forms/CreateProfile'
import Register from './components/auth/Register';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'
import './App.css';
import EditProfile from './components/profile-forms/EditProfile';

if(localStorage.token) setAuthToken(localStorage.token)

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
  <Provider store={store}>
    <BrowserRouter>
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing}/>
      <section className="container">
        <Alert />
        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          <PrivateRoute exact path='/create-profile' component={CreateProfile} />
          <PrivateRoute exact path='/edit-profile' component={EditProfile} />
        </Switch>
      </section>
    </Fragment>
  </BrowserRouter>
  </Provider>
)
}

export default App;
