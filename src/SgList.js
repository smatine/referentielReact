import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class SgList extends Component {

  constructor(props) {
    super(props);
    this.state = {sgs: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    //fetch(`/trigrammes/${this.props.match.params.id}/products`)
    fetch(`/sgs`)
      .then(response => response.json())
      .then(data => this.setState({sgs: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/vpcs/${accId}/sgs/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateSg = [...this.state.sgs].filter(i => i.id !== id);
      this.setState({sgs: updateSg});
    });
  }

  render() {
    const {sgs, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const sgList = sgs.map(sg => {
      
      const link = "/vpcs/" + sg.vpc.id;  
           
      
      let lbs = '';
      const sgLbs = sg.lbs.map(lb => {
        lbs = lbs + '|' + lb.id + ':' + lb.name;
      })
      
      const isLb = (sg.lbs && sg.lbs.length !== 0) ? true : false;

      return <tr key={sg.id}>
        <td style={{whiteSpace: 'nowrap'}}>{sg.id}</td>


        <td>{sg.nameTag}</td>
        <td>{sg.name}</td>
        
        <td>{sg.text}</td>

        <td>{lbs}</td>
        <td><a href={link}>{sg.vpc.name}</a></td>
		    

        <td>
          <ButtonGroup>
            <Button size="sm" color="secondary" tag={Link} to={"/sg/" + sg.id + "/tags" }>Tags</Button>&nbsp;&nbsp;
            <Button size="sm" color="secondary" tag={Link} to={"/sg/" + sg.id + "/ruleSgs" }>Rules</Button>&nbsp;&nbsp;
            <Button size="sm" color="primary" tag={Link} to={"/sgs/" + sg.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(sg.vpc.id, sg.id)} disabled={isLb}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    const add = `/sgs/new`;
    //const trig = `/trigrammes`;

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={add}>Add Sg</Button>
          </div>
          
          <h3>Sg</h3>
          <Table className="mt-4">
            <thead>
            <tr>
            
              <th width="5%">Id</th>
              <th width="5%">Name Tag</th>
              <th width="5%">Name</th>
              <th width="5%">Description</th>

              <th width="5%">Lb</th>
              <th width="5%">Vpc</th> 
              
			        <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {sgList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default SgList;