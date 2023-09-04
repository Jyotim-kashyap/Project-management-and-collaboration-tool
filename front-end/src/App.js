import React, {useState,  useEffect } from "react";
import { useNavigate,Routes, Route } from "react-router-dom";
import { currentUser } from "./functions/auth";
import { io } from 'socket.io-client';



//pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/Home'
import RegisterComplete from "./pages/auth/RegisterComplete";
import ForgotPassword from './pages/auth/ForgotPassword'
import Projects from './pages/general/Projects'
import ProjectDetail from './pages/general/ProjectDetail'
import TaskDetail from './pages/general/TaskDetail'
import CodeUpdate from './pages/general/CodeUpdate'
import Dashboard from './pages/general/Dashboard'
import ScrumPoker from './pages/general/ScrumPoker'
import Room from './pages/general/Room'
import Report from './pages/general/Report'
import ProjectDashboard from './pages/general/ProjectDashboard'
import ArchivedSprints from './pages/general/ArchivedSprints'



//components
import Header from './components/nav/Header'
import UserRoute from "./components/routes/UserRoute";


//dependencies
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './pages/firebase'
import { useDispatch } from 'react-redux'



const App = () => {
  const dispatch = useDispatch()
  
  //checking firebase auth state
  useEffect(() => {
 const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if(user) {
      const idTokenResult = await user.getIdTokenResult()
     console.log('user',user)
     currentUser(idTokenResult.token).then(
      (res) => { dispatch({
       type: "LOGGED_IN_USER",
       payload: {
         name: res.data.name,
         email: res.data.email,
         token: idTokenResult.token,
        _id: res.data._id,
       },
     });}
     ).catch(e => console.log(e))
    }
 })
 //clean uup
 return () => unsubscribe()
  },[]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const URL =  `${process.env.REACT_APP_SOCKET_URL}`
   
    const newSocket = io(URL, {
      pingInterval: 5000,     // Set the interval at which to send ping packets (in milliseconds)
      pingTimeout: 10000      // Set the timeout for a client to respond to ping packets (in milliseconds)
    });


    setSocket(newSocket);
  
    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!socket) {
    return <div>Loading...</div>;
  }



  return (
    <>
    <Header />
    <ToastContainer />
    <div className="app-container">

    <Routes>
    <Route exact path="/" element={<Home/>}/>
    <Route exact path="/register" element={<Register/>}/>
    <Route exact path="/register/complete" element={<RegisterComplete/>}/>
    <Route exact path="/login" element={<Login/>}/>
    <Route exact path="/forgot/password" element={<ForgotPassword/>}/>
    <Route exact path="/project" element={( <UserRoute><Projects/></UserRoute>)}/>
    <Route exact path="/project/:id" element={( <UserRoute><ProjectDetail/></UserRoute>)}/>
    <Route exact path="/project/:id/:taskid" element={( <UserRoute><TaskDetail/></UserRoute>)}/>
    <Route exact path="/project/:id/releasenotes" element={( <UserRoute><CodeUpdate/></UserRoute>)}/>
    <Route exact path="/dashboard" element={( <UserRoute><Dashboard/></UserRoute>)}/>
    <Route exact path="/scrumpoker" element={( <UserRoute><ScrumPoker/></UserRoute>)}/>
    <Route exact path="/scrumpoker/:name" element={( <UserRoute><Room socket={socket}/></UserRoute>)}/>
    <Route exact path="/project/:id/report" element={( <UserRoute><Report/></UserRoute>)}/>
    <Route exact path="/project/:id/projectdashboard" element={( <UserRoute><ProjectDashboard/></UserRoute>)}/>
    <Route exact path="/project/:projectId/archived" element={( <UserRoute><ArchivedSprints/></UserRoute>)}/>

    </Routes>
   

    </div>
   </>
  );
}

export default App;
