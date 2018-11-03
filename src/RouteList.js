import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class RouteList extends Component {

  constructor(props) {
    super(props);
    this.state = {routes: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch(`/routetables/${this.props.match.params.id}/routes`)
      .then(response => response.json())
      .then(data => this.setState({routes: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/routetables/${accId}/routes/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateRoute = [...this.state.routes].filter(i => i.id !== id);
      this.setState({routes: updateRoute});
    });
  }

  render() {
    const {routes, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const routeList = routes.map(route => {
      
      const link = "/routetables/" + route.routeTable.id; 
      const prop= (route.propagation)? 'Yes': 'No';
      

      return <tr key={route.id}>
        <td style={{whiteSpace: 'nowrap'}}>{route.id}</td>

        <td>{route.destination}</td>
        <td>{route.target}</td>
        <td>{prop}</td>

        <td>{route.text}</td>
        <td><a href={link}>{route.routeTable.name}</a></td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/routetable/" + route.routeTable.id  + "/routes/" + route.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(route.routeTable.id, route.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/routetable/${this.props.match.params.id}/routes/new`;
    const routetable = `/routetables`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="primary" tag={Link} to={routetable}>Route table</Button>
            &nbsp;&nbsp;&nbsp;
            <Button color="success" tag={Link} to={add}>Add Route</Button>
          </div>
          
          <h3>Route</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Destination</th>

              <th width="5%">Target</th>
              
              <th width="5%">Propagated</th>


              <th width="5%">Description</th>
              <th width="5%">Nacl</th> 
              
              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {routeList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default RouteList;