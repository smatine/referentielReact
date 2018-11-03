import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class ElasticSearchList extends Component {

  constructor(props) {
    super(props);
    this.state = {elasticSearchs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`/elasticSearchs`)
      .then(response => response.json())
      .then(data => this.setState({elasticSearchs: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/vpcs/${accId}/elasticSearchs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateElasticSearch = [...this.state.elasticSearchs].filter(i => i.id !== id);
      this.setState({elasticSearchs: updateElasticSearch});
    });
  }

  async remove2(id) {
    await fetch(`/elasticSearch/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateElasticSearch = [...this.state.elasticSearchs].filter(i => i.id !== id);
      this.setState({elasticSearchs: updateElasticSearch});
    });
  }

  render() {
    const {elasticSearchs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const elasticSearchList = elasticSearchs.map(elasticSearch => {
      
      const link = (elasticSearch.vpc) ? "/vpcs/" + elasticSearch.vpc.id : ''; 
      
      const sg = (elasticSearch.subnetgroup) ? "/subnetgroups/" + elasticSearch.subnetgroup.id : '';
      const sgName = (elasticSearch.subnetgroup) ? elasticSearch.subnetgroup.name : '';

      const vpc = (elasticSearch.vpc) ? <a href={link}>{elasticSearch.vpc.name}</a> : '';

      const del = (elasticSearch.vpc) ? <Button size="sm" color="danger" onClick={() => this.remove(elasticSearch.vpc.id, elasticSearch.id)}>Delete</Button>:
                                        <Button size="sm" color="danger" onClick={() => this.remove2(elasticSearch.id)}>Delete</Button>
      

      const isPrivate = (elasticSearch.prive)? 'Privtae VPC':'Public';

      return <tr key={elasticSearch.id}>
        <td style={{whiteSpace: 'nowrap'}}>{elasticSearch.id}</td>


        <td>{elasticSearch.name}</td>
        <td>{isPrivate}</td>
        <td>{elasticSearch.text}</td>

        <td>{vpc}</td>
        
        <td><a href={sg}>{sgName}</a></td>
    


        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/elasticSearchs/" + elasticSearch.id}>Edit</Button>
            {del}
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/elasticSearchs/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add ElasticSearch</Button>
          </div>
          
          <h3>ElasticSearch</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name</th>
              <th width="5%">Private Vpc/ Public</th>
              <th width="5%">Description</th>
              <th width="5%">Vpc</th> 
              <th width="5%">Subnet Group</th>
              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {elasticSearchList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default ElasticSearchList;