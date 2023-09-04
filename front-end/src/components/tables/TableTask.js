import React,{ useState }  from 'react'
import { Link } from 'react-router-dom';
import {  Table, Tag,Popover,Button,Popconfirm, Typography, Input} from 'antd';
import { DeleteOutlined} from '@ant-design/icons';

import axios from 'axios';
import { toast } from "react-toastify";
import "./TableTask.css"


const { Title } = Typography;
const { Search } = Input;

const TableTask = ({  data, sprintData , authtoken, setTask,task,setClicked,clickedRef,createTaskButton}) => {
  const [selectionType, setSelectionType] = useState('checkbox');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (taskId) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API}/task/${taskId}`, {
        headers: {
          authtoken,
        },
      });
      if (res) {
        toast.success(`${res.data.message}`);
        setTask((prevTask) => prevTask.filter((task) => task._id !== taskId));
      }
    } catch (error) {
      return error;
    }
  };
  
  const handleSearch = (value) => {
    setSearchQuery(value);
  };
  const filteredData = data.filter((item) => {
    const searchQueryLower = searchQuery.toLowerCase();
   
    return (
      (item.title && item.title.toLowerCase().includes(searchQueryLower)) ||
      (item.typeOfTask && item.typeOfTask.toLowerCase().includes(searchQueryLower)) ||
      (item.createdAt && item.createdAt.toLowerCase().includes(searchQueryLower)) ||
      (item.duedate && item.duedate.toLowerCase().includes(searchQueryLower)) ||
      ((item.storyPoints && item.storyPoints.toString()) || '').includes(searchQueryLower) ||
      (item.transition && item.transition.toLowerCase().includes(searchQueryLower)) ||
      (item.assignee && item.assignee.some(
        (assignee) =>
          (assignee.name && assignee.name.toLowerCase().includes(searchQueryLower)) ||
          (assignee.email && assignee.email.toLowerCase().includes(searchQueryLower))
      ))
    );
  });
  
  

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (_, record) => (
        <Link to={`/project/${record.project}/${record._id}`}>{record.title}</Link>
      ),
    },
    { 
      title: 'Type of Task', 
      dataIndex: 'typeOfTask', 
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
    
    {
      title: 'Sprint',
      dataIndex: '_id',
      key: '_id',
      render: (_, record) => {
        const handleSprintClick = async(sprintId,recordId, authtoken) => {
          try {
            const res = await axios.get(`${process.env.REACT_APP_API}/sprint/${sprintId}/${recordId}`, {},{
                headers: {
                  authtoken
                },
              });
            
      
          
          if (res) {
            toast.success(`${res.data.message}`);
            setTask(prevTask => {
              const taskId = res.data.task._id;
              const updatedTask = prevTask.map(task => {
                if (task._id === taskId) {
                  const updatedTask = {...res.data.task};
                  updatedTask.assignee = task.assignee;
                  return updatedTask;
                }
                return task;
              });
              
              console.log(updatedTask);
              return updatedTask;
            });
            setClicked(prevState => !prevState);
          }
          
          } catch (error) {
            return error;
      
          }
        };
    
        return (
          Array.isArray(sprintData) && sprintData.length > 0 && (
            <Popover
              title="Sprints Available"
              content={sprintData.map(sprint => (
                <span
                  key={sprint._id}
                  onClick={() => handleSprintClick(sprint._id, record._id, authtoken)}
                  style={{ display: 'block', margin: '4px 0', cursor: 'pointer' }}
                >
                  {sprint.name}
                </span>
              ))}
            >
              <Button style={{ backgroundColor: "#40916c", color: "#ffffff", border: "none" }}>Move to sprint</Button>
            </Popover>
          )
          
        );
      },
    },
    {
      title: 'Action',
      dataIndex: '_id',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this task?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: 'red' }} />
        </Popconfirm>
      ),
    },
    
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1rem" }}>
      <div className="custom-table">
      {createTaskButton}
        <Title className="header-title" level={1} style={{ marginBottom: "20px", color: "#ffffff" }}>
      Backlog
        </Title>
    <Search
          placeholder="Search tasks"
          allowClear
          enterButton="Search"
          size="large"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: '20px' }}
        />

        {data && data.length > 0 && (
  <Table
    key={Date.now()}
    rowSelection={{
      type: selectionType,
      ...rowSelection,
    }}
    columns={columns}
    dataSource={filteredData.filter((item) => {
      return item.sprint === null || typeof item.sprint === 'undefined';
    })}
     
  />
)}



{/* {data && data.length > 0 && (
          <Table
            key={Date.now()}
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            columns={columns}
            dataSource={filteredData}
          />
        )} */}
      </div>
    </div>
  );
  
};

export default TableTask;






