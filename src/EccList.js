import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class EccList extends Component {

  constructor(props) {
    super(props);
    this.state = {eccs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});
    fetch(`/eccs`)
      .then(response => response.json())
      .then(data => this.setState({eccs: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`/eccs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateEcc = [...this.state.eccs].filter(i => i.id !== id);
      this.setState({eccs: updateEcc});
    });
  }

  render() {
    const {eccs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const eccList = eccs.map(ecc => {
      
    const link = "/vpcs/" + ecc.vpc.id; 
    const links = "/subnets/" + ecc.subnet.id; 
    /*
    let subnets = '';
    const eccSubnets = ecc.subnets.map(subnet => {
      subnets = subnets + '|' + subnet.id + ':' + subnet.name;
    })
    let sgs = '';
    const eccSgs = ecc.sgs.map(sg => {
      sgs = sgs + '|' + sg.id + ':' + sg.name;
    })
    */
    //autoAssignPublicIp shutdownBehaviour enableTerminationProtection encoded64 instanceType ami
    //monitoring useData useDataText

    const enableTerminationProtection = (ecc.enableTerminationProtection)? 'Yes': 'No';
    const encoded64 = (ecc.encoded64)? 'Yes': 'No';
    const userData = (ecc.userData)? 'Yes': 'No';
    const monitoring = (ecc.monitoring)? 'Yes': 'No';

      return <tr key={ecc.id}>
        <td style={{whiteSpace: 'nowrap'}}>{ecc.id}</td>

        <td>{ecc.ami.id}</td>
        <td>{ecc.instanceType.id}</td>
        <td>{ecc.autoAssignPublicIp}</td>
        <td>{ecc.shutdownBehaviour}</td>
        <td>{enableTerminationProtection}</td>
        <td>{monitoring}</td>
        <td>{userData}</td>
        <td>{encoded64}</td>
        <td>{ecc.userDataText}</td>
        <td><a href={link}>{ecc.vpc.name}</a></td>
        <td><a href={links}>{ecc.subnet.name}</a></td>

        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={"/ecc/" + ecc.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            <Button size="sm" color="secondary" tag={Link} to={"/ecc/" + ecc.id + "/sgs" }>Sg</Button>&nbsp;&nbsp;
            <Button size="sm" color="secondary" tag={Link} to={"/ecc/" + ecc.id + "/storages" }>Storages</Button>&nbsp;&nbsp;
            <Button size="sm" color="secondary" tag={Link} to={"/ecc/" + ecc.id + "/networkinterfaces" }>Network Interfaces</Button>&nbsp;&nbsp;

            <Button size="sm" color="primary" tag={Link} to={"/ecc/" + ecc.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(ecc.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/ecc/new`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Ecc</Button>
          </div>
          
          <h3>Ecc</h3>
          <Table className="mt-4">
            <thead>
            <tr>
    
              <th width="5%">Id</th>
              <th width="5%">Ami</th>
              <th width="5%">Instance Type</th>
              <th width="5%">Auto Assign Public Ip</th>
              <th width="5%">Shutdown Behaviour</th>
              <th width="5%">Enable Termination Protection</th>
              <th width="5%">Monitoring</th>
              <th width="5%">user Data</th>
              <th width="5%">Encoded64</th>
              <th width="5%">User Data Text</th>
              <th width="5%">Vpc</th>
              <th width="5%">Subnet</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {eccList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default EccList;