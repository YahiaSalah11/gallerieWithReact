import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');
  const [title, setTitle] = useState('');
  const [Lname, setLastname] = useState('');
  const [Fname, setFirstname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); // Clear previous errors
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/signup',
        { title, Fname, Lname, username, email, password, passwordMatch },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        navigate('/login');
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message); // Display the real server error
      } else {
        setError('Signup failed: ' + err.message);
      }
    }
  };
  


  return (
    <div className='SignUp'>
      <h2>CREATE ACCOUNT</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <select
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
            <option value="Dr">Dr</option>
          </select>
        </div>

        {/* First Name */}
        <div className="form-group">
          <label htmlFor="firstName">First name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={Fname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="lastName">Last name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={Lname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </div>

        {/* Username */}
        <div className="form-group">
          <label htmlFor='username'>Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor='email'>Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor='password'>Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="password-requirements">
            Password must contain:
            <ul>
              <li>Uppercase</li>
              <li>Lowercase</li>
              <li>Number</li>
              <li>8-30 characters</li>
              <li>Any of !, @, #, *, &, +, =</li>
            </ul>
          </div>
        </div>

        {/* Password Check */}
        <div className="form-group">
          <label htmlFor='passwordCheck'>Password Check</label>
          <input
            type="password"
            id="passwordCheck"
            placeholder="Re-enter Password"
            value={passwordMatch}
            onChange={(e) => setPasswordMatch(e.target.value)}
            required
          />
        </div>

        {/* Newsletter Subscription */}
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
          />
          <label htmlFor="newsletter">
            I want to receive the latest information from F1® including relevant news, surveys, offers, and exclusive competitions.
          </label>
        </div>

        

        {/* Submit Button */}
        <button type="submit">REGISTER</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SignUp;