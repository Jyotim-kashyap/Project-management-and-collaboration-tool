import React, { useState } from 'react';
import { Collapse, Form, Input, Button, message,Typography } from 'antd';
import {
  roomCreate
} from "../../functions/room";
import "./ScrumPoker.css"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from '@ant-design/icons';


const { Title } = Typography;
const { Panel } = Collapse;

function ScrumPoker() {
  const history = useNavigate();
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = async () => {
    try {
      roomCreate().then(e => {
        const roomId = e.data.room.name;
        
        window.location.href = `/scrumpoker/${roomId}`;

      })
    } catch (error) {
      console.error(error);
      message.error('Failed to create room');
    }
  };

  const handleJoinRoom = async (values) => {
    const roomId = values.roomId;
   history(`/scrumpoker/${roomId}`);
  };

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  return (
  

    <div className="container-fluid" style={{  marginTop: "-10rem" }}>

   <div className="row">
      <div className="col-md-1" style={{ height: "100vh", overflow: "auto" }}>
     
      </div>
      <div className="col-md-10 d-flex flex-column justify-content-center align-items-center">
        <div className="content-container">

        <Link to="/project" className="mb-3">
            <Button className="button-37 p-1" type="primary" icon={<ArrowLeftOutlined />}>
              Return
            </Button>
          </Link>
        <Title  className="header-title" level={1} style={{ color: "#ffffff" }}>
                  ScrumPoker
                </Title>
      <Collapse >
        <Panel header={  <Title  level={3} style={{ color: "#A4D0A4", }}>
                  Create a Room
                
                </Title>} key="create-room">
          <Button className='button-37 p-2' type="primary" onClick={handleCreateRoom}>
            Create room
          </Button>
        </Panel>
        <Panel header={<Title  level={3} style={{ color: "#A4D0A4", }}>
                Join a Room
                
                </Title>} key="join-room">
          <Form onFinish={handleJoinRoom}>
            <Form.Item
              name="roomId"
              rules={[{ required: true, message: 'Please enter a room ID' }]}
            >
              <Input placeholder="Room ID" onChange={handleRoomNameChange} />
            </Form.Item>
            <Form.Item>
              <Button className='button-37 p-2' type="primary" htmlType="submit">
                Join room
              </Button>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
      </div>
    </div>
      </div>
    </div>

  );
}

export default ScrumPoker;
