import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TrigrammeList from './TrigrammeList';
import TrigrammeEdit from './TrigrammeEdit';
import AccountList from './AccountList';
import AccountEdit from './AccountEdit';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/trigrammes' exact={true} component={TrigrammeList}/>
		  <Route path='/trigrammes/:id' component={TrigrammeEdit}/>
		  
		  <Route path='/accounts' exact={true} component={AccountList}/>
		  <Route path='/accounts/:id' component={AccountEdit}/>
        </Switch>
      </Router>
    )
  }
}

export default App;