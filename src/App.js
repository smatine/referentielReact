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

import SubnetGroupList from './SubnetGroupList';
import SubnetGroupEdit from './SubnetGroupEdit';

import CognitoList from './CognitoList';
import CognitoEdit from './CognitoEdit';
import DynamoDbList from './DynamoDbList';
import DynamoDbEdit from './DynamoDbEdit';
import SsmList from './SsmList';
import SsmEdit from './SsmEdit';
import StorageList from './StorageList';
import StorageEdit from './StorageEdit';
import RdsList from './RdsList';
import RdsEdit from './RdsEdit';
import EfsList from './EfsList';
import EfsEdit from './EfsEdit';
import ElasticSearchList from './ElasticSearchList';
import ElasticSearchEdit from './ElasticSearchEdit';
import ElasticCacheList from './ElasticCacheList';
import ElasticCacheEdit from './ElasticCacheEdit';

import NaclList from './NaclList';
import NaclEdit from './NaclEdit';
import RuleList from './RuleList';
import RuleEdit from './RuleEdit';
import TagList from './TagList';
import TagEdit from './TagEdit';


import RouteTableList from './RouteTableList';
import RouteTableEdit from './RouteTableEdit';
import RouteList from './RouteList';
import RouteEdit from './RouteEdit';
import TagRouteTableList from './TagRouteTableList';
import TagRouteTableEdit from './TagRouteTableEdit';



import TargetGroupList from './TargetGroupList';
import TargetGroupEdit from './TargetGroupEdit';
import TargetList from './TargetList';
import TargetEdit from './TargetEdit';
import TagTargetGroupList from './TagTargetGroupList';
import TagTargetGroupEdit from './TagTargetGroupEdit';

import LbList from './LbList';
import LbEdit from './LbEdit';
import ListenerList from './ListenerList';
import ListenerEdit from './ListenerEdit';
import TagLbList from './TagLbList';
import TagLbEdit from './TagLbEdit';

import PeeringList from './PeeringList';
import PeeringEdit from './PeeringEdit';
import TagPeeringList from './TagPeeringList';
import TagPeeringEdit from './TagPeeringEdit';

import SgList from './SgList';
import SgEdit from './SgEdit';
import RuleSgList from './RuleSgList';
import RuleSgEdit from './RuleSgEdit';
import TagSgList from './TagSgList';
import TagSgEdit from './TagSgEdit';

import VpcManageList from './VpcManageList';
import VpcManageEdit from './VpcManageEdit';
import SubnetManageList from './SubnetManageList';
import SubnetManageEdit from './SubnetManageEdit';

import RegionList from './RegionList';
import RegionEdit from './RegionEdit';
import AzList from './AzList';
import AzEdit from './AzEdit';
import AmiList from './AmiList';
import AmiEdit from './AmiEdit';

import InstanceTypeList from './InstanceTypeList';
import InstanceTypeEdit from './InstanceTypeEdit';

