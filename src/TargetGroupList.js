import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class TargetGroupList extends Component {

  constructor(props) {
    super(props);
    this.state = {targetgroups: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`/targetGroups`)
      .then(response => response.json())
      .then(data => this.setState({targetgroups: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/vpcs/${accId}/targetGroups/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateTargetGroup = [...this.state.targetgroups].filter(i => i.id !== id);
      this.setState({targetgroups: updateTargetGroup});
    });
  }

  render() {
    const {targetgroups, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const targetgroupList = targetgroups.map(targetgroup => {
      
    const link = "/vpcs/" + targetgroup.vpc.id; 
    const isOverride= (targetgroup.ahportoverride)? 'Yes': 'No';      
    const listener = (targetgroup.listener) ? targetgroup.listener.id: '';
    const isListener = (targetgroup.listener) ? true : false;

      return <tr key={targetgroup.id}>
        <td style={{whiteSpace: 'nowrap'}}>{targetgroup.id}</td>
        <td>{targetgroup.name}</td>
        
        <td>{targetgroup.protocole}</td>
        <td>{targetgroup.port}</td>
        <td>{targetgroup.type}</td>
        <td>{targetgroup.hcprotocole}</td>
        <td>{targetgroup.hcpath}</td>
        <td>{isOverride}</td>
        <td>{targetgroup.ahport}</td>
        <td>{targetgroup.ahhealthythreshold}</td>
        <td>{targetgroup.ahuhealthythreshold}</td>
        <td>{targetgroup.ahtimeout}</td>
        <td>{targetgroup.ahtinterval}</td>
        <td>{targetgroup.ahsucesscode}</td>


        <td><a href={link}>{targetgroup.vpc.name}</a></td>
        <td>{listener}</td>
        <td>{targetgroup.text}</td>
		    
        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={"/targetgroup/" + targetgroup.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            <Button size="sm" color="secondary" tag={Link} to={"/targetgroup/" + targetgroup.id + "/targets" }>Targets</Button>&nbsp;&nbsp;
            <Button size="sm" color="primary" tag={Link} to={"/targetgroups/" + targetgroup.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(targetgroup.vpc.id, targetgroup.id)} disabled={isListener}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/targetgroups/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add TargetGroup</Button>
          </div>
          
          <h3>TargetGroup</h3>
          <Table className="mt-4">
            <thead>
            <tr>
    
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              
              <th width="5%">Protocole</th>
              <th width="5%">Port</th>
              <th width="5%">Type</th>
              <th width="5%">Protocole</th>
              <th width="5%">Path</th>
              <th width="5%">Portocole Override</th>
              <th width="5%">Port Override</th>
              <th width="5%">Healthy Threshold</th>
              <th width="5%">Unhealthy Threshold</th>
              <th width="5%">Timeout</th>
              <th width="5%">Interval</th>
              <th width="5%">Sucess Code</th>

              <th width="5%">Vpc</th> 
              <th width="5%">Listener</th> 
              <th width="5%">Description</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {targetgroupList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default TargetGroupList;