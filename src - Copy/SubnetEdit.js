import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';

class SubnetEdit extends Component {

  emptyItem = {
    text: '',
	  vpc: '',
    type:'',
    sCidr: {},
  	vpcId : '',
    subnetCidrId: '',
    name: '',
    touched: {
      type: false,
      vpcId: false,
      subnetCidrId: false,
      name: false
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
      const subnet = await (await fetch(`/subnets/${this.props.match.params.id}`)).json();
      subnet.touched = {
        type: false,
        vpcId: false,
        subnetCidrId: false,
        name: false
      };
      this.setState({item: subnet});
    }
    else {
      const vpc = await (await fetch(`/vpcs/${this.props.match.params.idv}`)).json();
      const subnet = {
        text: '',
        type: '',
        vpc: '',
        sCidr: {},
        vpcId : '',
        name: '',
        subnetCidrId: '',
        touched: {
          type: false,
          vpcId: false,
          subnetCidrId: false,
          name: false
        }
      };
      subnet.vpc = vpc;
      subnet.touched = {
        type: false,
        vpcId: false,
        subnetCidrId: false,
        name: false
      };
      this.setState({item: subnet});
    }
    // modifier
    const {item} = this.state;
    //alert('/cidrs/' + item.vpc.cidr.id + '/subnetcidrs/' + item.sCidr.id);
    //await fetch('/cidr/env/' + (item.account.env),) //subnetcidrs   /cidrs/{cidrId}/subnetcidrs/{subnetcidr}
    //await fetch('/subnetcidrs',)
    await fetch((item.id) ? '/cidrs/' + item.vpc.cidr.id + '/subnetcidrs/' + item.sCidr.id : '/cidrs/' + item.vpc.cidr.id + '/subnetcidrs/0',)
    .then((result) => {
      
      return result.json();
    }).then((jsonResult) => {
      
      let item = {...this.state.item};
      item.sCidr = jsonResult;
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
        type: true,
        vpcId: true,
        subnetCidrId: true,
        name: true
    };
    const errors = this.validate(item.subnetCidrId, item.vpcId, item.type, item.name);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) return;
    
    const hist= '/vpc/' + item.vpc.id + '/subnets';

    item.sCidr={id: item.subnetCidrId};//modif subnetCidr

    alert(item.sCidr.id);

    await fetch((item.id) ? '/vpcs/' + (item.vpc.id) + '/subnets/'+(item.id) : '/vpcs/' + item.vpc.id + '/subnets', {
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

  validate(subnetCidrId, vpcId, type, name) {

    const errors = {
      type: '',
      vpcId: '',
      subnetCidrId: '',
      name: ''
    };
    
    if(this.state.item.touched.subnetCidrId && subnetCidrId.length === 0){
      errors.subnetCidrId = 'subnetCidr should not be null';
      return errors;
    }
    
    if(this.state.item.touched.type && type.length === 0){
      errors.type = 'type should not be null';
      return errors;
    }

    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    /*if(!this.state.item.id && this.state.item.touched.trigrammeId && trigrammeId.length === 0){
      errors.trigrammeId = 'trigramme should not be null';
      return errors;
    }*/
    return errors;
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Subnet' : 'Add Subnet'}</h2>;
    
    const errors = this.validate(item.subnetCidrId, item.vpcId, item.type, item.name);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = "/vpc/" + item.vpc.id + "/subnets";

    let vpcs = null;
    vpcs = <FormGroup>
            <Label for="vpcId">Vpc: {item.vpc.vpcCidr}</Label>
            <Input type="text" name="vpcId" id="vpcId" value={item.vpc.id || ''} disabled="true"/>
          </FormGroup>;


    
    let opts = [];
    if(item.sCidr && item.sCidr.length){
          item.sCidr.map(s => {  
          opts.push(<option value={s.id}>{s.id} {s.subnetCidr}</option>);
      });
    }
    if(item.id) {
          opts.push(<option value={item.sCidr.id} >{item.sCidr.id} {item.sCidr.subnetCidr} </option>);
    }

    let cid = item.subnetCidrId || '';
    item.subnetCidrId = cid;

    return <div>
      <AppNavbar/>
      <Container>
        {title}

        <Form onSubmit={this.handleSubmit}>

          
         
         <FormGroup>
            <Label for="name">Name (*)</Label>
            <Input type="text" name="name" id="name" value={item.name || ''}
                   onChange={this.handleChange} onBlur={this.handleBlur('name')} autoComplete="name"
                    valid={errors.name === ''}
                   invalid={errors.name !== ''}
            />
            <FormFeedback>{errors.name}</FormFeedback>
          </FormGroup>
          
          <FormGroup>
            <Label for="subnetCidrId">CIDR (*)</Label>
            <Input type="select" name="subnetCidrId" id="subnetCidrId"  value={cid} onChange={this.handleChange} onBlur={this.handleBlur('subnetCidrId')}
                 valid={errors.subnetCidrId === ''}
                 invalid={errors.subnetCidrId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.subnetCidrId}</FormFeedback>
          </FormGroup>
          
          
          <FormGroup>
            <Label for="type">Type(*)</Label>
            <Input type="text" name="type" id="type" value={item.type || ''}
                   onChange={this.handleChange} onBlur={this.handleBlur('type')} autoComplete="type"
                    valid={errors.type === ''}
                   invalid={errors.type !== ''}
            />
            <FormFeedback>{errors.type}</FormFeedback>
          </FormGroup>
          
		  
		  {vpcs}
		  
		  
		  
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

export default withRouter(SubnetEdit);