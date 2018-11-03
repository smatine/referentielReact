import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';

const cidrRegex = require('cidr-regex');
class TargetEdit extends Component {

  emptyItem = {
    ec2: '',
    port: '',
    targetGroup: {},
    touched: {
      ec2: false,
      port: false
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
      const target = await (await fetch(`/targets/${this.props.match.params.id}`)).json();
      target.touched = {
        ec2: false,
        port: false
      };
      this.setState({item: target});
      
    }
    else {
      const targetGroup = await (await fetch(`/targetGroups/${this.props.match.params.idt}`)).json();
      const target = {
          ec2: '',
          port: '',
          targetGroup: {},
          touched: {
            ec2: false,
            port: false
          }
      };
      target.targetGroup = targetGroup;
      target.touched = {
          ec2: false,
          port: false
      };
      this.setState({item: target});
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

    item.touched = {
          ec2: true,
          port: true
    };
    const errors = this.validate(item.ec2, item.port);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
     item.port = Number(item.port);
    //console.log("port" + item.port);
    //return;
    const hist= '/targetgroup/' + item.targetGroup.id +'/targets'; 

    item.targetGroup={id: item.targetGroup.id};
    

    await fetch((item.id) ? '/targetGroups/' + (item.targetGroup.id) + '/targets/'+(item.id) : '/targetGroups/' + (item.targetGroup.id) + '/targets', {
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

  validate(ec2, port) {

    const errors = {
      ec2: '',
      port:''
    };
    //console.log('type' + type);
    if(this.state.item.touched.ec2 && ec2.length === 0){
      errors.ec2 = 'ec2 should not be null';
      return errors;
    } 
    if(this.state.item.touched.port && port.length === 0){
      errors.port = 'port should not be null';
      return errors;
    } 
    
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit target' : 'Add target'}</h2>;

    const errors = this.validate(item.ec2, item.port);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = "/targetgroup/" + item.targetGroup.id + "/targets";

    const prop = item.propagation;

    let targetgroup = null;
    targetgroup = <FormGroup>
            <Label for="targetgroupId">Target Group: {item.targetGroup.name}</Label>
            <Input type="text" name="targetgroupId" id="targetgroupId" value={item.targetGroup.id || ''} disabled="true"/>
          </FormGroup>;


    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>

          {targetgroup}
          <FormGroup>
            <Label for="ec2">Ec2 (*)</Label>
            <Input type="text" name="ec2" id="ec2" value={item.ec2 || ''} placeholder="Enter ec2"
                   onChange={this.handleChange} onBlur={this.handleBlur('ec2')} autoComplete="ec2"
                   valid={errors.ec2 === ''}
                   invalid={errors.ec2 !== ''}
            />
           <FormFeedback>{errors.ec2}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="port">Port (*)</Label>
            <Input type="number" name="port" id="port" value={item.port || ''} placeholder="Enter port"
                   onChange={this.handleChange} onBlur={this.handleBlur('port')} autoComplete="port"
                   valid={errors.port === ''}
                   invalid={errors.port !== ''}
            />
           <FormFeedback>{errors.port}</FormFeedback>
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

export default withRouter(TargetEdit);