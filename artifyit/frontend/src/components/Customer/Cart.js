import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const Cart = ({ canvasContent, fabricCanvas,it }) => {
  const [showCartModal, setShowCartModal] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(canvasContent.price);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
  });

  // Open/Close Modal for Add to Cart
  const handleCartModal = () => setShowCartModal(!showCartModal);

  // Open/Close Modal for Buy Now
  const handleBuyNowModal = () => setShowBuyNowModal(!showBuyNowModal);

  // Update total price when quantity changes
  const handleQuantityChange = (e) => {
    const qty = Math.max(1, parseInt(e.target.value, 10)); // Ensure minimum quantity is 1
    setQuantity(qty);
    setTotalPrice(qty * canvasContent.price);
  };
  

  // Handle customer details change for Buy Now
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails({ ...customerDetails, [name]: value });
  };

  // Function to export canvas as a data URL (image)
  const getCanvasImage = () => {
    if (fabricCanvas.current) {
      return fabricCanvas.current.toDataURL({
        format: 'jpeg',
        quality: 0.8,
      });
    }
    return null;
  };

  // Function to handle the Buy Now action and post order details
  // Function to convert a base64 string to a Blob
function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64.split(',')[1]); // Decode the base64 string
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
  
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
  const handleBuyNow = async () => {
    if (!it || !it.item_id) {
      alert('Item ID is missing. Please try again.');
      return;
    }
  
    const base64Image = getCanvasImage(); // Assuming this returns a base64 string of the canvas image
    const blobData = base64ToBlob(base64Image, 'image/jpeg'); // Convert base64 to Blob
    
    const designFile = new File([blobData], 'design.jpg', { type: 'image/jpeg' });
    
    const formData =new FormData()
    formData.append('item_id', it.item_id);  // Make sure to send item_id correctly
    formData.append('name', customerDetails.name);
    formData.append('address', customerDetails.address);
    formData.append('email', customerDetails.email); 
    formData.append('phone', customerDetails.phone);
    formData.append('price', totalPrice);
    console.log(totalPrice)
    formData.append('design', designFile);  // Add the design file here
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/orders/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Order successfully placed:', response.data);
      alert('Order placed successfully!');
      setShowBuyNowModal(false);
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
      alert('Failed to place the order. Please check your input.');
    }
  };
  
    
  
  return (
    <>
      <Button variant="success" onClick={handleCartModal}>Add to Cart</Button>
      <Button variant="warning" onClick={handleBuyNowModal}>Buy Now</Button>

      {/* Add to Cart Modal */}
      <Modal show={showCartModal} onHide={handleCartModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </Form.Group>
          <p><strong>Total Price: </strong>${totalPrice}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCartModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowCartModal(false)}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Buy Now Modal */}
      <Modal show={showBuyNowModal} onHide={handleBuyNowModal}>
        <Modal.Header closeButton>
          <Modal.Title>Buy Now</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={customerDetails.name}
                onChange={handleDetailsChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={customerDetails.address}
                onChange={handleDetailsChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={customerDetails.email}
                onChange={handleDetailsChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={customerDetails.phone}
                onChange={handleDetailsChange}
                required
              />
            </Form.Group>

            <p><strong>Price: </strong>${totalPrice}</p>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleBuyNowModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleBuyNow}>
            Confirm Purchase
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Cart;
