import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class RdsList extends Component {

  constructor(props) {
    super(props);
    this.state = {rdss: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`/rdss`)
      .then(response => response.json())
      .then(data => this.setState({rdss: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/vpcs/${accId}/rdss/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateRds = [...this.state.rdss].filter(i => i.id !== id);
      this.setState({rdss: updateRds});
    });
  }

  render() {
    const {rdss, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const rdsList = rdss.map(rds => {
      
      const link = "/vpcs/" + rds.vpc.id; 
      
      const sg = "/subnetgroups/" + rds.subnetgroup.id;

      return <tr key={rds.id}>
        <td style={{whiteSpace: 'nowrap'}}>{rds.id}</td>


        <td>{rds.name}</td>
        <td>{rds.text}</td>

        <td><a href={link}>{rds.vpc.name}</a></td>
		    
      <td><a href={sg}>{rds.subnetgroup.name}</a></td>
		


        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/rdss/" + rds.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(rds.vpc.id, rds.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/rdss/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Rds</Button>
          </div>
          
          <h3>Rds</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              
              <th width="5%">Description</th>
              <th width="5%">Vpc</th> 
              <th width="5%">Subnet Group</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {rdsList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default RdsList;