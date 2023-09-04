
import React, { useState,useEffect } from "react";
import "./Login.css"

import { auth, googleAuthProvider } from "../firebase";
import { toast } from "react-toastify";
import { Form, Input, Checkbox, Button } from 'antd';
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";



const createOrUpdateUser = async (authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/create-or-update-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};




const Login = () => {
  const history = useNavigate();
  const [email, setEmail] = useState("jyotimkashyap234@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(( state ) => ({ ...state})); // geting the user out of redux state


    //hook
    useEffect(() => {
      if (user && user.token) {
         history('/project');
      } 
   },[user])

  let dispatch = useDispatch();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.table(email, password);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      // console.log(result);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult(); //getting the token
      
      createOrUpdateUser(idTokenResult.token).then(
       (res) => { dispatch({
        type: "LOGGED_IN_USER",
        payload: {
          name: res.data.name,
          email: res.data.email,
          token: idTokenResult.token,
         _id: res.data._id,
        },
      });}
      ).catch()
      
    
      history("/project");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        createOrUpdateUser(idTokenResult.token).then(
          (res) => { dispatch({
           type: "LOGGED_IN_USER",
           payload: {
             name: res.data.name,
             email: res.data.email,
             token: idTokenResult.token,
            _id: res.data._id,
           },
         });}
         ).catch()
        history("/project");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };
  const handleRegister = () => {
 
    history('/register');
  };
  

  return (
 
<div className="login-page">
  <div className="login-box">
    <div className="illustration-wrapper">
    <img src={process.env.PUBLIC_URL + "/login.avif"} alt="My Image" />
    </div>
    <Form
      name="login-form"
      initialValues={{ remember: true }}
      onSubmit={handleSubmit}    >
      <p className="form-title">Welcome back</p>
      <p>Login to the Dashboard</p>
      <Form.Item
  name="email"
  rules={[{ required: true, message: 'Please input your user email!' }]}
>
<input
    type="email"
    className="form-control"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Your email"
    autoFocus
  />      </Form.Item>
<Form.Item
  name="password"
  rules={[{ required: true, message: 'Please input your password!' }]}
>
  <input
    type="password"
    className="form-control"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Your password"
  />
</Form.Item>

<Form.Item style={{ marginBottom: '5px' }}>
  <Button
    onClick={handleSubmit}
    type="primary"
    block
    className="mb-3 login-form-button"
    shape="round"
    icon={<MailOutlined />}
    disabled={!email || password.length < 6}
  >
    Login with Email/Password
  </Button>
</Form.Item>

<Form.Item style={{ marginBottom: '5px' }}>
  <Button
    onClick={googleLogin}
    type="danger"
    className="mb-3 google-button"
    block
    shape="round"
    icon={<GoogleOutlined />}
  >
    Login with Google
  </Button>
</Form.Item>

<Form.Item>
  <Link to="/register" className="mb-3">
    Don't have an account? Register
  </Link>
</Form.Item>

    </Form>
  </div>
</div>

          )
       

};

export default Login;
