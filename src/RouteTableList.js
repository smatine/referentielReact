import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class RouteTableList extends Component {

  constructor(props) {
    super(props);
    this.state = {routetables: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`/routeTables`)
      .then(response => response.json())
      .then(data => this.setState({routetables: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/vpcs/${accId}/routeTables/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateRouteTable = [...this.state.routetables].filter(i => i.id !== id);
      this.setState({routetables: updateRouteTable});
    });
  }

  render() {
    const {routetables, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const routetableList = routetables.map(routetable => {
      
    const link = "/vpcs/" + routetable.vpc.id; 
    const isdef= (routetable.def)? 'Yes': 'No';      
    
    let subs='';
    if(routetable.subnets && routetable.subnets.length){
        routetable.subnets.map(s => {  
          subs = subs + s.id + ":" + s.name + ":" + s.az.name + "| ";
      });
    }  

      return <tr key={routetable.id}>
        <td style={{whiteSpace: 'nowrap'}}>{routetable.id}</td>
        <td>{routetable.name}</td>
        <td>{isdef}</td>
        <td>{routetable.text}</td>
        <td><a href={link}>{routetable.vpc.name}</a></td>
		    <td>{subs}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={"/routetable/" + routetable.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            <Button size="sm" color="secondary" tag={Link} to={"/routetable/" + routetable.id + "/routes" }>Routes</Button>&nbsp;&nbsp;
            <Button size="sm" color="primary" tag={Link} to={"/routetables/" + routetable.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(routetable.vpc.id, routetable.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/routetables/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add RouteTable</Button>
          </div>
          
          <h3>RouteTable</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Main</th>
              <th width="5%">Description</th>
              <th width="5%">Vpc</th> 
              <th width="5%">Subnet association</th>
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {routetableList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default RouteTableList;