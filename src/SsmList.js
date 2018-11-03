import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class SsmList extends Component {

  constructor(props) {
    super(props);
    this.state = {ssms: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`/ssms`)
      .then(response => response.json())
      .then(data => this.setState({ssms: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/accounts/${accId}/ssms/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateSsm = [...this.state.ssms].filter(i => i.id !== id);
      this.setState({ssms: updateSsm});
    });
  }

  render() {
    const {ssms, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const ssmList = ssms.map(ssm => {
      
      const link = "/accounts/" + ssm.account.id; 

      return <tr key={ssm.id}>
        <td style={{whiteSpace: 'nowrap'}}>{ssm.id}</td>


        <td>{ssm.name}</td>
        <td>{ssm.text}</td>

        <td><a href={link}>{ssm.account.numAccount}</a></td>
		    
		


        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/ssms/" + ssm.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(ssm.account.id, ssm.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/ssms/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add SSM</Button>
          </div>
          
          <h3>SSM</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              
              <th width="5%">Description</th>
              <th width="5%">Account</th> 
              
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {ssmList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default SsmList;