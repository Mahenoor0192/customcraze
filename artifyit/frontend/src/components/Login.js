import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';
import './Signup.css'

const Login = ({ toggleForm }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(login(credentials.username, credentials.password));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (credentials.username === "admin") {
        navigate("/admindashboard");
      } else {
        navigate('/dashboard');
      }
    }
    if (error) {
      alert(error.message || "An error occurred");
    }
  }, [isAuthenticated, error, navigate, credentials.username]);

  return (
    <div className={`form_container Login`}>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-field">
          <input
            type="text"
            placeholder=""
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
          />
          <i className="fa-solid fa-envelope" />
          <label htmlFor="emailid" className="email_label">Username</label>
        </div>
        <div className="form-field">
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder=""
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
          <i className="fa-solid fa-lock" />
          <label htmlFor="password">Password</label>
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
        <div className="form-forget">
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit" className="Login_button">Login</button>
        {error && <p>{error.message || 'An error occurred'}</p>}
        <div className="signup-link">
          <p>
            Don't have an account?{" "}
            <button type="button" onClick={toggleForm} className="signup-link">Signup</button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
