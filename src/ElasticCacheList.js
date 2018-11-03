import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class ElasticCacheList extends Component {

  constructor(props) {
    super(props);
    this.state = {elasticCaches: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`/elasticCaches`)
      .then(response => response.json())
      .then(data => this.setState({elasticCaches: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/vpcs/${accId}/elasticCaches/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateElasticCache = [...this.state.elasticCaches].filter(i => i.id !== id);
      this.setState({elasticCaches: updateElasticCache});
    });
  }

  render() {
    const {elasticCaches, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const elasticCacheList = elasticCaches.map(elasticCache => {
      
      const link = "/vpcs/" + elasticCache.vpc.id; 
      
      const sg = "/subnetgroups/" + elasticCache.subnetgroup.id;

      return <tr key={elasticCache.id}>
        <td style={{whiteSpace: 'nowrap'}}>{elasticCache.id}</td>


        <td>{elasticCache.name}</td>
        <td>{elasticCache.text}</td>

        <td><a href={link}>{elasticCache.vpc.name}</a></td>
        
      <td><a href={sg}>{elasticCache.subnetgroup.name}</a></td>
    


        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/elasticCaches/" + elasticCache.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(elasticCache.vpc.id, elasticCache.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/elasticCaches/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add ElasticCache</Button>
          </div>
          
          <h3>ElasticCache</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              
              <th width="5%">Description</th>
              <th width="5%">Vpc</th> 
              <th width="5%">Subnet Group</th>
              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {elasticCacheList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default ElasticCacheList;