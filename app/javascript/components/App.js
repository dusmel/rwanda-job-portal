import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Home from './Home/home';
import Profile from './Profile/profile';
import Button from './button';
import store from '../store';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/profile/:type" component={Profile} />
          <Route exact path="/button" component={Button} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
