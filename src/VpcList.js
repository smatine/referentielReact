import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class VpcList extends Component {

  constructor(props) {
    super(props);
    this.state = {vpcs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`/vpcs`)
      .then(response => response.json())
      .then(data => this.setState({vpcs: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/accounts/${accId}/vpcs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateVpc = [...this.state.vpcs].filter(i => i.id !== id);
      this.setState({vpcs: updateVpc});
    });
  }

  render() {
    const {vpcs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const vpcList = vpcs.map(vpc => {
      
      const link = "/accounts/" + vpc.account.id; 
      
      let cidr = '';
      cidr = "[Id:" + vpc.cidr.id + " Cidr:" + vpc.cidr.cidr + " Env:" + vpc.cidr.env + "]";
      let cid ='';
      cid = '/vpcmanage/' + vpc.cidr.id;
      return <tr key={vpc.id}>
        <td style={{whiteSpace: 'nowrap'}}>{vpc.id}</td>

		    <td>{vpc.name}</td>
        <td><a href={cid}>{cidr}</a></td>
        <td><a href={link}>{vpc.account.numAccount}: {vpc.account.env}</a></td>
		    <td>{vpc.text}</td>
		
       

        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/vpcs/" + vpc.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(vpc.account.id, vpc.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

   const add = `/vpcs/new`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Vpc</Button>
          </div>
          <h3>Vpc</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Id</th> 
              <th width="20%">Name</th>
              <th width="20%">Cidr</th>
              <th width="20%">Account</th>

			        <th width="20%">Description</th>
              
			        <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {vpcList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default VpcList;