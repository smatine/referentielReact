import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

class ProductEdit extends Component {

  emptyItem = {
    name: '',
    text: '',
	  appContext: '',
	  account: '',
  	accountId : ''
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
      const product = await (await fetch(`/products/${this.props.match.params.id}`)).json();
      this.setState({item: product});
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

    if (!item.id) item.account = {};

    await fetch((item.id) ? '/accounts/' + (item.account.id) + '/products/'+(item.id) : '/accounts/' + item.accountId + '/products', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/products');
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Product' : 'Add Product'}</h2>;
    
    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" value={item.name || ''}
                   onChange={this.handleChange} autoComplete="name"/>
          </FormGroup>
          
          <FormGroup>
            <Label for="appContext">APP Context</Label>
            <Input type="text" name="appContext" id="appContext" value={item.appContext || ''}
                   onChange={this.handleChange} autoComplete="appContext"/>
          </FormGroup>

  
		  
		  <FormGroup>
            <Label for="acc">Account</Label>
            <Input type="text" name="accountId" id="accountId" value={item.accountId || ''}
                   onChange={this.handleChange} autoComplete="accountId"/>
          </FormGroup>
		  
		  
		  
		  <FormGroup>
            <Label for="text">Description</Label>
            <Input type="text" name="text" id="text" value={item.text || ''}
                   onChange={this.handleChange} autoComplete="text"/>
          </FormGroup>
		  
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/products">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(ProductEdit);