import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, ListGroup, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { BsUpload, BsCardList, BsMagic, BsFillGridFill, BsDownload } from 'react-icons/bs';
import axios from 'axios';
import { fabric } from 'fabric-pure-browser';
import Cart from './Cart';
import './Design.css'

const Design = ({ selectedItem }) => {
  const [canvasContent, setCanvasContent] = useState(selectedItem);
  const [uploadedDesign, setUploadedDesign] = useState(null);
  const [designTemplates, setDesignTemplates] = useState([]);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [textInput, setTextInput] = useState('');
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [processId, setProcessId] = useState(null); // Store process ID for fetching the generated image

  const REACT_APP_STABLE_DIFFUSION_API_KEY = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjFkNmQ5MWYwMzAxNmNjYWIxYTkyMzhjODUxZjM3NjNlIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDktMTZUMTE6MjU6NDkuMTg4MjA4In0.lWzzqmbLfX1NfNt5O_sFu1_yf5n8w5VEP-b6_87K7hI";
  const REACT_APP_STABLE_DIFFUSION_API_URL = "https://api.monsterapi.ai/v1/generate/txt2img";
  const REACT_APP_STABLE_DIFFUSION_GET_API_URL = "https://api.monsterapi.ai/v1/status"

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
      });

      if (canvasContent.image) {
        loadImageWithCors(canvasContent.image, (img) => {
          const canvasWidth = fabricCanvas.current.width;
          const canvasHeight = fabricCanvas.current.height;

          img.set({
            left: (canvasWidth - img.width * img.scaleX) / 2,
            top: (canvasHeight - img.height * img.scaleY) / 2,
            selectable: false,
          });
          fabricCanvas.current.add(img);
          fabricCanvas.current.renderAll();
        });
      }
    }

    // Cleanup on unmount
    return () => {
      fabricCanvas.current?.dispose();
    };
  }, [canvasContent]);

  const loadImageWithCors = (url, callback) => {
    fabric.Image.fromURL(url, callback, { crossOrigin: 'anonymous' });
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];

    if (file && validTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedDesign(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image (JPG, PNG, SVG).');
    }
  };

  useEffect(() => {
    if (fabricCanvas.current && uploadedDesign) {
      loadImageWithCors(uploadedDesign, (img) => {
        const canvasWidth = fabricCanvas.current.width;
        const canvasHeight = fabricCanvas.current.height;

        img.set({
          left: (canvasWidth - img.width * img.scaleX) / 2,
          top: (canvasHeight - img.height * img.scaleY) / 2,
          selectable: true,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        fabricCanvas.current.add(img).setActiveObject(img);
        fabricCanvas.current.renderAll();
      });
    }
  }, [uploadedDesign]);

  const fetchDesignTemplates = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/customization-templates/');
      setDesignTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      alert('Failed to fetch design templates. Please try again.');
    }
  };

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
    if (!showRightSidebar) {
      fetchDesignTemplates();
    }
  };

  const addDesignToCanvas = (imageUrl) => {
    if (fabricCanvas.current) {
      loadImageWithCors(imageUrl, (img) => {
        const canvasWidth = fabricCanvas.current.width;
        const canvasHeight = fabricCanvas.current.height;

        img.set({
          left: (canvasWidth - img.width * img.scaleX) / 2,
          top: (canvasHeight - img.height * img.scaleY) / 2,
          selectable: true,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        fabricCanvas.current.add(img).setActiveObject(img);
        fabricCanvas.current.renderAll();
      });
    }
    setShowRightSidebar(false);
  };

  const downloadCanvas = () => {
    if (fabricCanvas.current) {
      try {
        const dataURL = fabricCanvas.current.toDataURL({ format: 'jpeg', quality: 0.8 });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'design.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          alert('Downloaded successfully!');
        }, 100);
      } catch (error) {
        console.error('Error downloading canvas:', error);
      }
    }
  };

  const addTextToCanvas = () => {
    if (fabricCanvas.current && textInput) {
      const text = new fabric.Text(textInput, {
        left: 100,
        top: 100,
        fontSize: 24,
        fill: '#000',
      });
      fabricCanvas.current.add(text).setActiveObject(text);
      fabricCanvas.current.renderAll();
      setTextInput('');
      console.log(text)
    }
  };


  const generateImageFromText = async (text) => {
    if (!text || text.trim().length < 3) {
      alert('Please enter a valid prompt (at least 3 characters).');
      return;
    }

    setGeneratingImage(true);
    try {
      const response = await axios.post(REACT_APP_STABLE_DIFFUSION_API_URL,
        {
          prompt: text,
          // steps: 50,
          // width: 512,
          // height: 512,
        },
        {
          headers: {
            Authorization: `${REACT_APP_STABLE_DIFFUSION_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );


      if (response.data && response.status == 200) {
        console.log(response.data.process_id)
        setProcessId(response.data.process_id); // Save process ID to state
        checkImageGenerationStatus(response.data.process_id); // Trigger GET request
      } else {
        alert('No process ID returned from Stable Diffusion.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    } finally {
      setGeneratingImage(false);
    }



  };

  const checkImageGenerationStatus = async (processId) => {
    const maxRetries = 3; // Maximum number of retries
    let attempts = 0;
    const retryDelay = 5000; // Fixed delay of 5 seconds between attempts

    try {
      const intervalId = setInterval(async () => {
        attempts += 1; // Increment the attempt counter

        try {
          const response = await axios.get(`${REACT_APP_STABLE_DIFFUSION_GET_API_URL}/${processId}`, {
            headers: {
              Authorization: `Bearer ${REACT_APP_STABLE_DIFFUSION_API_KEY}`,
              'accept': 'application/json',
            },
          });
          // console.log(`${REACT_APP_STABLE_DIFFUSION_GET_API_URL}/${processId}`);

          console.log('Full Response:', response.data);

          if (response.data && response.data.status == 'COMPLETED') {

            console.log(`${REACT_APP_STABLE_DIFFUSION_GET_API_URL}/${processId}`);

            console.log('Process ID:', processId);
            console.log('Response Data:', response.data);

            console.log(response);

            clearInterval(intervalId); // Stop polling once the image is ready

            const imageUrl = response.data.result.output[0]; // Fetch the generated image URL
            addDesignToCanvas(imageUrl);

          } else if (response.data.status === 'failed') {
            clearInterval(intervalId); // Stop polling if image generation failed
            alert('Image generation failed.');
          }
        } catch (error) {
          console.error('Error fetching generated image:', error);
        }

        if (attempts >= maxRetries) {
          clearInterval(intervalId); // Stop polling after 3 attempts
          console.log('Max retry attempts reached.');
          alert('Image generation timed out after 3 attempts.');
        }
      }, retryDelay);
    } catch (error) {
      console.error('Error starting image generation status check:', error);
    }
  };


  // const checkImageGenerationStatus = async (processId) => {
  //   // let retryDelay = 5000; // Initial delay of 5 seconds

  //   try {
  //     const intervalId = setInterval(async () => {
  //       const response = await axios.get(`${REACT_APP_STABLE_DIFFUSION_GET_API_URL}/${processId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${REACT_APP_STABLE_DIFFUSION_API_KEY}`,
  //             'accept': 'application/json',
  //           },
  //         }
  //       );
  //       console.log(`${REACT_APP_STABLE_DIFFUSION_GET_API_URL}/${processId}`)
  //       if (response.data && response.data.status == 200) {
  //         console.log(response)
  //         clearInterval(intervalId); // Stop polling once the image is ready

  //         const imageUrl = response.data.image_url; // Fetch the generated image URL
  //         addDesignToCanvas(imageUrl);
  //       } else if (response.data.status === 'failed') {
  //         clearInterval(intervalId); // Stop polling if image generation failed
  //         alert('Image generation failed.');
  //       }

  //       // Increase delay after each attempt
  //       retryDelay = Math.min(retryDelay * 2, 60000); // Max delay is 1 minute
  //     }, retryDelay);
  //   } catch (error) {
  //     console.error('Error fetching generated image:', error);
  //     clearInterval(intervalId);
  //   }
  // };





  return (
    <Container fluid className="p-3">
      <Row>
        <Col md={1} className="border-end text-center">
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <input
                type="file"
                style={{ display: 'none' }}
                id="upload-input"
                onChange={handleUpload}
              />
              <Button variant="link" className="w-100 text-center p-3 designbtn" onClick={() => document.getElementById('upload-input').click()}>
                <BsUpload size={24} />
              </Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="link" className="w-100 text-center p-3 designbtn">
                <BsCardList size={24} />
                {/* onClick={toggleRightSidebar} */}
              </Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="link" className="w-100 text-center p-3 desingbtn">
                <BsMagic size={24} />
              </Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="link" className="w-100 text-center p-3 desingbtn" onClick={() => setShowTextModal(true)}
              >
                <BsFillGridFill size={24} />
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={showRightSidebar ? 9 : 11} style={{ position: 'relative' }}>
          <h4 className='head'>Design Your Product</h4>
          <div className="design-area">
            <canvas ref={canvasRef} />
            <p>{canvasContent.description}</p>
            <p>
              <strong>Price:</strong> ₹{canvasContent.price}
            </p>
            <Button
              variant="primary"
              style={{ position: 'absolute', top: 20, right: 20 }}
              onClick={downloadCanvas}
            >
              <BsDownload size={24} />
            </Button>

            <Cart canvasContent={canvasContent} fabricCanvas={fabricCanvas} it={selectedItem} />
          </div>
        </Col>

        {/* {showRightSidebar && (
          <Col md={2} className="border-start p-3" style={{ backgroundColor: '#f8f9fa', overflowY: 'auto', maxHeight: '600px' }}>
            <h5>Design Templates</h5>
            <div className="design-templates-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {designTemplates.length > 0 ? (
                designTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="design-template-item"
                    style={{ width: '100px', height: '100px', border: '1px solid #ddd', cursor: 'pointer' }}
                    onClick={() => addDesignToCanvas(template.image)}
                  >
                    <img src={template.image} alt={template.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))
              ) : (
                <p>No templates available.</p>
              )}
            </div>
          </Col>
        )} */}
      </Row>

      {/* Modal for inputting text and generating an image */}
      <Modal show={showTextModal} onHide={() => setShowTextModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Text or Generate Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="textInput">
              <Form.Label>Enter Text</Form.Label>
              <Form.Control
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text to add or generate an image"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              addTextToCanvas();
              setShowTextModal(false);
            }}
          >
            Add Text to Canvas
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              generateImageFromText(textInput);
              setShowTextModal(false);
            }}
            disabled={generatingImage}
          >
            {generatingImage ? <Spinner animation="border" size="sm" /> : 'Generate Image'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Design;
