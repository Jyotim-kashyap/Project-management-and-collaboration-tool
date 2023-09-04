
// import React, { useState,useEffect } from "react";
// import { auth } from "../firebase";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
// import { Button } from "antd";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";




// const Register = () => {
//   const [email, setEmail] = useState("");
//   const { user } = useSelector(( state ) => ({ ...state})); // geting the user out of redux state
//   const history =  useNavigate();

//     //hook
//     useEffect(() => {
//       if (user && user.token) {
//          history('/');
//       } 
//    },[user])

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const config = {
//       url: "http://localhost:3000/register/complete",
//       handleCodeInApp: true,
//     };

//    const auth = getAuth();
// sendSignInLinkToEmail(auth, email, config)
//   .then(() => {
//     // The link was successfully sent. Inform the user.
//     // Save the email locally so you don't need to ask the user for it again
//     // if they open the link on the same device.
//     // window.localStorage.setItem('emailForSignIn', email);
//     toast.success(`Email is sent to ${email}. Click the link to complete your registration`, {  position: toast.POSITION.RIGHT_CENTER})
    
      
//        window.localStorage.setItem("emailForRegistration", email);
//        // clear state
//        setEmail("");
//   })
 
 
//   };

//   const registerForm = () => (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="email"
//         className="form-control"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         autoFocus
//       />
//       <br/>
//       <Button  onClick={handleSubmit} type="primary" className="mb-3" block shape="round" size="large">
//         Register
//       </Button>
     

//     </form>
//   );

//   return (
//     <div className="container p-5">
//       <div className="row">
//         <div className="col-md-6 offset-md-3">
//           <h4>Register</h4>
          
//           {registerForm()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const { user } = useSelector((state) => ({ ...state }));
  const history = useNavigate();

  useEffect(() => {
    if (user && user.token) {
      history("/");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };

    const auth = getAuth();
    sendSignInLinkToEmail(auth, email, config)
      .then(() => {
        toast.success(`Email is sent to ${email}. Click the link to complete your registration`, {
          position: toast.POSITION.RIGHT_CENTER,
        });

        window.localStorage.setItem("emailForRegistration", email);
        setEmail("");
      })
      .catch((error) => {
        console.log("Error sending registration link:", error);
        toast.error("Failed to send registration email. Please try again.", {
          position: toast.POSITION.RIGHT_CENTER,
        });
      });
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />
      <br />
      <Button onClick={handleSubmit} type="primary" className="mb-3 login-form-button" block shape="round" size="large">
        Register
      </Button>
    </form>
  );

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
        <img src={process.env.PUBLIC_URL + "/login.avif"} alt="My Image" />     
           </div>
        <div id="login-form">
          <p className="form-title">Register</p>
          <div className="form-content">
          {registerForm()}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
