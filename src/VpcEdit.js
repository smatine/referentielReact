import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';

class VpcEdit extends Component {

  emptyItem = {
    name:'',
    text: '',
	  account: {},
    accounts: {},
  	accountId : '',
    cidrs: {},
    cidrId: '',
    isSameEnv: true,
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
      
      let item = {...this.state.item};


      await await(fetch('/cidr/env/' + (vpc.account.env),)
        .then((result) => {
          //console.log('change2');
          return result.json();
        }).then((jsonResult) => {
          //let item = {...this.state.item};
          item.cidrs = jsonResult;
          this.setState({item: item});
        }));


      item.isSameEnv = true;
      item.accountId = vpc.account.id;
      item.cidrId = vpc.cidr.id;
      this.setState({item: item});
      
    }
    else {
      //const account = await (await fetch(`/accounts/${this.props.match.params.ida}`)).json();
      const vpc = {
        name:'',
        text: '',
        account: {},
        accounts: {},
        accountId : '',
        cidrs: {},
        cidrId: '',
        isSameEnv: true,
        touched: {
          name: false,
          accountId: false,
          cidrId: false
        }
      };
      //console.log(account.id);
      //vpc.account = account;
      vpc.touched = {
        name: false,
        accountId: false,
        cidrId: false,
      };
      this.setState({item: vpc});
    }

        
    //const {item} = this.state;
    await fetch('/accounts',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      
      let item = {...this.state.item};
      //item.isSameEnv = true;
      item.accounts = jsonResult;
      this.setState({item: item});
    })
    
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;

    //console.log('change=' + name);
    item.isSameEnv = true;
    if(name === 'accountId')
    {
      //console.log('change' + item.accountId);
      
      let acc={};
      fetch("/accounts/" + item.accountId,)
      .then((result) => {
        //console.log('change1');
        return result.json();
      }).then((jsonResult) => {
        acc = jsonResult;
        
        if(acc.env !== item.account.env) item.isSameEnv = false;//console.log("attention="  + acc.env + " " + item.account.env);

        fetch('/cidr/env/' + (acc.env),)
        .then((result) => {
          //console.log('change2');
          return result.json();
        }).then((jsonResult) => {
          //let item = {...this.state.item};
          item.cidrs = jsonResult;
          this.setState({item: item});
        });

      });

    }


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
    
    const hist= '/vpcs';
    
    item.cidr={id: item.cidrId};

    item.account={id: item.accountId};

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
      //alert('CidrId should not be null');
      return errors;
    }
    else if(this.state.item.touched.accountId && accountId.length === 0){
      errors.accountId = 'Account should not be null';
      return errors;
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    
    const title = <h2>{item.id ? 'Edit Vpc' : 'Add Vpc'}</h2>;


    const errors = this.validate(item.name, item.accountId, item.cidrId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = "/vpcs";

    /*let accs = null;
    accs = <FormGroup>
            <Label for="accountId">Account: {item.account.numAccount}</Label>
            <Input type="text" name="accountId" id="accountId" value={item.account.id || ''} disabled="true"/>
          </FormGroup>;*/

    /*let subs = null;
    if(item.id) subs = <Button size="sm" color="secondary" tag={Link} to={"/vpc/" + item.id + "/subnets"}>Subnets</Button>;*/

    let opts = [];
    if(item.cidrs && item.cidrs.length){
          item.cidrs.map(cidr => {  
          opts.push(<option value={cidr.id}>{cidr.id} {cidr.cidr} {cidr.env}</option>);
      });
    }

    if(item.id && item.isSameEnv) {
          opts.push(<option value={item.cidr.id} >{item.cidr.id} {item.cidr.cidr} {item.cidr.env}</option>);
    }
    
    let cid = item.cidrId || '';
    item.cidrId = cid;

    
    let optsa = [];
    if(item.accounts && item.accounts.length){
          item.accounts.map(s => {  
          optsa.push(<option value={s.id}>{s.id} {s.numAccount}  {s.env}</option>);
      });
    }
    if(item.id) {
          //optsa.push(<option value={item.account.id} >{item.account.id} {item.account.numAccount} </option>);
    }

    let acc = item.accountId || '';
    item.accounttId = acc;



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
            <Label for="accountId">Accounts (*)</Label>
            <Input type="select" name="accountId" id="accountId"  value={acc} onChange={this.handleChange} onBlur={this.handleBlur('accountId')}
                 valid={errors.accountId === ''}
                 invalid={errors.accountId !== ''}
            >
              <option value="" disabled>Choose</option>
              {optsa}
            </Input>
            <FormFeedback>{errors.accountId}</FormFeedback>
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

export default withRouter(VpcEdit);