import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class AccountList extends Component {

  constructor(props) {
    super(props);
    this.state = {accounts: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('accounts')
      .then(response => response.json())
      .then(data => this.setState({accounts: data, isLoading: false}));
  }

  async remove(triId, id) {
    await fetch(`/trigrammes/${triId}/accounts/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateAccount = [...this.state.accounts].filter(i => i.id !== id);
      this.setState({accounts: updateAccount});
    });
  }

  render() {
    const {accounts, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const accountList = accounts.map(account => {
      
      return <tr key={account.id}>
        <td style={{whiteSpace: 'nowrap'}}>{account.numAccount}</td>
		<td>{account.env}</td>
		<td>{account.trigramme.name}</td>
		<td>{account.text}</td>
		
		
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/accounts/" + account.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(account.trigramme.id, account.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/accounts/new">Add Account</Button>
          </div>
          <h3>Account</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">NumAccount</th>
              <th width="20%">Env</th>
              <th width="20%">Trigramme</th>
			  <th width="20%">Description</th>
			  <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {accountList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default AccountList;