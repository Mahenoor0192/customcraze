import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css'
import template from './template.png'
// import TShirtCustom from './TShirtCustom.jsx';

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to store the selected product
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product data from the API
    axios.get('http://localhost:8000/productapi/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("Error fetching data from API:", error);
      });
  }, []);

  const handleDesignNowClick = (product) => {
    setSelectedProduct(product); // Set the selected product
    navigate('/design', { state: { selectedItem: product } }); // Pass selected product to the design page
  };

  return (
    <Container>
      <br />
      <br />
      <br />
      <Row className="justify-content-center">
        {products.map(product => (
          <Col key={product.item_id} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex align-items-stretch">
            <Card style={{ width: '100%', minWidth: '250px' }}>
              {product.image && (
                <Card.Img variant="top" src={product.image} alt={product.name} />
              )}
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text><strong>Price:</strong> ₹{product.price}</Card.Text>
                <div className="card-buttons">
                  <Button variant="primary" className='designnow' onClick={() => handleDesignNowClick(product)}>
                    Design Now
                  </Button>
                  {/* <Button variant="success">Add to Cart</Button> */}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className='templatetext'>
        <h2>
          Beautifully crafted design templates
        </h2>
        Choose from thousands of professional design templates to customize with just a few clicks.
        <br />
        <br />
        <br />
        <br />
      </div>
      <div>
        <img src={template} alt='' className='template' />
      </div>
      {/* <TShirtCustom/> */}
    </Container>
  );
};

export default ProductCard;