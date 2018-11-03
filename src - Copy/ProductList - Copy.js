import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class ProductList extends Component {

  constructor(props) {
    super(props);
    this.state = {products: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('products')
      .then(response => response.json())
      .then(data => this.setState({products: data, isLoading: false}));
  }

  async remove(accId, id) {
    await fetch(`/accounts/${accId}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updateProduct = [...this.state.products].filter(i => i.id !== id);
      this.setState({products: updateProduct});
    });
  }

  render() {
    const {products, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const productList = products.map(product => {
      
      return <tr key={product.id}>
        <td style={{whiteSpace: 'nowrap'}}>{product.id}</td>

        <td>{product.name}</td>
		    <td>{product.appContext}</td>

		    <td>{product.text}</td>
		
		
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/products/" + product.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(product.account.id, product.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/products/new">Add Product</Button>
          </div>
          <h3>Product</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Id</th>
              <th width="20%">Name</th>
              <th width="20%">APP Context</th> 

			        <th width="20%">Description</th>
			        <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {productList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default ProductList;