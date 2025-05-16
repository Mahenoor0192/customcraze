import React from 'react';
import Carousel from './Carousel';
import Hero from './Hero';
import Navbar from './Navbar';  // Importing Navbar component
import Footer from './Footer';  // Importing Footer component
import './Customer.css';
import ProductCard from './ProductCard';
import img from './img.png';


const Dashboard = () => {
    return (
        <div className='app1' >
            <Navbar />  {/* Adding Navbar at the top */}
            <div className="app-body">
                <div className="carousel-container">
                    <Carousel />
                </div>
                <div className="hero-container">
                    <Hero />
                </div>
            </div>
            <div className="background-abstract">
                <div className="sleek-gradient-layer">
                    <div className="content-container">
                        {/* <h1>What do you want to create?</h1> */}
                        <br />
                        <br />
                        <h3 className='text'>Bring your ideas to life with easy tools.</h3>
                    </div>
                </div>
                <div>
                    <br />
                    <br />
                    <img src={img} alt='' className='imghover' />
                </div>
            </div>
            <ProductCard />
            <Footer />  {/* Adding Footer at the bottom */}
        </div>
    );
};

export default Dashboard;
