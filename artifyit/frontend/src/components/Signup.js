import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = ({ toggleForm }) => {  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signup(username, password, email));
      navigate("/dashboard");
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="form_container Sign_Up">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <div className="form-field">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <i className="fa-solid fa-user"></i>
          <label htmlFor="username">Username</label>
        </div>

        <div className="form-field">
          <input
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i className="fa-solid fa-lock"></i>
          <label htmlFor="password">Password</label>
        </div>

        <div className="form-field">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <i className="fa-solid fa-envelope"></i>
          <label htmlFor="email">Email</label>
        </div>

        <div className="show_password">
          <input
            type="checkbox"
            id="check"
            checked={isPasswordVisible}
            onChange={togglePasswordVisibility}
          />
          Show Password
        </div>

        <button type="submit" className="Login_button">Sign Up</button>
        
        {error && <p>{error}</p>}
        
        <div className="signup-link">
          <p>
            Already have an account?{" "}
            <button type="button" onClick={toggleForm} className="signup-link">Login</button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
