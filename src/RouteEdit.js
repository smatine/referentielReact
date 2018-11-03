import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';

const cidrRegex = require('cidr-regex');
class RouteEdit extends Component {

  emptyItem = {
    destination: '',
    propagation:'',
    text: '',
    target:'',
    routeTable: {},
    touched: {
      destination: false,
      propagation: false,
      target: false
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const route = await (await fetch(`/routes/${this.props.match.params.id}`)).json();
      route.touched = {
        destination: false,
        propagation: false,
        target: false
      };
      this.setState({item: route});
      
    }
    else {
      const routeTable = await (await fetch(`/routeTables/${this.props.match.params.idr}`)).json();
      const route = {
        destination: '',
        propagation:'',
        text: '',
        target: '',
        routeTable: {},
        touched: {
          destination: false,
          propagation: false,
          target: false
        }
      };
      route.routeTable = routeTable;
      route.touched = {
          destination: false,
          propagation: false,
          target: false
      };
      this.setState({item: route});
    }


  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});

    if(name === 'propagation')
    {
      if(value === 'prop'){
       //prop
        item.propagation = true;
      }
      else
      {
        //noprop
        item.propagation = false;
      }
    }

  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
          destination: true,
          propagation: true,
          target: true
    };
    const errors = this.validate(item.destination, item.propgation, item.target);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    
    const hist= '/routetable/' + item.routeTable.id +'/routes'; 

    item.routeTable={id: item.routeTable.id};
    
    //console.log("sma" + item.subnetgroupId);
    //return;

    await fetch((item.id) ? '/routetables/' + (item.routeTable.id) + '/routes/'+(item.id) : '/routetables/' + item.routeTable.id + '/routes', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push(hist);
  }

  handleBlur = (field) => (evt) => {

    let item = {...this.state.item};
    item.touched= { ...this.state.item.touched, [field]: true};
    this.setState({item});

  }

  validate(destination, propgation, target) {

    const errors = {
      destination: '',
      propgation: '',
      target:''
    };
    //console.log('type' + type);
    if(this.state.item.touched.destination && destination.length === 0){
      errors.destination = 'Destination should not be null';
      return errors;
    } 
    if(this.state.item.touched.target && target.length === 0){
      errors.target = 'Target should not be null';
      return errors;
    } 
    else if(this.state.item.touched.propgation && propgation.length === 0){
      errors.propgation = 'Propgation should not be null';
      return errors;
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit route' : 'Add route'}</h2>;

    const errors = this.validate(item.destination, item.propgation, item.target);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = "/routetable/" + item.routeTable.id + "/routes";

    const prop = item.propagation;

    let routetable = null;
    routetable = <FormGroup>
            <Label for="routetableId">Nacl: {item.routeTable.name}</Label>
            <Input type="text" name="routetableId" id="routetableId" value={item.routeTable.id || ''} disabled="true"/>
          </FormGroup>;


    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>

          {routetable}
          <FormGroup>
            <Label for="destination">Destination (*)</Label>
            <Input type="text" name="destination" id="destination" value={item.destination || ''} placeholder="Enter destination"
                   onChange={this.handleChange} onBlur={this.handleBlur('destination')} autoComplete="destination"
                   valid={errors.destination === ''}
                   invalid={errors.destination !== ''}
            />
           <FormFeedback>{errors.destination}</FormFeedback>
          </FormGroup>


          <FormGroup>
            <Label for="target">Target (*): A modifier pour prendre en compte peering endpoint local ...</Label>
            <Input type="text" name="target" id="target" value={item.target || ''} placeholder="Enter target"
                   onChange={this.handleChange} onBlur={this.handleBlur('target')} autoComplete="target"
                   valid={errors.target === ''}
                   invalid={errors.target !== ''}
            />
           <FormFeedback>{errors.target}</FormFeedback>
          </FormGroup>

          <FormGroup tag="fieldset">
            <Label for="propagation">Propagated (*)</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="propagation" id="propagation" value="prop" checked={prop === true}
                       onChange={this.handleChange} onBlur={this.handleBlur('propagation')} autoComplete="propagation"
                       valid={errors.propagation === ''}
                       invalid={errors.propagation !== ''}
                />{' '}
                Yes
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="propagation" id="propagation" value="noprop" checked={prop === false}
                       onChange={this.handleChange} onBlur={this.handleBlur('propagation')} autoComplete="propagation"
                       valid={errors.propagation === ''}
                       invalid={errors.propagation !== ''}
                />{' '}
                No
              </Label>
            </FormGroup>
            <FormFeedback>{errors.accessType}</FormFeedback>
          </FormGroup>

          <FormGroup>

            <Label for="text">Description</Label>
            <Input type="text" name="text" id="text" value={item.text || ''}
                   onChange={this.handleChange} autoComplete="text"/>
          </FormGroup>


          <FormGroup>
            <Button color="primary" type="submit" disabled={isDisabled}>Save</Button>{' '}
            <Button color="secondary" tag={Link} to={canc}>Cancel</Button>

            

          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(RouteEdit);