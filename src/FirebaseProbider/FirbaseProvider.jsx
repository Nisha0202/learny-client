import React, { createContext, useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider, updateProfile } from "firebase/auth";
import { signOut } from "firebase/auth";
import { reload } from "firebase/auth";
import auth from '../firebase/firebase.config';
import { GithubAuthProvider } from "firebase/auth";

export const AuthContext = createContext(null);

export default function FirebaseProvider(props) {
  
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const [usern, setUsern] = useState(false);

  const createUser = async (email, password, username, image, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: username,
        photoURL: image,

      });
      await reload(user); // Reload the user to get the updated profile
      setUsern(user);
      return user;
    } catch (error) {
      console.log(error.message, error.code);
      throw error;
    }
  };

  const signInUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUsern(user);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const saveUserInfo = async (userInfo) => {
    try {
      const response = await fetch('https://learny-brown.vercel.app/api/social-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message);
      }
      const data = await response.json();
      console.log('User saved successfully:', data);
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  };

  const googleLogin = (navigate) => {
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const user = result.user;
        const userInfo = {
          email: user.email,
          username: user.displayName,
          image: user.photoURL,
          role: 'student',
        };
        await saveUserInfo(userInfo);

        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        setUsern(user);
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
        localStorage.setItem('role', 'student');
        navigate('/');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error('Google login error:', error);
      });
  };

  const githubLogin = (navigate) => {
    signInWithPopup(auth, githubProvider)
      .then(async (result) => {
        const user = result.user;
        const userInfo = {
          email: user.email,
          username: user.displayName,
          image: user.photoURL,
          role: 'student',
        };
        await saveUserInfo(userInfo);

        const credential = GithubAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        setUsern(user);
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
        localStorage.setItem('role', 'student');
        navigate('/');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error('Github login error:', error);
      });
  };


  const logOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('Sign-out successful');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUsern(false);

      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  }
  
  //obserer
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsern(user);
      
      } else {
        console.log("error");
      }
    });
  }, [])


  const allValues = {
    createUser,
    signInUser, googleLogin, logOut, usern, githubLogin,
  };


  return (
    <AuthContext.Provider value={allValues}>
      {props.children}
    </AuthContext.Provider>
  )
}
