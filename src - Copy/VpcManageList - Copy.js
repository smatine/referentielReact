import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

let order = 'desc';
class VpcManageList extends Component {

  constructor(props) {
    super(props);
    this.state = {cidrs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('/cidrs')
      .then(response => response.json())
      .then(data => this.setState({cidrs: data, isLoading: false}));

  }

  async remove(id) {
    await fetch(`/cidrs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateCidr = [...this.state.cidrs].filter(i => i.id !== id);
      this.setState({cidrs: updateCidr});
    });
  }


  render() {
    const {cidrs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const cidrList = cidrs.map(cidr => {
      
      let vpc = '';
      if(cidr.vpc) vpc='/account/' + cidr.vpc.account.id + '/vpcs/' + cidr.vpc.id; 
      let vpcc = '';
      if(cidr.vpc) vpcc = "[Vpc:" + cidr.vpc.id + " Acc:" + cidr.vpc.account.numAccount + " Prd:" + cidr.vpc.account.product.name  + " Tri:" + cidr.vpc.account.product.trigramme.name +"]";

      let isDisabled = false;
      if(cidr.vpc) isDisabled=true;

      return <tr key={cidr.id}>
        <td style={{whiteSpace: 'nowrap'}}>{cidr.id}</td>

		    <td>{cidr.cidr}</td>
        <td>{cidr.env}</td>
		    <td>{cidr.text}</td>
        <td><a href={vpc}>{vpcc}</a></td>
		
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/vpcmanage/" + cidr.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(cidr.id)}  disabled={isDisabled}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/vpcmanage/new">Add Cidr</Button>
          </div>
          <h3>Cidr</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="5%">Id</th> 
              <th width="5%">Cidr</th> 
              <th width="5%">Env</th>
			        <th width="5%">Description</th>
              <th width="5%">Vpc</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {cidrList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
    
  }
}

export default VpcManageList;