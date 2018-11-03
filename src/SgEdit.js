import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';

class SgEdit extends Component {

  emptyItem = {
    name: '',
    nameTag: '',
    text: '',
	  vpc: {},
    vpcs: {},
  	vpcId : '',
    touched: {
      name: false,
      vpcId: false
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
      const sg = await (await fetch(`/sgs/${this.props.match.params.id}`)).json();
      sg.touched = {
        name: false,
        vpcId: false
      };
      this.setState({item: sg});
      
      
      let item = {...this.state.item};
      item.vpcId = sg.vpc.id;
      
      this.setState({item: item});
      
    }
    else {
      const sg = {
        name: '',
        nameTag: '',
        text: '',
        vpc: {},
        vpcs: {},
        vpcId : '',
        touched: {
          name: false,
          vpcId: false
        }
      };
      sg.touched = {
          name: false,
          vpcId: false
      };
      this.setState({item: sg});
    }

    await fetch('/vpcs',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.vpcs = jsonResult;
      this.setState({item: item});
    })

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
          name: true,
          vpcId: true
    };
    const errors = this.validate(item.name, item.vpcId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= '/sgs'; 

    item.vpc={id: item.vpcId};
    
    let lbs = [];
    if(item.lbs && item.lbs.length !== 0)
    {
      const sgLbs = item.lbs.map(lb => {
          lbs.push({id: lb.id});
      });
      item.lbs = lbs;
    }
    //return;

    await fetch((item.id) ? '/vpcs/' + (item.vpc.id) + '/sgs/'+(item.id) : '/vpcs/' + item.vpc.id + '/sgs', {
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

  validate(name, vpcId) {

    const errors = {
      name: '' ,
      vpcId: ''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    else if(this.state.item.touched.vpcId && vpcId.length === 0){
      errors.vpcId = 'Vpc should not be null';
      return errors;
    }
    
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit sg' : 'Add sg'}</h2>;

    const errors = this.validate(item.name, item.vpcId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = "/sgs";

    
    let opts = [];
    if(item.vpcs && item.vpcs.length){
      item.vpcs.map(s => {  
          opts.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let vpc = item.vpcId || '';
    item.vpcId = vpc;
    
    const isLb = (item.lbs && item.lbs.length !== 0) ? true : false;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>

          <FormGroup>
            <Label for="nameTag">Name tag (*)</Label>
            <Input type="text" name="nameTag" id="nameTag" value={item.nameTag || ''} placeholder="Enter nameTag"
                   onChange={this.handleChange} autoComplete="nameTag"
            />
          </FormGroup>

          <FormGroup>
            <Label for="name">Name (*)</Label>
            <Input type="text" name="name" id="name" value={item.name || ''} placeholder="Enter name"
                   onChange={this.handleChange} onBlur={this.handleBlur('name')} autoComplete="name"
                   valid={errors.name === ''}
                   invalid={errors.name !== ''}
            />
           <FormFeedback>{errors.name}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="vpcId">Vpcs (*)</Label>
            <Input type="select" name="vpcId" id="vpcId"  value={vpc} onChange={this.handleChange} onBlur={this.handleBlur('vpcId')} disabled={isLb}
                 valid={errors.vpcId === ''}
                 invalid={errors.vpcId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.vpcId}</FormFeedback>
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

export default withRouter(SgEdit);