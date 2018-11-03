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

    fetch(`/products/${this.props.match.params.id}/accounts`)
      .then(response => response.json())
      .then(data => this.setState({accounts: data, isLoading: false}));
  }

  async remove(triId, id) {
    await fetch(`/products/${triId}/accounts/${id}`, {
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

      const link = "/trigramme/" + account.product.trigramme.id + "/products/" + account.product.id;  

          
      return <tr key={account.id}>
        <td style={{whiteSpace: 'nowrap'}}>{account.id}</td>

        <td>{account.numAccount}</td>
		    <td>{account.env}</td>

        <td>{account.region}</td>
        <td>{account.mailList}</td>
        <td>{account.alias}</td>

		    <td><a href={link}>{account.product.name}</a></td>
		    <td>{account.text}</td>

        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={"/account/" + account.id + "/vpcs"}>Vpcs</Button>&nbsp;&nbsp;
          </ButtonGroup>
        </td>
		
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={/*"/trigramme/" + account.product.trigramme.id +*/ "/product/" + account.product.id +"/accounts/" + account.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(account.product.id, account.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/product/${this.props.match.params.id}/accounts/new`;
    const prd = `/trigramme/${this.props.match.params.idt}/products/`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Account</Button>
          </div>
          <h3>Account</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="5%">Id</th>
              <th width="5%">NumAccount</th>
              <th width="5%">Env</th> 

              <th width="5%">Region</th> 
              <th width="5%">Mail</th> 
              <th width="5%">Alias</th>
              <th width="5%">Product</th>
			        <th width="5%">Description</th>
              <th width="5%">Components</th>
			        <th width="5%">Actions</th>
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