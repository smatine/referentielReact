import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class StorageList extends Component {

  constructor(props) {
    super(props);
    this.state = {storages: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`/storages`)
      .then(response => response.json())
      .then(data => this.setState({storages: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/accounts/${accId}/storages/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateStorage = [...this.state.storages].filter(i => i.id !== id);
      this.setState({storages: updateStorage});
    });
  }

  render() {
    const {storages, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const storageList = storages.map(storage => {
      
      const link = "/accounts/" + storage.account.id; 

      return <tr key={storage.id}>
        <td style={{whiteSpace: 'nowrap'}}>{storage.id}</td>


        <td>{storage.name}</td>
        <td>{storage.text}</td>

        <td><a href={link}>{storage.account.numAccount}</a></td>
		    
		


        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/storages/" + storage.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(storage.account.id, storage.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/storages/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add S3</Button>
          </div>
          
          <h3>S3</h3>
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
            {storageList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default StorageList;