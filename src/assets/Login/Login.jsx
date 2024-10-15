import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React, { useState } from 'react';
import './Login.css';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("signUp done");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("signIn done");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  // Google sign-in function
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider(); // Initialize the GoogleAuthProvider
    try {
      await signInWithPopup(auth, provider);
      console.log("Google Sign-In successful");
      navigate('/hero');// Navigate to your desired page
    } catch (error) {
      console.error("Google Sign-In failed:", error);
    }
  };

  return (
    <div className="loginBody">


      <div className="div-one">
        <h1>Get Started With Us</h1>
        <p className='GetMyContacts' >GetMyContacts</p>
        <button className='div-one-loginSwitch loginSwitch' onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
        </button>

      </div>
      <div className="div-two">

        <div className='login-container'>
          <p className='loginHeading'>{isSignUp ? "Sign Up" : "Login"}</p>
          <p className='loginPara' >Enter your personal details to continue</p>
          <form className='inputForm' onSubmit={handleSubmit}>
            <input
              className='email'
              type="email"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className='pass'
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className='loginBtn' type='submit'>{isSignUp ? "Sign Up" : "Login"}</button>
          </form>

        {/*   <button className='loginSwitch' onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
          </button> */}

          <hr />

          {/* Google Sign-In Button */}
          <button className='googleSignInBtn' onClick={handleGoogleSignUp}>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
