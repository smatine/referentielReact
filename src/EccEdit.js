import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Select from 'react-select';

class EccEdit extends Component {

  emptyItem = {
    autoAssignPublicIp: '', 
    shutdownBehaviour: '', 
    enableTerminationProtection: false, 
    encoded64: false, 
    instanceType: '', 
    amiId: '',
    amis: [],
    monitoring: false, 
    userData: false, 
    userDataText: '',
    instanceTypes: [],
    instanceTypeId: '',
    vpcs: [],
    vpcId : '',
    subnets: [],
    subnetId : '',
    touched: {
      autoAssignPublicIp: false, 
      shutdownBehaviour: false, 
      instanceTypeId: false, 
      amiId: false, 
      userDataText: false,
      vpcId: false,
      subnetId: false
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

      const ecc = await (await fetch(`/eccs/${this.props.match.params.id}`)).json();
      ecc.touched = {
        autoAssignPublicIp: false, 
        shutdownBehaviour: false, 
        instanceTypeId: false, 
        amiId: false, 
        userDataText: false,
        vpcId: false,
        subnetId: false
      };
      this.setState({item: ecc});

      let item = {...this.state.item};
      item.instanceTypeId = ecc.instanceType.id;
      item.amiId = ecc.ami.id;
      item.vpcId = ecc.vpc.id;
      item.subnetId = ecc.subnet.id;

      let vp={};
      await (await fetch("/vpcs/" + ecc.vpc.id,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        vp = jsonResult;
        fetch('/regions/' + (vp.cidr.region.id) + '/amis',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          item.amis = jsonResult;
          this.setState({item: item});
        });
        fetch('/vpcs/' + (vp.id) + '/subnets',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.subnets = jsonResult;
          this.setState({item: item});
        });
      }));
      
      this.setState({item: item});
      /*
      let vp={};
      await (await fetch("/vpcs/" + ecc.vpc.id,)
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

      await (await fetch("/vpcs/" + ecc.vpc.id,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        vp = jsonResult;
        fetch('/vpcs/' + (vp.id) + '/sgs',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.sgss = jsonResult;
          this.setState({item: item});
        });
      }));

      let item = {...this.state.item};
      item.vpcId = ecc.vpc.id;
      var values = [];
      item.subnets.map(s => { 
        values.push({"id": s.id});
      });
      item.subnets = values;

      values = [];
      item.sgs.map(s => { 
        values.push({"id": s.id});
      });
      item.sgs = values;
      this.setState({item: item});
      */
    }
    else {
      const ecc = {
        autoAssignPublicIp: '', 
        shutdownBehaviour: '', 
        enableTerminationProtection: false, 
        encoded64: false, 
        instanceType: '', 
        instanceType:'',
        amiId: '',
        amis: [],
        monitoring: false, 
        userData: false, 
        userDataText: '',
        vpcs: [],
        vpcId : '',
        touched: {
          autoAssignPublicIp: false, 
          shutdownBehaviour: false, 
          instanceTypeId: false, 
          amiId: false, 
          userDataText: false,
          vpcId: false,
          subnetId: false
        }
      };
      ecc.touched = {
          autoAssignPublicIp: false, 
          shutdownBehaviour: false, 
          instanceTypeId: false, 
          amiId: false, 
          userDataText: false,
          vpcId: false,
          subnetId: false
      };
      this.setState({item: ecc});
    }
    
    await fetch('/instanceTypes',)
    .then((result) => {
      return result.json();
    }).then((jsonResult) => {
      let item = {...this.state.item};
      item.instanceTypes = jsonResult;
      this.setState({item: item});
    });

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
    const name = target.name; 
    const value = target.value;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});

    //enableTerminationProtection monitoring userData encoded64
    if(name === 'enableTerminationProtection')
    {
      item.enableTerminationProtection = (target.checked) ? true: false;
    }
    else if(name === 'monitoring')
    {
      item.monitoring = (target.checked) ? true: false;
    } else if(name === 'userData')
    {
      item.userData = (target.checked) ? true: false;
    }else if(name === 'encoded64')
    {
      item.encoded64 = (target.checked) ? true: false;
    }
    else if(name === 'vpcId')
    {
      let vp={};
      fetch("/vpcs/" + item.vpcId,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        vp = jsonResult;
        fetch('/regions/' + (vp.cidr.region.id) + '/amis',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          item.amis = jsonResult;
          this.setState({item: item});
        });
        fetch('/vpcs/' + (vp.id) + '/subnets',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          let item = {...this.state.item};
          item.subnets = jsonResult;
          this.setState({item: item});
        });
      });
     /*
      fetch("/vpcs/" + item.vpcId,)
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        vp = jsonResult;
        fetch('/vpcs/' + (vp.id) + '/sgs',)
        .then((result) => { 
          return result.json();
        }).then((jsonResult) => {
          item.sgss = jsonResult;
          this.setState({item: item});
        });

      });*/
    }
  }


  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    item.touched = {
      autoAssignPublicIp: true, 
      shutdownBehaviour: true, 
      instanceTypeId: true, 
      amiId: true, 
      userDataText: true,
      vpcId: true,
      subnetId: true
    };
    const errors = this.validate(item.autoAssignPublicIp, item.shutdownBehaviour, item.instanceTypeId, item.amiId, item.userDataText, item.userData, item.vpcId, item.subnetId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    if(isDisabled) {
        this.forceUpdate();
        return;
    }
    
    const hist= '/eccs'; 

    if(!item.userData) {
      item.userDataText = '';
      item.encoded64 = false;
    }
    item.instanceType = {id: item.instanceTypeId};
    item.ami = {id: item.amiId};
    item.vpc = {id: item.vpcId};
    item.subnet = {id: item.subnetId};

    await fetch((item.id) ? '/eccs/'+(item.id) : '/ecc', {
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

  validate(autoAssignPublicIp, shutdownBehaviour, instanceTypeId, amiId, userDataText, userData, vpcId, subnetId) {

    const errors = {
      autoAssignPublicIp: '', 
      shutdownBehaviour: '', 
      instanceTypeId: '', 
      amiId: '', 
      userDataText: '',
      vpcId : '',
      subnetId: ''
    };

    if(this.state.item.touched.subnetId && subnetId.length === 0){
      errors.subnetId = 'subnet type should not be null';
      return errors;
    }
    else if(this.state.item.touched.vpcId && vpcId.length === 0){
      errors.vpcId = 'vpc type should not be null';
      return errors;
    }
    else if(this.state.item.touched.amiId && amiId.length === 0){
      errors.amiId = 'ami type should not be null';
      return errors;
    }
    if(this.state.item.touched.instanceTypeId && instanceTypeId.length === 0){
      errors.instanceTypeId = 'instanceType should not be null';
      return errors;
    }
    else if(this.state.item.touched.autoAssignPublicIp && autoAssignPublicIp.length === 0){
      errors.autoAssignPublicIp = 'autoAssignPublicIp should not be null';
      return errors;
    }
    else if(this.state.item.touched.shutdownBehaviour && shutdownBehaviour.length === 0){
      errors.shutdownBehaviour = 'shutdownBehaviour should not be null';
      return errors;
    }
    else if(userData && this.state.item.touched.userDataText && userDataText.length === 0){
      errors.userDataText = 'userDataText type should not be null';
      return errors;
    }
        
    return errors;
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Ecc' : 'Add Ecc'}</h2>;

    const errors = this.validate(item.autoAssignPublicIp, item.shutdownBehaviour, item.instanceTypeId, item.amiId, item.userDataText, item.userData, item.vpcId, item.subnetId);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    const canc = "/eccs";

    const encoded64 = (item.userData) ? <FormGroup >
            <Label for="encoded64" >Encoded64:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="encoded64" id="encoded64" 
                    onChange={this.handleChange} onBlur={this.handleBlur('encoded64')} 
                    checked={item.encoded64 === true}/>
          </FormGroup> : '';
    const userDataText = (item.userData) ? <FormGroup>
            <Label for="userDataText">User Data Text(*)</Label>
            <Input type="textarea" name="userDataText" id="userDataText" value={item.userDataText || ''} placeholder="Enter userDataText"
                   onChange={this.handleChange} onBlur={this.handleBlur('userDataText')} autoComplete="userDataText"
                   valid={errors.userDataText === ''}
                   invalid={errors.userDataText !== ''}
            />
           <FormFeedback>{errors.userDataText}</FormFeedback>
          </FormGroup> : '';
          
    let optVpcs = [];
    if(item.vpcs && item.vpcs.length){
      item.vpcs.map(s => {  
          optVpcs.push(<option value={s.id}>{s.id} {s.name}</option>);
      });
    }
    let vpc = item.vpcId || '';
    item.vpcId = vpc;
    
    let optAmis = [];
    if(item.amis && item.amis.length){
      item.amis.map(s => {  
          optAmis.push(<option value={s.id}>{s.id} {s.name} {s.amiId}</option>);
      });
    }
    let ami = item.amiId || '';
    item.amiId = ami;

    let optInstanceTypes = [];
    if(item.instanceTypes && item.instanceTypes.length){
      item.instanceTypes.map(s => {  
          optInstanceTypes.push(<option value={s.id}>{s.id} {s.type}</option>);
      });
    }
    let instanceType = item.instanceTypeId || '';
    item.instanceTypeId = instanceType;

    let optSubnets = [];
    if(item.subnets && item.subnets.length){
      item.subnets.map(s => {  
          optSubnets.push(<option value={s.id}>{s.id} {s.name} </option>);
      });
    }
    let sub = item.subnetId || '';
    item.subnetId = sub;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
         <Form onSubmit={this.handleSubmit}>
      
          <FormGroup>
            <Label for="vpcId">Vpc (*)</Label>
            <Input type="select" name="vpcId" id="vpcId" value={item.vpcId || ''} placeholder="Enter vpc"
                   onChange={this.handleChange} onBlur={this.handleBlur('vpcId')} autoComplete="vpcId"
                   valid={errors.vpcId === ''}
                   invalid={errors.vpcId !== ''} >
                   <option value="" disabled>Choose</option>
                   {optVpcs}
            </Input>
           <FormFeedback>{errors.vpcId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="subnetId">Subnet (*)</Label>
            <Input type="select" name="subnetId" id="subnetId" value={item.subnetId || ''} placeholder="Enter subnet"
                   onChange={this.handleChange} onBlur={this.handleBlur('subnetId')} autoComplete="subnetId"
                   valid={errors.subnetId === ''}
                   invalid={errors.subnetId !== ''} >
                   <option value="" disabled>Choose</option>
                   {optSubnets}
            </Input>
           <FormFeedback>{errors.subnetId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="amiId">Ami(*)</Label>
            <Input type="select" name="amiId" id="amiId" value={item.amiId || ''} placeholder="Enter amiId"
                   onChange={this.handleChange} onBlur={this.handleBlur('amiId')} autoComplete="amiId"
                   valid={errors.amiId === ''}
                   invalid={errors.amiId !== ''}>
                   <option value="" disabled>Choose</option>
                   {optAmis}
            </Input>
           <FormFeedback>{errors.amiId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="instanceTypeId">Instance Type (*)</Label>
            <Input type="select" name="instanceTypeId" id="instanceTypeId" value={item.instanceTypeId || ''} placeholder="Enter instanceType"
                   onChange={this.handleChange} onBlur={this.handleBlur('instanceTypeId')} autoComplete="instanceTypeId"
                   valid={errors.instanceTypeId === ''}
                   invalid={errors.instanceTypeId !== ''} >
                   <option value="" disabled>Choose</option>
                   {optInstanceTypes}
            </Input>
           <FormFeedback>{errors.instanceTypeId}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="autoAssignPublicIp">Auto Assign Public Ip (*)</Label>
            <Input type="select" name="autoAssignPublicIp" id="autoAssignPublicIp" value={item.autoAssignPublicIp || ''} onChange={this.handleChange} onBlur={this.handleBlur('autoAssignPublicIp')} 
                 valid={errors.autoAssignPublicIp === ''}
                 invalid={errors.autoAssignPublicIp !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="Disable">Disable</option>
              <option value="Enable">Enable</option>
            </Input>
            <FormFeedback>{errors.autoAssignPublicIp}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="shutdownBehaviour">Shutdown Behaviour (*)</Label>
            <Input type="select" name="shutdownBehaviour" id="shutdownBehaviour" value={item.shutdownBehaviour || ''} onChange={this.handleChange} onBlur={this.handleBlur('shutdownBehaviour')} 
                 valid={errors.shutdownBehaviour === ''}
                 invalid={errors.shutdownBehaviour !== ''}
            >
              <option value="" disabled>Choose</option>
              <option value="Stop">Stop</option>
              <option value="Terminate">Terminate</option>
            </Input>
            <FormFeedback>{errors.shutdownBehaviour}</FormFeedback>
          </FormGroup>

          <FormGroup >
            <Label for="enableTerminationProtection" >Enable Termination Protection:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="enableTerminationProtection" id="enableTerminationProtection" 
                    onChange={this.handleChange} onBlur={this.handleBlur('enableTerminationProtection')} 
                    checked={item.enableTerminationProtection === true}/>
          </FormGroup>

          <FormGroup > 
            <Label for="monitoring" >Monitoring:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="monitoring" id="monitoring" 
                    onChange={this.handleChange} onBlur={this.handleBlur('monitoring')} 
                    checked={item.monitoring === true}/>
          </FormGroup>

          <FormGroup >
            <Label for="userData" >User Data:</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Input type="checkbox" name="userData" id="userData" 
                    onChange={this.handleChange} onBlur={this.handleBlur('userData')} 
                    checked={item.userData === true}/>
          </FormGroup>

          {encoded64}
          {userDataText}

          <FormGroup>
            <Button color="primary" type="submit" disabled={isDisabled}>Save</Button>{' '}
            <Button color="secondary" tag={Link} to={canc}>Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(EccEdit);