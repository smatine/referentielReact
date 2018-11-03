import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class EfsList extends Component {

  constructor(props) {
    super(props);
    this.state = {efss: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`/efss`)
      .then(response => response.json())
      .then(data => this.setState({efss: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/vpcs/${accId}/efss/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateEfs = [...this.state.efss].filter(i => i.id !== id);
      this.setState({efss: updateEfs});
    });
  }

  render() {
    const {efss, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const efsList = efss.map(efs => {
      
      const link = "/vpcs/" + efs.vpc.id; 
      
      const sg = "/subnetgroups/" + efs.subnetgroup.id;

      return <tr key={efs.id}>
        <td style={{whiteSpace: 'nowrap'}}>{efs.id}</td>


        <td>{efs.name}</td>
        <td>{efs.text}</td>

        <td><a href={link}>{efs.vpc.name}</a></td>
        
      <td><a href={sg}>{efs.subnetgroup.name}</a></td>
    


        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/efss/" + efs.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(efs.vpc.id, efs.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/efss/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Efs</Button>
          </div>
          
          <h3>Efs</h3>
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
            {efsList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default EfsList;