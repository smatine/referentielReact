import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';

class SubnetGroupEdit extends Component {

  emptyItem = {
    name: '',
    type: '',
    typeId: '',
    text: '',
	  vpc: {},
    vpcs: {},
  	vpcId : '',
    subnetss: {},
    subnets: [],
    subnetId: [],
    touched: {
      name: false,
      vpcId: false,
      subnetId: false,
      typeId: false
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
      const subnetGroup = await (await fetch(`/subnetGroups/${this.props.match.params.id}`)).json();
      
     
     subnetGroup.touched = {
        name: false,
        vpcId: false,
        subnetId: false,
        typeId: false
      };
      this.setState({item: subnetGroup});
      
      let vp={};
      await (await fetch("/vpcs/" + subnetGroup.vpc.id,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        vp = jsonResult;
        fetch('/vpcs/' + (vp.id) + '/subnets',)
        .then((result) => { 
          
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.subnetss = jsonResult;
          
          this.setState({item: item});
        });
      }));

      let item = {...this.state.item};
      item.vpcId = subnetGroup.vpc.id;
      item.typeId = subnetGroup.type;
      
      var values = [];
      item.subnets.map(s => { 
        values.push({"id": s.id});
      });
      item.subnets = values;
      this.setState({item: item});
      
    }
    else {
      const subnetGroup = {
        name: '',
        type: '',
        typeId:'',
        text: '',
        vpc: {},
        vpcs: {},
        vpcId : '',
        subnets: [],
        subnetss: {},
        subnetId: [],
        touched: {
          name: false,
          vpcId: false,
          subnetId: false,
          typeId: false
        }
      };
      subnetGroup.touched = {
          name: false,
          vpcId: false,
          subnetId: false,
          typeId: false
      };
      this.setState({item: subnetGroup});
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

    //item.isSameVpc = true;
    //console.log("-----------------------------");
    if(name === 'subnetId')
    {
      var options = event.target.options;
      var values = [];
      for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          //values.push({"id": options[i].value});
          //values.push(item.subnetss
            if(item.subnetss && item.subnetss.length){
                item.subnetss.map(s => { 
                  
                  if(s.id == options[i].value) {
                      //console.log( s.id + "===" + options[i].value);
                      values.push({"id": s.id});
                  }
              });
            }
          //console.log(i + " " + options[i].value);
        }
      }
      item.subnets = values;
      this.setState({item});
    }

    if(name === 'vpcId')
    {
      //console.log('change' + item.vpcId);
      
      let vp={};
      fetch("/vpcs/" + item.vpcId,)
      .then((result) => {
        //console.log('change1');
        return result.json();
      }).then((jsonResult) => {
        vp = jsonResult;

        //memevpc
        //if(item.id && item.sCidr.subnet.vpc.id !== vp.id) item.isSameVpc = false;//console.log("item.sCidr.subnet.vpc.id === vp.id" + item.sCidr.subnet.vpc.id + " " + vp.id);

        fetch('/vpcs/' + (vp.id) + '/subnets',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          
          item.subnetss = jsonResult;
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
          subnetId: true,
          typeId: true
    };
    const errors = this.validate(item.name, item.vpcId, item.subnetId, item.typeId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= '/subnetGroups'; 

    item.vpc={id: item.vpcId};
    item.type=item.typeId;

    var values = [];
    item.rdss=[];
    if(item.rdss && item.rdss.length){
      item.rdss.map(s => { 
        values.push({"id": s.id});
      });
      item.rdss= values;
    }
    values = [];
    if(item.efss && item.efss.length){
      item.efss.map(s => { 
        values.push({"id": s.id});
      });
      item.efss= values;
    }
    values = [];
    if(item.elasticcaches && item.elasticcaches.length){
      item.elasticcaches.map(s => { 
        values.push({"id": s.id});
      });
      item.elasticcaches= values;
    }
    values = [];
    if(item.elasticsearchs && item.elasticsearchs.length){
      item.elasticsearchs.map(s => { 
        values.push({"id": s.id});
      });
      item.elasticsearchs= values;
    }
    //item.subnets=[{"id": 1000}, {"id": 1001}];
    //item.subnets={};
    //
    if(item.subnets && item.subnets.length) item.subnets.map(s => {  
          console.log("subnet:" + s.id);
    });
    
    //return;

    await fetch((item.id) ? '/vpcs/' + item.vpc.id + '/subnetGroups/' + item.id : '/vpcs/' + item.vpc.id + '/subnetGroups', {
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

  validate(name, vpcId, subnetId, typeId) {

    const errors = {
      name: '' ,
      vpcId: '',
      subnetId: '',
      typeId: ''
    };
    
    if(this.state.item.touched.name && name.length === 0){
      errors.name = 'Name should not be null';
      return errors;
    }
    else if(this.state.item.touched.typeId && typeId.length === 0){
      errors.typeId = 'Type should not be null';
      return errors;
    }
    else if(this.state.item.touched.vpcId && vpcId.length === 0){
      errors.vpcId = 'Vpc should not be null';
      return errors;
    }
    else if(this.state.item.touched.subnetId && subnetId && subnetId.length === 0){
      errors.subnetId = 'Add subnets to cover at least 2 availability zones.';
      return errors;
    }
    

    return errors;
  }


  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit subnetGroup' : 'Add subnetGroup'}</h2>;

    const errors = this.validate(item.name, item.vpcId, item.subnetId, item.typeId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = "/subnetGroups";

    
    let opts = [];
    if(item.vpcs && item.vpcs.length){
      item.vpcs.map(s => {  
          opts.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let vpc = item.vpcId || '';
    item.vpcId = vpc;

    let optss = [];
    if(item.subnetss && item.subnetss.length){
      item.subnetss.map(s => {
      
          let isSelected = false;
          if(item.subnets && item.subnets.length) item.subnets.map(ss => {
             if(s.id == ss.id) isSelected = true;
          });
          optss.push(<option value={s.id} selected={isSelected}>{s.id} {s.name} {s.az.name}</option>);
      });
    }
    let sub = item.subnetId || {};
    item.subnetId = sub;

    let tt = item.typeId || '';
    item.typeId = tt;

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
            <Label for="typeId">Type (*)</Label>
            <Input type="select" name="typeId" id="typeId" value={tt} onChange={this.handleChange} onBlur={this.handleBlur('typeId')}
                 valid={errors.typeId === ''}
                 invalid={errors.typeId !== ''}
                 
            >
              <option value="" disabled>Choose</option>
              <option value="RDS">RDS</option>
              <option value="EFS">EFS</option>
              <option value="ECC">Elastic cache</option>
              <option value="ELK">Elastic search</option>
            </Input>
            <FormFeedback>{errors.typeId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="vpcId">Vpcs (*)</Label>
            <Input type="select" name="vpcId" id="vpcId"  value={vpc} onChange={this.handleChange} onBlur={this.handleBlur('vpcId')}
                 valid={errors.vpcId === ''}
                 invalid={errors.vpcId !== ''}
            >
              <option value="" disabled>Choose</option>
              {opts}
            </Input>
            <FormFeedback>{errors.vpcId}</FormFeedback>
          </FormGroup>
         
          <FormGroup>
            <Label for="subnetId">Subnets (*)</Label>
            <Input type="select" name="subnetId" id="subnetId"  /*value={"1001","1002"}*/ onChange={this.handleChange} onBlur={this.handleBlur('subnetId')} multiple
                 valid={errors.subnetId === ''}
                 invalid={errors.subnetId !== ''}
            >
            <option value="" disabled>Choose</option>
              {optss}
            </Input>
            <FormFeedback>{errors.subnetId}</FormFeedback>
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

export default withRouter(SubnetGroupEdit);