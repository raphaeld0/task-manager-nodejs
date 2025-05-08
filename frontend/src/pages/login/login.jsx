import React, { useState, useEffect, useRef } from 'react';
import styles from './login.module.css';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../service/api';

function Login() {
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();
  const inputEmail = useRef();
  const inputPassword = useRef();
  
  async function Login(e) {
    e.preventDefault();
    if (!inputEmail.current.value || !inputPassword.current.value) {
      alert('Please fill in both email and password fields.');
      return;
    }
    try {
      const response = await api.post('/login', {
        email: inputEmail.current.value,
        password: inputPassword.current.value,
      });
  
      if (response.status === 200) {
        // token!!!!!
        localStorage.setItem('token', response.data.token);
        navigate('/home'); 
      } else if (response.status === 400) {
        alert('Invalid email or password');
      } else if (response.status === 401) {
        alert('Invalid password');
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
      }
    }
  }




  const handleCheckboxChange = (event) => {
    setShowPassword(event.target.checked); 
  };
  
  useEffect(() => {
    document.title = 'Login';  
  }, []);
  return (
    <>
      <form action="">
        <div className={styles.page}>
          <div className={styles.inputs}>
            <h1>Good to see you again</h1>

            <p>Your email</p>
            <div className={styles.email}>
              <div className={styles.emailButton}></div>
              <input type="email" placeholder="Email" ref={inputEmail}/>
            </div>

            <p>Your password</p>
            <div className={styles.password}>
              <input
                type={showPassword ? 'text' : 'password' } 
                placeholder="Password" ref={inputPassword}
              />
</div>
                  
                  <div className={styles.checkboxContainer}>
  <input
    type="checkbox"
    checked={showPassword}
    onChange={handleCheckboxChange}
  />
  <label>Show Password</label>
  <label className={styles.toggle}></label>
                  <label  className={styles.toggle}></label>
            </div>
            <button className= {styles.loginButton} onClick={Login}>Sign in</button>

            <div className={styles.register}><Link to="/register" className={styles.linkContainer}>
              
                <div>Don't have an account?</div>
                <span className={styles.highlight}>Sign up</span>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;