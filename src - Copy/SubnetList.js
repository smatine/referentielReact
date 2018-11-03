import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class SubnetList extends Component {

  constructor(props) {
    super(props);
    this.state = {subnets: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`/vpcs/${this.props.match.params.id}/subnets`)
      .then(response => response.json())
      .then(data => this.setState({subnets: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/vpcs/${accId}/subnets/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateSubnet = [...this.state.subnets].filter(i => i.id !== id);
      this.setState({subnets: updateSubnet});
    });
  }

  render() {
    const {subnets, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const subnetList = subnets.map(subnet => {
      
      //const link = "/vpcs/" + subnet.vpc.id; // account/1000/vpcs/1000
      const link = "/account/" + subnet.vpc.account.id + "/vpcs/" +subnet.vpc.id; // account/1000/vpcs/1000
      const sub  = "/vpcmanages/" + subnet.sCidr.cidr.id +"/subnetmanage/" + subnet.sCidr.id;
      
      return <tr key={subnet.id}>
        <td style={{whiteSpace: 'nowrap'}}>{subnet.id}</td>

        <td>{subnet.name}</td>
		    <td><a href={sub}>{subnet.sCidr.id}:{subnet.sCidr.subnetCidr}</a></td>
         <td>{subnet.type}</td>
        <td><a href={link}>{subnet.vpc.id}:{subnet.vpc.name}</a></td>
		    <td>{subnet.text}</td>
		    
		
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/vpc/" + subnet.vpc.id + "/subnets/" + subnet.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(subnet.vpc.id, subnet.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

   const add = `/vpc/${this.props.match.params.id}/subnets/new`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Subnet</Button>
          </div>
          <h3>Subnet</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="5%">Id</th>
              <th width="20%">Name</th> 
              <th width="20%">subnetCidr</th> 
              <th width="5%">Type</th>
              <th width="20%">Vpc</th>
			        <th width="20%">Description</th>
            
			        <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {subnetList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default SubnetList;