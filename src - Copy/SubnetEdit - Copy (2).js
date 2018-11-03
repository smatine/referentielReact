import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

class SubnetEdit extends Component {

  emptyItem = {
    subnetCidr: '',
    text: '',
	  
	  vpc: '',
  	vpcId : ''
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
      const subnet = await (await fetch(`/subnets/${this.props.match.params.id}`)).json();
      this.setState({item: subnet});
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

    if (!item.id) item.vpc = {};

    await fetch((item.id) ? '/vpcs/' + (item.vpc.id) + '/subnets/'+(item.id) : '/vpcs/' + item.vpcId + '/subnets', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/subnets');
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Subnet' : 'Add Subnet'}</h2>;
    
    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="subnetCidr">CIDR</Label>
            <Input type="text" name="subnetCidr" id="name" value={item.subnetCidr || ''}
                   onChange={this.handleChange} autoComplete="subnetCidr"/>
          </FormGroup>
          
          
  
		  
		  <FormGroup>
            <Label for="vpcId">Vpc</Label>
            <Input type="text" name="vpcId" id="vpcId" value={item.vpcId || ''}
                   onChange={this.handleChange} autoComplete="vpcId"/>
          </FormGroup>
		  
		  
		  
		  <FormGroup>
            <Label for="text">Description</Label>
            <Input type="text" name="text" id="text" value={item.text || ''}
                   onChange={this.handleChange} autoComplete="text"/>
          </FormGroup>
		  
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/subnets">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(SubnetEdit);