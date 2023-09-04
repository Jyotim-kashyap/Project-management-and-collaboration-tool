
import React, { useState, useEffect } from 'react';
import { getAllArchived, unarchiveSprint } from '../../functions/sprint';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Collapse, Divider, Table, Tag, Popover, Button, Typography, Modal, Form, Input } from 'antd';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Link } from 'react-router-dom';



const { Title } = Typography;

function ArchivedSprints() {
  const { projectId } = useParams();
  const token = useSelector((state) => state.user.token);
  const [archivedSprints, setArchivedSprints] = useState([]);
  const { Panel } = Collapse;

 
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (_, record) => (
        <Link to={`/project/${record.project}/${record._id}`}>{record.title}</Link>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
    },
    {
      title: 'Due Date',
      dataIndex: 'duedate',
    },
    { 
      title: 'StoryPoint', 
      dataIndex: 'storyPoints',
    },
    {
      title: 'Transition',
      dataIndex: 'transition',
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (assignee) => (
        <div>
          <>
            {assignee.map((user) => (
              <Tag key={user._id}>{user.name ? user.name : user.email}</Tag>
            ))}
          </>
        </div>
      ),
    },
  
  ];

  useEffect(() => {
    const fetchArchivedSprints = async () => {
      try {
        const response = await getAllArchived(projectId, token);
        setArchivedSprints(response.data);
        console.log("archived sprints",response.data)
      } catch (error) {
        console.error('Error fetching archived sprints:', error);
      }
    };

    fetchArchivedSprints();
  }, [projectId, token]);

  const handleUnarchive = async (sprintId) => {
    try {
     const response = await unarchiveSprint(sprintId, token);
     console.log(response)
      if (response._id) {
        setArchivedSprints((prevSprints) =>
        prevSprints.filter((sprint) => sprint._id !== sprintId)
      )
      toast.success("Sprint unarchived successfully")

      }
      else if (response.status === 400)
        toast.error('Sprint unarchive failed');
      else if (response.status === 401)
        toast.error('Unauthorized');
      else if (response.status === 404)
        toast.error('Sprint not found');
      else if (response.status === 500)
        toast.error('Internal server error');
      else
        toast.error('Unknown error');
    
    } catch (error) {
      console.error('Error unarchiving sprint:', error);
    }
  };
return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12 mt-5">
          <div style={{ border: '1px solid #556B2F', padding: '20px', boxShadow: '0 0 10px #556B2F' }}>
            <Title className="header-title" level={1} style={{ color: "#ffffff", textAlign: 'center' }}>
              Archived Sprints
            </Title>
            <Collapse accordion>
          {archivedSprints.map((item) => (
         <Panel
         header={
           <div>
             <Title level={5}>
               {item.name}{'     '}
               {item.sprintcompleted && <Tag color="green">Completed</Tag>}
             </Title>
             <Button
               type="primary"
               style={{ backgroundColor: '#808000' }}
               onClick={() => {
                 handleUnarchive(item._id);
               }}
             >
            Restore
             </Button>
           </div>
         }
         key={item._id}
       >
              {item.start_date && item.end_date ? (
                <>
                  <p>
                    <strong>Start date:</strong> {moment(item.start_date).format('MMM DD, YYYY')}
                  </p>
                  <p>
                    <strong>End date:</strong> {moment(item.end_date).format('MMM DD, YYYY')}
                  </p>
                </>
              ) : (
                <Title level={5}>Edit to assign dates to your sprint</Title>
              )}
              <p>
                <strong>Goal:</strong> {item.goal}
              </p>
              <Table
                columns={columns}
                dataSource={item.tasks.map((task) => ({ ...task, key: task._id }))}
                pagination={false}
              />
            </Panel>
          ))}
        </Collapse>

          </div>
        </div>
      </div>
    </div>
  );
  
  
}

export default ArchivedSprints;
