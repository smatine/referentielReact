import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';

const cidrRegex = require('cidr-regex');
class TagEdit extends Component {

  emptyItem = {
    key: '',
    value: '',
    text: '',
    nacl: {},
    touched: {
      key: false,
      value: false
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
      const tag = await (await fetch(`/tags/${this.props.match.params.id}`)).json();
      tag.touched = {
        key: false,
        value: false
      };
      this.setState({item: tag});
      
    }
    else {
      const nacl = await (await fetch(`/nacls/${this.props.match.params.idn}`)).json();
      const tag = {
        key: '',
        value: '',
        text: '',
        nacl: {},
        touched: {
          key: false,
          value: false
        }
      };
      tag.nacl = nacl;
      tag.touched = {
          key: false,
          value: false
      };
      this.setState({item: tag});
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
          key: true,
          value: true
    };
    const errors = this.validate(item.key, item.value);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    
    const hist= '/nacl/' + item.nacl.id +'/tags'; 

    item.nacl={id: item.nacl.id};
    
    //console.log("sma" + item.subnetgroupId);
    //return;

    await fetch((item.id) ? '/nacls/' + (item.nacl.id) + '/tags/'+(item.id) : '/nacls/' + item.nacl.id + '/tags', {
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

  validate(key, value) {

    const errors = {
      key: '',
      value: '',
      number: ''
    };
    //console.log('type' + type);
    if(this.state.item.touched.key && key.length === 0){
      errors.key = 'Key should not be null';
      return errors;
    } 
    else if(this.state.item.touched.value && value.length === 0){
      errors.value = 'Value should not be null';
      return errors;
    }
    
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit tag' : 'Add tag'}</h2>;

    const errors = this.validate(item.key, item.value);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = "/nacl/" + item.nacl.id + "/tags";

    let nacl = null;
    nacl = <FormGroup>
            <Label for="naclId">Nacl: {item.nacl.name}</Label>
            <Input type="text" name="naclId" id="naclId" value={item.nacl.id || ''} disabled="true"/>
          </FormGroup>;


    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="key">Key (*)</Label>
            <Input type="text" name="key" id="key" value={item.key || ''} placeholder="Enter key"
                   onChange={this.handleChange} onBlur={this.handleBlur('key')} autoComplete="key"
                   valid={errors.key === ''}
                   invalid={errors.key !== ''}
            />
           <FormFeedback>{errors.key}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="value">Value (*)</Label>
            <Input type="text" name="value" id="value" value={item.value || ''} placeholder="Enter value"
                   onChange={this.handleChange} onBlur={this.handleBlur('value')} autoComplete="value"
                   valid={errors.value === ''}
                   invalid={errors.value !== ''}
            />
           <FormFeedback>{errors.value}</FormFeedback>
          </FormGroup>

          {nacl}
        
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

export default withRouter(TagEdit);