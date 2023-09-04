
import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { CodeOutlined, ProfileOutlined, FileOutlined } from '@ant-design/icons';
import {
  getTaskByTransition
} from "../../functions/task";
import { useSelector } from "react-redux";
import "./ProjectDashboard.css";
import { useParams } from 'react-router-dom';




function ThirdCard({ tasks, cardStyle, name, projectId }) {
  

  const containerStyle = {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflowY: 'auto',
    ...cardStyle,
  };

  const titleStyle = {
    border: '1px solid #e8e8e8',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '8px',
    marginBottom: '8px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  };

  const contentStyle = {
    marginTop: '8px',
  };

  const getInitial = (email) => {
    if (email && email.length > 0) {
      return email[0].toUpperCase();
    }
    return '';
  };

  return (
    <div style={containerStyle}>
      <h3>{name}</h3>
      {tasks.map((task) => (
        <div key={task._id} style={titleStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h4>
            <Link to={`/project/${projectId}/${task._id}`}>{task.title}</Link>
          </h4>
            <p>Story Points: {task.storyPoints}</p>
          </div>
          <div style={contentStyle}>
            <p>Description: {task.description}</p>
            <p>
              <span className="assignee-initial-container">
                {task.assignee.map((assignee) => (
                  <span key={assignee.email} className="assignee-initial">
                    <span className="initial-text">{getInitial(assignee.email)}</span>
                    <span className="email-tooltip">{assignee.email}</span>
                  </span>
                ))}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}


function ProjectDashboard() {
  const cardStyle = {
    
    border: '1px solid #e8e8e8',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  const iconStyle = {
    fontSize: '32px',
    marginBottom: '8px',
  };
 
  const token = useSelector((state) => state.user.token); // auth token

  const location = useLocation();
  const projectId = location.pathname.split('/')[2];

  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const res = await getTaskByTransition(projectId, token);
        if (res.data) {
          setTaskData(res.data);
          console.log(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTaskData();
  }, [projectId, token]);

  return (
    <div className='page'>
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-md-4">
              <Link to={`/project/${projectId}/releasenotes`}>
                <Card size="default" className="mb-4" style={cardStyle}>
                  <CodeOutlined style={iconStyle} />
                  <Card.Meta title="Release notes" />
                </Card>
              </Link>
            </div>
            <div className="col-md-4">
              <Link to={`/project/${projectId}`}>
                <Card size="default" className="mb-4" style={cardStyle}>
                  <ProfileOutlined style={iconStyle} />
                  <Card.Meta title="Backlog" />
                </Card>
              </Link>
            </div>
            <div className="col-md-4">
              <Link to={`/project/${projectId}/report`}>
                <Card size="default" className="mb-4" style={cardStyle}>
                  <FileOutlined style={iconStyle} />
                  <Card.Meta title="Reports" />
                </Card>
              </Link>
            </div>
            <div className="col-md-4">
              {taskData.todo && (
                <ThirdCard projectId={projectId} tasks={taskData.todo} cardStyle={cardStyle} name={"Todo"} />
              )}
            </div>
            <div className="col-md-4">
              {taskData.inProgress && (
                <ThirdCard projectId={projectId} tasks={taskData.inProgress} cardStyle={cardStyle} name={"In Progress"}/>
              )}
            </div>
            <div className="col-md-4">
              {taskData.Done && (
                <ThirdCard projectId={projectId} tasks={taskData.Done} cardStyle={cardStyle} name={"Done"}/>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div> 
  );
}

export default ProjectDashboard;
