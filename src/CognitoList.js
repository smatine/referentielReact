import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class CognitoList extends Component {

  constructor(props) {
    super(props);
    this.state = {cognitos: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`/cognitos`)
      .then(response => response.json())
      .then(data => this.setState({cognitos: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/accounts/${accId}/cognitos/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateCognito = [...this.state.cognitos].filter(i => i.id !== id);
      this.setState({cognitos: updateCognito});
    });
  }

  render() {
    const {cognitos, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const cognitoList = cognitos.map(cognito => {
      
      const link = "/accounts/" + cognito.account.id; 

      return <tr key={cognito.id}>
        <td style={{whiteSpace: 'nowrap'}}>{cognito.id}</td>


        <td>{cognito.name}</td>
        <td>{cognito.text}</td>

        <td><a href={link}>{cognito.account.numAccount}</a></td>
		    
		


        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/cognitos/" + cognito.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(cognito.account.id, cognito.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/cognitos/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Cognito</Button>
          </div>
          
          <h3>Cognito</h3>
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
            {cognitoList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default CognitoList;