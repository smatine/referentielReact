import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TrigrammeList from './TrigrammeList';
import TrigrammeEdit from './TrigrammeEdit';
import AccountList from './AccountList';
import AccountEdit from './AccountEdit';
import ProductList from './ProductList';
import ProductEdit from './ProductEdit';
import VpcList from './VpcList';
import VpcEdit from './VpcEdit';
import SubnetList from './SubnetList';
import SubnetEdit from './SubnetEdit';

import VpcManageList from './VpcManageList';
import VpcManageEdit from './VpcManageEdit';

import SubnetManageList from './SubnetManageList';
import SubnetManageEdit from './SubnetManageEdit';



class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>

          <Route path='/trigrammes' exact={true} component={TrigrammeList}/>
		      <Route path='/trigrammes/:id' component={TrigrammeEdit}/>

          <Route path='/trigramme/:id/products' exact={true} component={ProductList}/>
          <Route path='/trigramme/:idt/products/:id' component={ProductEdit}/>

          <Route path='/product/:id/accounts' exact={true} component={AccountList}/>
          <Route path='/product/:idp/accounts/:id' component={AccountEdit}/>

          <Route path='/account/:id/vpcs' exact={true} component={VpcList}/>
          <Route path='/account/:ida/vpcs/:id' component={VpcEdit}/>
          
          <Route path='/vpc/:id/subnets' exact={true} component={SubnetList}/>
          <Route path='/vpc/:idv/subnets/:id' component={SubnetEdit}/>


          <Route path='/vpcmanage' exact={true} component={VpcManageList}/>
          <Route path='/vpcmanage/:id' component={VpcManageEdit}/>


          <Route path='/vpcmanages/:id/subnetmanage' exact={true} component={SubnetManageList}/>
          <Route path='/vpcmanages/:idc/subnetmanage/:id' component={SubnetManageEdit}/>


        </Switch>
      </Router>
    )
  }
}

export default App;