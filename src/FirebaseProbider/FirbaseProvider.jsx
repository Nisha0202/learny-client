import React, { createContext, useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup } from "firebase/auth";
export const AuthContext = createContext(null);
import { GoogleAuthProvider, updateProfile } from "firebase/auth";
import { signOut } from "firebase/auth";
import { reload } from "firebase/auth";
import auth from '../firebase/firebase.config';
import { GithubAuthProvider } from "firebase/auth";

export default function FirbaseProvider(props) {

  const googleprovider = new GoogleAuthProvider();
  const githubprovider = new GithubAuthProvider();

  const [usern, setUsern] = useState(false);


  const createUser = (email, password, username, image, role) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Signed in 
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: username,
          photoURL: image,
          // Added role to user profile
          role: role
        });
        const updatedUser = await user.reload();
        setUsern(updatedUser); 
        resolve(updatedUser); 
        reload(usern);
      } catch (error) {
        console.log(error.message, error.code);
        reject(error); 
      }
    });
  };
  

  
  
  const signInUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Signed in
      const user = userCredential.user;
      setUsern(user); // Update usern state
      // const token = await user.getIdToken(); // Get the JWT
      // localStorage.setItem('token', token); // Store the JWT in local storage

    } catch (error) {
      console.error('Error signing in:', error);
      throw error; 
    }
  };


  //save user info on social login
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
  

  const googleLogin = () => {
    return (navigate) => {
      signInWithPopup(auth, googleprovider)
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
          setTimeout(function() {
            window.location.reload();
        }, 1000); 
        
        })
        .catch((error) => {
          console.error('Google login error:', error);
        });
    };
  };

  const githubLogin = () => {
    return (navigate) => {
      signInWithPopup(auth, githubprovider)
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
          setTimeout(function() {
            window.location.reload();
        }, 1000); // 1000 milliseconds = 1 second
        
        })
        .catch((error) => {
          console.error('Github login error:', error);
        });
    };
  };

  //  const googleLogin = () => {
  //   return (navigate) => {
  //   signInWithPopup(auth, googleprovider)
  //     .then(async (result) => {
  //       // setUsern(result.user); 
  //       result.user.role = 'student';
  //       localStorage.setItem('role', result.user.role);

  //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //       const accessToken = credential.accessToken;
  //       setUsern(result.user);
  //       const token = await result.user.getIdToken(); // Get the JWT
  //       localStorage.setItem('token', token); // Store the JWT in local storage

  //       navigate("/");
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       const email = error.email;
  //     });};
  // };
  
  // const githubLogin = () => {
  //   return (navigate) => {
  //   signInWithPopup(auth, githubprovider)
  //     .then(async (result) => {
  //      result.user.role = 'student';
  //      localStorage.setItem('role', result.user.role);

  //     const credential = GithubAuthProvider.credentialFromResult(result);
  //     const accessToken = credential.accessToken;
  //     setUsern(result.user);
  //     const token = await result.user.getIdToken(); // Get the JWT
  //     localStorage.setItem('token', token); // Store the JWT in local storage
  //   })
  //   .catch((error) => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     const email = error.email;
  //   });
  // };
  // };
  

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
