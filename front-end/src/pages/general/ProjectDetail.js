

import React, { useState, useEffect,useRef  } from "react";
import {  Layout,Modal, Tabs} from 'antd'; //1
import {
    createTask,getTask
  } from "../../functions/task";
import {
    createSprint,getSprint
  } from "../../functions/sprint";  
import { toast } from "react-toastify";
import { useParams } from 'react-router-dom';

import 
   TableTask
   from "../../components/tables/TableTask";
import Collapse from "../../components/tables/collapse";
import "./ProjectDetail.css"
import { Typography} from 'antd';
import { Link } from "react-router-dom";
import { useDispatch,useSelector  } from "react-redux";

const { Title } = Typography;

const { Header, Content, Footer, Sider } = Layout;

const { TabPane } = Tabs;


const ProjectDetail = () => {
  //hooks
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [sprintId, setSprintId] = useState(""); // for tasks

    const [sprint, setSprint] = useState("");
    const [sprintData, setSprintData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState([]);
    const [typeOfTask, setTypeOfTask] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false); //2
    const [isModalTwoVisible, setIsModalTwoVisible] = useState(false); //2
    const [clicked, setClicked] = useState(false);
    const activeTab = useSelector((state) => state.activeTab);


    let dispatch = useDispatch();
    const clickedRef = useRef(clicked);
   



   
   const  token  = useSelector((state) => ( state.user.token ));
   
   const {  id  } = useParams();
 
    useEffect(() => {
        loadTask();
   
      }, []);

      useEffect(() => {
     
        loadSprint()
    
      }, [clicked]);


      const loadTask = async() =>{
        getTask(id, token).then((res) => {
          res.data = res.data.map((item) => ({
            ...item,
            key: item._id 
          }))  
          setTask(res.data)
        })
       
      }

      const loadSprint = async() =>{
        // id as n projectId
        getSprint(id, token).then((res) => {
    
          res.data = res.data.map((item) => ({
            ...item,
            key: item._id 
          }))  
          setSprintData(res.data)
         
        })
       
      }      
      const handleSubmit = (e) => {
        e.preventDefault();
      
        setLoading(true);
        createTask(name, description, id, typeOfTask, token, sprintId)
          .then((res) => {
            setLoading(false);
            console.log(res)
            if (res.data && res.data._id) {
              setName("");
              setDescription("");
              setTypeOfTask("");
              setSprintId("");
              setTask(task.concat(res.data));
              toast.success(`"${res.data.title}" is created`);
      
              if (res.data.sprint) {
                const updatedSprintData = sprintData.map((sprint) => {
                  if (sprint._id === res.data.sprint) {
                    sprint.tasks.push(res.data);
                  }
                  return sprint;
                });
                setSprintData(updatedSprintData);
              }
             
            } else if (res.request.status === 409) {
              toast.error(res.response.data.message);
            }
          })
          .catch((err) => {
          
            setLoading(false);
        
              toast.error("Task creation failed");
         
          });
      };
      
      

      const handleSubmitSprint = (e) => {
        e.preventDefault();
        setLoading(true);
        createSprint(sprint, id, token)
          .then((res) => {
          
            setLoading(false);
            setSprint("");
            if (res.data && res.data._id) {
              setSprintData(sprintData.concat(res.data));
              toast.success(`"${res.data.name}" is created`);
            } else if (res.response.status == 409) {
              toast.error(res.response.data.message);
            
            }
          })
          .catch((err) => {
            console.log(err)
            setLoading(false);
            if (err.response && err.response.status === 409) {
              toast.error(err.response.data.message);
            } else {
              toast.error("Sprint creation failed");
            }
          });
      };
      const categoryForm = () => (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
              value={name}
              autoFocus
              required
            />
            <br />
            <label>Description</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              autoFocus
              required
            />
            <br />
            <label>Type of Task</label>
            <select
              className="form-control"
              onChange={(e) => setTypeOfTask(e.target.value)}
              value={typeOfTask}
              required
            >
              <option value="">Select a type</option>
              <option value="Task">Task</option>
              <option value="Bug">Bug</option>
              <option value="Story">Story</option>
            </select>
            <br />
            <label>Select a Sprint (Optional)</label>
            <select
              className="form-control"
              onChange={(e) => setSprintId(e.target.value)}
              value={sprintId}
            >
              <option value="">No sprint</option>
              {sprintData.map((sprint) => (
                <option key={sprint._id} value={sprint._id}>
                  {sprint.name}
                </option>
              ))}
            </select>
            <br />
            <button className="btn btn-outline-primary">Save</button>
          </div>
        </form>
      );
      

      const sprintForm = () => (

        <form onSubmit={handleSubmitSprint}>
          <div className="form-group">
            <label>Summary</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setSprint(e.target.value)}
              value={sprint}
              autoFocus
              required
            />
            <br />
            <button className="btn btn-outline-primary">Save</button>
          </div>
        </form>
      );
   //tab change      
      const handleTabChange = (key) => {
        dispatch({
          type: "SET_ACTIVE_TAB",
          payload: key,
        });
      };


      return (
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-12">
             
    
                  <Modal
                    title="Sprint"
                    visible={isModalTwoVisible}
                    onCancel={() => setIsModalTwoVisible(false)}
                    footer={null}
                  >
                    {sprintForm()}
                  </Modal>
                  <Modal title="Task" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
                {categoryForm()}
              </Modal>
    
              <div className="center-tabs p-2 mt-3">
                <Tabs defaultActiveKey={activeTab} centered   onChange={handleTabChange}>
                  <TabPane
                    tab={
                      <span className="custom-tab">Sprints</span>
                    }
                    key="1"
                  
                  >
                    <Collapse
                      data={sprintData}
                      task={task}
                      setTask={setTask}
                      authtoken={token}
                      setSprintData={setSprintData}
                      createSprintButton={
                        <button
                          className="button-33"
                          onClick={() => setIsModalTwoVisible(true)}
                        >
                          Create Sprint
                        </button>
                      }
                      link={         <Link to={`/project/${id}/archived`}>
                      <button className="button-33">View archived</button>
                     </Link>}
                    />
                  </TabPane>
                  <TabPane
                    tab={
                      <span className="custom-tab">Backlog</span>
                    }
                    key="2"
                  >
                    <TableTask
  data={task}
  sprintData={sprintData}
  authtoken={token}
  setTask={setTask}
  task={task}
  setClicked={setClicked}
  clickedRef={clickedRef}
  createTaskButton={
    <button
      className="button-33"
      onClick={() => setIsModalVisible(true)}
    >
      Create Task
    </button>
  }
/>

                  </TabPane>

                </Tabs>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

}

export default ProjectDetail;

