import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

class AccountEdit extends Component {

  emptyItem = {
    numaccount: '',
    text: '',
	env: '',
	trigramme: '',
	trigrammeId : ''
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const account = await (await fetch(`/accounts/${this.props.match.params.id}`)).json();
      this.setState({item: account});
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    
    await fetch((item.id) ? '/trigrammes/' + (item.trigramme.id) + '/accounts/'+(item.id) : '/trigrammes/{item.trigrammeId}/accounts', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/accounts');
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Account' : 'Add Account'}</h2>;
    
    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="numAccount">NumAccount</Label>
            <Input type="text" name="numAccount" id="numAccount" value={item.numAccount || ''}
                   onChange={this.handleChange} autoComplete="numAccount"/>
          </FormGroup>
          
          <FormGroup>
            <Label for="env">Env</Label>
            <Input type="text" name="env" id="env" value={item.env || ''}
                   onChange={this.handleChange} autoComplete="env"/>
          </FormGroup>
		  
		  <FormGroup>
            <Label for="tri">Trigramme</Label>
            <Input type="text" name="trigrammeId" id="trigrammeId" value={item.trigrammeId || ''}
                   onChange={this.handleChange} autoComplete="trigrammeId"/>
          </FormGroup>
		  
		  <FormGroup>
            <Label for="tri2">Trigramme Name: {item.trigramme.name}</Label>
          </FormGroup>
		  
		  <FormGroup>
            <Label for="text">Description</Label>
            <Input type="text" name="text" id="text" value={item.text || ''}
                   onChange={this.handleChange} autoComplete="text"/>
          </FormGroup>
		  
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/accounts">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(AccountEdit);