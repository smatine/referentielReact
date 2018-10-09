import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

class Home extends Component {
  render() {
    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <Button color="link"><Link to="/trigrammes">Manage TRIGRAMME</Link></Button>
		  <Button color="link"><Link to="/accounts">Manage Account</Link></Button>
        </Container>
      </div>
    );
  }
}

export default Home;