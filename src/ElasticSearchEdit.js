import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';

class ElasticSearchEdit extends Component {

  emptyItem = {
    name: '',
    text: '',
    vpc: {},
    vpcs: {},
    vpcId : '',
    subnetgroup: {},
    subnetgroups: {},
    subnetgroupId : '',
    prive: true,
    touched: {
      name: false,
      vpcId: false,
      subnetgroupId: false
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
      const elasticSearch = await (await fetch(`/elasticSearchs/${this.props.match.params.id}`)).json();
      elasticSearch.touched = {
        name: false,
        vpcId: false,
        subnetgroupId: false
      };
      this.setState({item: elasticSearch});
      //console.log("elasticSearch.prive=" + elasticSearch.prive +  " " + elasticSearch.prive);
      if(elasticSearch.prive) 
      {
        fetch('/vpcs/' + (elasticSearch.vpc.id) + '/type/ELK' + '/subnetGroups',)
          .then((result) => {
            return result.json();
          }).then((jsonResult) => {
            let item = {...this.state.item};
            item.subnetgroups = jsonResult;
            this.setState({item: item});
        });
        let item = {...this.state.item};
        item.vpcId = elasticSearch.vpc.id;
        item.subnetgroupId = elasticSearch.subnetgroup.id;
        this.setState({item: item});
      }
      
    }
    else {
      const elasticSearch = {
        name: '',
        text: '',
        vpc: {},
        vpcs: {},
        vpcId : '',
        subnetgroup: {},
        subnetgroups: {},
        subnetgroupId : '',
        prive: true,
        touched: {
          name: false,
          vpcId: false,
          subnetgroupId: false
        }
      };
      elasticSearch.touched = {
          name: false,
          vpcId: false,
          subnetgroupId: false
      };
      this.setState({item: elasticSearch});
    }

    await fetch('/vpcs',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.vpcs = jsonResult;
      this.setState({item: item});
    });
    

  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});

    //item.isSameVpc = true;
    if(name === 'accessType')
    {
      if(value === 'prive'){
       //hide 
        item.prive = true;
      }
      else
      {
        //show
        item.prive = false;
      }
    }
    if(name === 'vpcId')
    {
      //console.log('change' + item.vpcId);
      let vp={};
      fetch("/vpcs/" + item.vpcId,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        vp = jsonResult;
        //memevpc
        //if(item.id && item.sCidr.subnet.vpc.id !== vp.id) item.isSameVpc = false;
        fetch('/vpcs/' + (vp.id) + '/type/ELK' + '/subnetGroups',)
        .then((result) => {
          return result.json();
        }).then((jsonResult) => {
          item.subnetgroups = jsonResult;
          this.setState({item: item});
        });
      });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
          name: true,
          vpcId: true,
          subnetgroupId: true
    };
    const errors = this.validate(item.name, item.vpcId, item.subnetgroupId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= '/elasticSearchs'; 

    if(item.prive)
    {
      item.vpc={id: item.vpcId};
      item.subnetgroup={id: item.subnetgroupId};
    } else
    {
      item.vpc=null;
      item.subnetgroup=null;
    }
    
    //console.log("sma=" + item.prive);
    //return;

    if(item.prive)
    {
        
        await fetch((item.id) ? '/vpcs/' + (item.vpc.id) + '/elasticSearchs/'+(item.id) : '/vpcs/' + item.vpc.id + '/elasticSearchs', {
        method: (item.id) ? 'PUT' : 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
      });
    } else
    {
      await fetch((item.id) ? '/elasticSearch/'+(item.id) : '/elasticSearch', {
        method: (item.id) ? 'PUT' : 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
      });
    } 
    this.props.history.push(hist);
  }

  handleBlur = (field) => (evt) => {

    let item = {...this.state.item};
    item.touched= { ...this.state.item.touched, [field]: true};
    this.setState({item});

  }

  validate(name, vpcId, subnetgroupId) {

    const errors = {
      name: '' ,
      vpcId: '',
      subnetgroupId: ''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    else if(this.state.item.prive && this.state.item.touched.vpcId && vpcId.length === 0){
      errors.vpcId = 'Vpc should not be null';
      return errors;
    }
    else if(this.state.item.prive && this.state.item.touched.subnetgroupId && subnetgroupId.length === 0){
      errors.subnetgroupId = 'Subnet group should not be null';
      return errors;
    }
    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit elasticSearch' : 'Add elasticSearch'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.subnetgroupId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = "/elasticSearchs";

    
    let opts = [];
    if(item.vpcs && item.vpcs.length){
      item.vpcs.map(s => {  
          opts.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let tri = item.vpcId || '';
    item.vpcId = tri;


    let optss = [];
    if(item.subnetgroups && item.subnetgroups.length){
      item.subnetgroups.map(s => {  
          optss.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let sg = item.subnetgroupId || '';
    item.subnetgroupId = sg;
    //checked={this.state.selectedOption === 'option1'}isOpened = true;
    const prive = item.prive;
    const vpcsr =  (prive) ? <FormGroup >
                <Label for="vpcId">Vpcs (*)</Label>
                <Input type="select" name="vpcId" id="vpcId"  value={tri} onChange={this.handleChange} onBlur={this.handleBlur('vpcId')} 
                     valid={errors.vpcId === ''}
                     invalid={errors.vpcId !== ''}
                >
                  <option value="" disabled>Choose</option>
                  {opts}
                </Input>
                <FormFeedback>{errors.vpcId}</FormFeedback>
              </FormGroup> : ''
             
    const subnetgroupr = (prive) ? <FormGroup>
                <Label for="subnetgroupId">Subnet group (*)</Label>
                <Input type="select" name="subnetgroupId" id="subnetgroupId"  value={sg} onChange={this.handleChange} onBlur={this.handleBlur('subnetgroupId')}
                     valid={errors.subnetgroupId === ''}
                     invalid={errors.subnetgroupId !== ''}
                >
                  <option value="" disabled>Choose</option>
                  {optss}
                </Input>
                <FormFeedback>{errors.subnetgroupId}</FormFeedback>
              </FormGroup> : ''

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


          <FormGroup tag="fieldset">
            <Label for="accessType">Access Type (*)</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="accessType" id="accessType" value="prive" checked={prive === true}
                       onChange={this.handleChange} onBlur={this.handleBlur('accessType')} autoComplete="accessType"
                       valid={errors.accessType === ''}
                       invalid={errors.accessType !== ''}
                />{' '}
                VPC access (Recommended)
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="accessType" id="accessType" value="public" checked={prive === false}
                       onChange={this.handleChange} onBlur={this.handleBlur('accessType')} autoComplete="accessType"
                       valid={errors.accessType === ''}
                       invalid={errors.accessType !== ''}
                />{' '}
                Public access
              </Label>
            </FormGroup>
            <FormFeedback>{errors.accessType}</FormFeedback>
          </FormGroup>
           
          
            {vpcsr}
            {subnetgroupr}
          
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

export default withRouter(ElasticSearchEdit);