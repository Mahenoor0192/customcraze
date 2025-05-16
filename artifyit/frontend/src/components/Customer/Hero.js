import React from 'react';
import './Hero.css';  // Import the hero CSS file

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1 className="hero-title">
                     Customize and Artify Your Style
                </h1>
                <p className="hero-subtitle">Speed up your workflows with ArtifyIt's design tools and gain instant access to a ton of stunning illustrations. AI-powered design for T-shirts, Hoodies, Mugs & More.</p>
                <button className="hero-button">Start Designing Now  → </button>
            </div>
        </section>
    );
};

export default Hero;