import EccList from './EccList';
import EccEdit from './EccEdit';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>

          <Route path='/regions' exact={true} component={RegionList}/>
          <Route path='/regions/:id' component={RegionEdit}/>
          <Route path='/region/:id/azs' exact={true} component={AzList}/>
          <Route path='/region/:idr/azs/:id' component={AzEdit}/>
          <Route path='/region/:id/amis' exact={true} component={AmiList}/>
          <Route path='/region/:idr/amis/:id' component={AmiEdit}/>

          <Route path='/instancetypes' exact={true} component={InstanceTypeList}/>
          <Route path='/instancetypes/:id' component={InstanceTypeEdit}/>

          <Route path='/eccs' exact={true} component={EccList}/>
          <Route path='/ecc/:id' component={EccEdit}/>

          <Route path='/trigrammes' exact={true} component={TrigrammeList}/>
		<Route path='/trigrammes/:id' component={TrigrammeEdit}/>

          <Route path='/products' exact={true} component={ProductList}/>
          <Route path='/products/:id' component={ProductEdit}/>
          <Route path='/trigramme/:id/products' exact={true} component={ProductList}/>
          <Route path='/trigramme/:idt/products/:id' component={ProductEdit}/>

          <Route path='/accounts' exact={true} component={AccountList}/>
          <Route path='/accounts/:id' component={AccountEdit}/>
          <Route path='/product/:id/accounts' exact={true} component={AccountList}/>
          <Route path='/product/:idp/accounts/:id' component={AccountEdit}/>

          <Route path='/vpcs' exact={true} component={VpcList}/>
          <Route path='/vpcs/:id' component={VpcEdit}/>
          <Route path='/account/:id/vpcs' exact={true} component={VpcList}/>
          <Route path='/account/:ida/vpcs/:id' component={VpcEdit}/>
          
          <Route path='/subnets' exact={true} component={SubnetList}/>
          <Route path='/subnets/:id' component={SubnetEdit}/>
          <Route path='/vpc/:id/subnets' exact={true} component={SubnetList}/>
          <Route path='/vpc/:idv/subnets/:id' component={SubnetEdit}/>


          <Route path='/subnetGroups' exact={true} component={SubnetGroupList}/>
          <Route path='/subnetGroups/:id' component={SubnetGroupEdit}/>

          <Route path='/storages' exact={true} component={StorageList}/>
          <Route path='/storages/:id' component={StorageEdit}/>


          <Route path='/ssms' exact={true} component={SsmList}/>
          <Route path='/ssms/:id' component={SsmEdit}/>

          <Route path='/cognitos' exact={true} component={CognitoList}/>
          <Route path='/cognitos/:id' component={CognitoEdit}/>

          <Route path='/dynamoDbs' exact={true} component={DynamoDbList}/>
          <Route path='/dynamoDbs/:id' component={DynamoDbEdit}/>

          <Route path='/rdss' exact={true} component={RdsList}/>
          <Route path='/rdss/:id' component={RdsEdit}/>

          <Route path='/efss' exact={true} component={EfsList}/>
          <Route path='/efss/:id' component={EfsEdit}/>

          <Route path='/elasticSearchs' exact={true} component={ElasticSearchList}/>
          <Route path='/elasticSearchs/:id' component={ElasticSearchEdit}/>

          <Route path='/elasticCaches' exact={true} component={ElasticCacheList}/>
          <Route path='/elasticCaches/:id' component={ElasticCacheEdit}/>

          <Route path='/nacls' exact={true} component={NaclList}/>
          <Route path='/nacls/:id' component={NaclEdit}/>
          <Route path='/nacl/:id/rules' exact={true} component={RuleList}/>
          <Route path='/nacl/:idn/rules/:id' component={RuleEdit}/>
          <Route path='/nacl/:id/tags' exact={true} component={TagList}/>
          <Route path='/nacl/:idn/tags/:id' component={TagEdit}/>


          <Route path='/routetables' exact={true} component={RouteTableList}/>
          <Route path='/routetables/:id' component={RouteTableEdit}/>
          <Route path='/routetable/:id/routes' exact={true} component={RouteList}/>
          <Route path='/routetable/:idr/routes/:id' component={RouteEdit}/>
          <Route path='/routetable/:id/tags' exact={true} component={TagRouteTableList}/>
          <Route path='/routetable/:idr/tags/:id' component={TagRouteTableEdit}/>


          <Route path='/targetgroups' exact={true} component={TargetGroupList}/>
          <Route path='/targetgroups/:id' component={TargetGroupEdit}/>
          <Route path='/targetgroup/:id/targets' exact={true} component={TargetList}/>
          <Route path='/targetgroup/:idt/targets/:id' component={TargetEdit}/>
          <Route path='/targetgroup/:id/tags' exact={true} component={TagTargetGroupList}/>
          <Route path='/targetgroup/:idr/tags/:id' component={TagTargetGroupEdit}/>

          <Route path='/lbs' exact={true} component={LbList}/>
          <Route path='/lbs/:id' component={LbEdit}/>
          <Route path='/lb/:id/listeners' exact={true} component={ListenerList}/>
          <Route path='/lb/:idl/listeners/:id' component={ListenerEdit}/>
          <Route path='/lb/:id/tags' exact={true} component={TagLbList}/>
          <Route path='/lb/:idl/tags/:id' component={TagLbEdit}/>

          <Route path='/peerings' exact={true} component={PeeringList}/>
          <Route path='/peerings/:id' component={PeeringEdit}/>
          <Route path='/peering/:id/tags' exact={true} component={TagPeeringList}/>
          <Route path='/peering/:idp/tags/:id' component={TagPeeringEdit}/>

          <Route path='/sgs' exact={true} component={SgList}/>
          <Route path='/sgs/:id' component={SgEdit}/>
          <Route path='/sg/:id/ruleSgs' exact={true} component={RuleSgList}/>
          <Route path='/sg/:ids/ruleSgs/:id' component={RuleSgEdit}/>
          <Route path='/sg/:id/tags' exact={true} component={TagSgList}/>
          <Route path='/sg/:ids/tags/:id' component={TagSgEdit}/>



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