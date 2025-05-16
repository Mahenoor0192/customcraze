import React from 'react';
import './Navbar.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { logout } from '../../redux/actions/authActions'; // Ensure path is correct

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate('/'); // Navigate to login page after logout
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                ArtifyIt
            </div>
            <div className="navbar-links">
                <a href="#categories">Categories</a>
                <a href="#design">Design Studio</a>
                <a href="#cart">Cart</a>
                <a href="#search">Search</a>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
