

import React, { useState, useEffect } from 'react';
import { Typography, message ,Card, Row, Col, List,Avatar,Button,Form, Select, InputNumber } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import axios from "axios";
import "./SprintPoker.css"
const { Title, Text } = Typography;

const { Option } = Select;

function SprintPoker({ socket }) {
  const { name } = useParams();
  const [selectedCard, setSelectedCard] = useState([]);
  const userId = useSelector((state) => state.user._id);
  const userEmail = useSelector((state) => state.user.email);
  const [showCardValues, setShowCardValues] = useState(false);
  const [copied, setCopied] = useState(false);
  const [updatedRoom, setUpdatedRoom] = useState({});
  //NEW\
  const [projects, setProjects] = useState([]);
const [tasks, setTasks] = useState([]);
const [selectedProject, setSelectedProject] = useState(null);
const [selectedTask, setSelectedTask] = useState(null);
const [estimate, setEstimate] = useState(0);
  //NEW\


//new
  useEffect(() => {
    // Fetch projects from the server
    const fetchProjects = async () => {
      try {
     
        const response = await axios.get(`${process.env.REACT_APP_API}/project/${userId}`);
        const projectData = response.data;
        setProjects(projectData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
  
    fetchProjects();
  }, []);





  const handleProjectChange = async (value) => {
    setSelectedProject(value);
    setSelectedTask(null);
  console.log("this", value)
    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/task/list`, {
     projectId : value
      });
      const taskData = response.data;
      setTasks(taskData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };


  const handleTaskChange = (value) => {
    setSelectedTask(value);
  };

  const handleEstimateChange = (value) => {
    setEstimate(value);
  };

  const handleSubmit = async () => {
    try {
      // Perform the Axios request with the form values
      const response = await axios.put(`${process.env.REACT_APP_API}/task/${selectedTask}`, {
       task : {
        storyPoints : estimate
       }
      });
  
      // Check the response status and show success message
      if (response.status === 200) {
        toast.success('Form submitted successfully');
      } else {
        message.error('Form submission failed');
      }
    } catch (error) {
      // Handle error responses
      if (error.response) {
        // The request was made and the server responded with a status code
        message.error(`Error: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        message.error('No response received from the server');
      } else {
        // Something happened in setting up the request that triggered an error
        message.error('Error occurred while submitting the form');
      }
    }
  
    // Reset the form fields
    setSelectedProject(null);
    setSelectedTask(null);
    setEstimate(0);
  };
  
  //new








  useEffect(() => {
    function handleNewUser({ user, updatedRoom }) {
   
      toast.success(`${user} joined the room`);

      setUpdatedRoom(updatedRoom);
    }

    socket.on('message', handleNewUser);

    return () => {
      socket.off('message', handleNewUser);
    };
  }, []);

  
  const handleCopy = () => { // handling the copy to clipboard fuctionality here
    setCopied(true);
   
  };





  async function toggleVisibility() {
    // setShowCardValues((prev) => {
    //   socket.emit("reveal", !prev);
    //    return !prev
    // });
    try {
      const res = await axios.patch(`${process.env.REACT_APP_API}/scrumpoker/${name}/visibility`, {},{
        
        });
      
   
    if (res) {
      setUpdatedRoom(res.data.room);
 
    socket.emit("reveal", res.data.room);

    }

    } catch (error) {
      return error;

    }
  }

  const fibonacci = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55];


  function handleCardClick(value) {
  
    // setSelectedCard(value);
    socket.emit('card-selected', { userId, name, value, userEmail });


  }


  useEffect(() => {
    
   
  
      function handleCardSelected(room, userEmail) {
        setSelectedCard(room.results)
        toast.success(`${userEmail} has selected`)
      }
    
   

    
    socket.on("card-selected", handleCardSelected);
    return () => {
      socket.off("card-selected", handleCardSelected);
    };
  }, [socket]);
  
  useEffect(() => {
    socket.on("reveal", (showCardValues) => {
      // setShowCardValues(showCardValues)
      setUpdatedRoom(showCardValues);

    })
   },[])
  
  useEffect(() => {

    socket.emit('join-room', { userId, name, userEmail });
    return () => {
      socket.off('join-room');
    };
  }, []);


 


return (
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <Title className='header-title' style={{ color:'#fff',marginBottom:'0px',marginTop:'0px'}} level={3}>{name}</Title>
            <div className='m-4' style={{ display: 'flex', justifyContent: 'center' }}>
              <CopyToClipboard text={name} onCopy={handleCopy}>
                <Button type="link">
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
              </CopyToClipboard>
              <Text type="secondary">
                Use the name to let others join your room
              </Text>
            </div>
          </div>
          <div className="card-body">
            <Row gutter={[16, 16]}>
              {fibonacci.map((value) => (
                <Col key={value} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    className={`${selectedCard === value ? 'selected' : ''}`}
                    onClick={() => handleCardClick(value)}
                  >
                    {value}
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="mt-5">
              <button className='button-88' onClick={toggleVisibility}>Toggle</button>
              <Title className='mt-4' level={4}>Users :</Title>
  
<div className="row">
  {Array.isArray(updatedRoom.users) &&
    updatedRoom.users.map((user) => {
      const cardDescription =
        updatedRoom.visibility ? (
          Array.isArray(selectedCard) &&
          selectedCard.find((card) => card.userEmail === user.email)
        ) : (
          "hidden"
        );

      return (
        <Col key={user.email} span={24}>
          <List.Item className="selected-card border d-flex align-items-center justify-content-center mb-3 bg-light">
            <div className="text-center">
              <List.Item.Meta
                title={user.email}
                description={cardDescription ? cardDescription.estimate : "hidden"}
              />
            </div>
          </List.Item>
        </Col>
      );
    })}
</div>


            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
  <div className="card">
    <div className="card-body">
      <Form onFinish={handleSubmit}>
        <Form.Item label="Select Project">
          <Select value={selectedProject} onChange={handleProjectChange}>
            {projects.map((project) => (
              <Option key={project._id} value={project._id}>
                {project.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Select Task">
          <Select value={selectedTask} onChange={handleTaskChange}>
            {tasks.map((task) => (
              <Option key={task._id} value={task._id}>
                {task.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="StoryPoint">
          <InputNumber value={estimate} onChange={handleEstimateChange} />
        </Form.Item>
        <Form.Item>
          <Button class="button-88" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  </div>
</div>
    </div>
  </div>
);


}


export default SprintPoker;









            {/* <div className="row">
                {Array.isArray(updatedRoom.users) && updatedRoom.users.map((user) => {
                  const selectedUserCard = Array.isArray(selectedCard) && selectedCard.find((card) => card.userEmail === user.email);
                  const cardDescription = selectedUserCard
                    ? (showCardValues ? selectedUserCard.estimate : "hidden")
                    : null;

                  return (
                    <Col key={user.email} span={24}>
                      <List.Item className="selected-card border d-flex align-items-center justify-content-center mb-3 bg-light">
                        <div className="text-center">
                          <List.Item.Meta
                            title={user.email}
                            description={cardDescription}
                          />
                        </div>
                      </List.Item>
                    </Col>
                  );
                })}
              </div> */}

{/* <div className="row">
  {Array.isArray(updatedRoom.users) &&
    updatedRoom.users.map((user) => {
      const selectedUserCard =
        Array.isArray(selectedCard) &&
        selectedCard.find((card) => card.userEmail === user.email);
      const cardDescription =
        selectedUserCard && updatedRoom.visibility
          ? selectedUserCard.estimate
          : "hidden";

      return (
        <Col key={user.email} span={24}>
          <List.Item className="selected-card border d-flex align-items-center justify-content-center mb-3 bg-light">
            <div className="text-center">
              <List.Item.Meta
                title={user.email}
                description={cardDescription}
              />
            </div>
          </List.Item>
        </Col>
      );
    })}
</div> */}





