import React, { useState, useEffect, useRef } from 'react';
import styles from './register.module.css';
import api from '../../service/api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {

const inputName = useRef();
const inputEmail = useRef();
const inputPassword = useRef();
const navigate = useNavigate();

async function createUser(e) {
  e.preventDefault(); // previne o recarregamento da página
  if (!inputEmail.current.value || !inputPassword.current.value || !inputName.current.value) {
    alert('Please fill all fields.');
    return;
  }
  if (inputPassword.current.value.length < 6) {
    alert('Password must be at least 8 characters long.');
    return;
  }
  try {
    const response = await api.post('/register', {
      username: inputName.current.value,
      email: inputEmail.current.value,
      password: inputPassword.current.value,
    });

    if (response.status === 201) { 
      navigate('/login'); // 201 é ok
    } else if (response.status === 400) {
      alert('An account with this email already exists'); // 400 é email existe
    } else {
      alert('Registration failed. Please try again.');
    }
  } catch (error) {
    // ve se o erro é do backend
    if (error.response && error.response.status === 400) {
      alert(error.response.data.message); // se for exibe a msg
    } else {
      console.error('Error during registration:', error);
      alert('An error occurred. Please try again.');
    }
  }
}

useEffect(() => {
    document.title = 'Register'; 
  }, []);
  return (
    <>
      <form>
        <div className={styles.page}>
          <div className={styles.inputs}>
            <h1>Create your free account</h1>
            <p>Your username</p>
            <div className={styles.username}>
              <input type="text" placeholder="Username" ref={inputName} />
            </div>
            <p>Your email</p>
            <div className={styles.email}>
              <div className={styles.emailButton}></div>
              <input type="email" placeholder="Email"  ref={inputEmail} />
            </div>

            <p>Your password</p>
            <input type='password' placeholder="Password" ref={inputPassword}/>

            <button className={styles.loginButton} onClick={createUser}>Sign up</button>

            <div className={styles.register}><Link to="/login" className={styles.linkContainer}>
                <div>Already have an account?</div>
                <span className={styles.highlight}>Sign in</span>
                </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Register;
