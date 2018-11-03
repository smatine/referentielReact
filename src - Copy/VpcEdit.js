import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';

class VpcEdit extends Component {

  emptyItem = {
    name:'',
    text: '',
	  account: '',
  	accountId : '',
    cidrs: {},
    cidrId: '',
    touched: {
      accountId: false,
      cidrId: false
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
      const vpc = await (await fetch(`/vpcs/${this.props.match.params.id}`)).json();
      vpc.touched = {
        name: false,
        accountId: false,
        cidrId: false
      };
      
      this.setState({item: vpc});
      
    }
    else {
      const account = await (await fetch(`/accounts/${this.props.match.params.ida}`)).json();
      const vpc = {
        name:'',
        text: '',
        account: '',
        accountId : '',
        cidrs: {},
        cidrId: '',
        touched: {
          name: false,
          accountId: false,
          cidrId: false
        }
      };
      //console.log(account.id);
      vpc.account = account;
      vpc.touched = {
        name: false,
        accountId: false,
        cidrId: false,
      };
      this.setState({item: vpc});
    }

    const {item} = this.state;
    await fetch('/cidr/env/' + (item.account.env),)
    .then((result) => {
      // Get the result
      // If we want text, call result.text()
      return result.json();
    }).then((jsonResult) => {
      // Do something with the result
      
      let item = {...this.state.item};
      item.cidrs = jsonResult;
      this.setState({item: item});
      //console.log(item.cidrs.length);
      //console.log(jsonResult.length);
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
        accountId: true,
        cidrId: true,
    };
    const errors = this.validate(item.name, item.accountId, item.cidrId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) return;
    
    const hist= '/account/' + item.account.id + '/vpcs';


    item.cidr={id: item.cidrId};

    await fetch((item.id) ? '/accounts/' + (item.account.id) + '/vpcs/'+(item.id) : '/accounts/' + item.account.id + '/vpcs', {
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

  validate(name, accountId, cidrId) {

    const errors = {
      name: '',
      accountId: '',
      cidrId: ''
    };
    //console.log("cidr=" + cidrId + "=!");
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    else if(this.state.item.touched.cidrId && cidrId === ''){
      errors.cidrId = 'CidrId should not be null';
      alert('CidrId should not be null');
      return errors;
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    
    const title = <h2>{item.id ? 'Edit Vpc' : 'Add Vpc'}</h2>;


    const errors = this.validate(item.name, item.accountId, item.cidrId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = "/account/" + item.account.id + "/vpcs";

    let accs = null;
    accs = <FormGroup>
            <Label for="accountId">Account: {item.account.numAccount}</Label>
            <Input type="text" name="accountId" id="accountId" value={item.account.id || ''} disabled="true"/>
          </FormGroup>;

    let subs = null;
    if(item.id) subs = <Button size="sm" color="secondary" tag={Link} to={"/vpc/" + item.id + "/subnets"}>Subnets</Button>;

    
    //const cidrs = this.item.cidrs;
    let opts = [];
    if(item.cidrs && item.cidrs.length){
      /*const opList = */item.cidrs.map(cidr => {  
          opts.push(<option value={cidr.id}>{cidr.id} {cidr.cidr} {cidr.env}</option>);
      });
      //if(item.id) item.cidrId = item.cidr.id; value={item.cidrId || ''}
    }
    if(item.id) {
          opts.push(<option value={item.cidr.id} >{item.cidr.id} {item.cidr.cidr} {item.cidr.env}</option>);
    }
    
    let cid = item.cidrId || '';
    //if(item.id) cid = item.cidr.id;
    item.cidrId = cid;
    //console.log(item.cidrs.length + ' ' + opts);

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          
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
            <Label for="cidrId">CIDR (*)</Label>
            <Input type="select" name="cidrId" id="cidrId"  value={cid} onChange={this.handleChange} onBlur={this.handleBlur('cidrId')}
                 valid={errors.cidrId === ''}
                 invalid={errors.cidrId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.cidrId}</FormFeedback>
          </FormGroup>
          
  
		  
		  {accs}
		  
		  
		  
		  <FormGroup>
            <Label for="text">Description</Label>
            <Input type="text" name="text" id="text" value={item.text || ''}
                   onChange={this.handleChange} autoComplete="text"/>
          </FormGroup>
		  
          <FormGroup>
            <Button color="primary" type="submit" disabled={isDisabled}>Save</Button>{' '}
            <Button color="secondary" tag={Link} to={canc}>Cancel</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;{subs}
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(VpcEdit);