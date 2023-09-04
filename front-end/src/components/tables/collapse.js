import { Collapse, Divider, Table, Tag, Popover, Button, Typography, Modal, Form, Input } from 'antd';
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import moment from 'moment';
import { useState } from 'react';
import { updateSprint, archiveSprint } from "../../functions/sprint"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { handleRemoveTask } from "../../functions/task"
import axios from 'axios';
import "./collapse.css"
import { useDispatch,useSelector  } from "react-redux";



const { Title } = Typography;

function SprintComponent(props) {
  const { data, authtoken, setSprintData, setTask, task ,createSprintButton, link} = props;
  const { Panel } = Collapse;
  const [visible, setVisible] = useState(false);
  const clickedRef = useRef(null);
  const [form] = Form.useForm();
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const openPanel = useSelector((state) => state.panel);

  const sprintDataRef = useRef();


  let dispatch = useDispatch();


  const showModal = (item) => {
    form.setFieldsValue(item); // set form fields with item data
    setVisible(true);
    clickedRef.current = item;
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const sprintData = { ...values };
        if (!clickedRef.current) {
          console.log('clickedRef.current is undefined');
          return;
        }
  
        const isEmptyFields = Object.values(sprintData).every((value) => value === null || value === '');
  
        if (isEmptyFields) {
          toast.error('Please fill in at least one field before updating the sprint');
          return;
        }
  
        return updateSprint(clickedRef.current._id, sprintData, authtoken);
      })
      .then((res) => {
        if (res.status === 200) {
          const updatedData = data.map((item) =>
            item._id === clickedRef.current._id ? { ...item, ...res.data.sprint } : item
          );
          setSprintData(updatedData);
          toast.success('Sprint updated');
        } else {
          toast.error('Sorry, could not update the sprint');
        }
        setStartDate(null);
        setEndDate(null);
        form.resetFields();
        setVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  
  // const handleOk = () => {
  //   form
  //     .validateFields()
  //     .then((values) => {
  //       const sprintData = { ...values };
  //       if (!clickedRef.current) {
  //         console.log('clickedRef.current is undefined');
  //         return;
  //       }
  //       return updateSprint(clickedRef.current._id, sprintData, authtoken);
  //     })
  //     .then((res) => {
     
  //       if (res.status === 200) {
        
  //         const updatedData = data.map((item) =>
  //           item._id === clickedRef.current._id ? { ...item, ...res.data.sprint } : item
  //         );
  //         setSprintData(updatedData);
  //         toast.success('Sprint updated');
  //       } else {
  //         toast.error('Sorry, could not update the sprint');
  //       }
  //       setStartDate(null)
  //       setEndDate(null)
  //       form.resetFields();
  //       setVisible(false);
  //     })
  //     .catch((info) => {
  //       console.log('Validate Failed:', info);
  //     });
  // };
  
  

  const handleCancel = () => {
    setVisible(false);
  };


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
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <Button type="danger" onClick={() => RemoveTask(record.sprint, record._id)}>
          Remove from sprint
        </Button>
      ),
    },
  ];



  function RemoveTask(sprintId, taskId) {
    handleRemoveTask(sprintId, taskId, authtoken)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Task successfully removed');

          const updatedData = data.map((sprint) => {
            if (sprint._id === sprintId) {
              const tasks = sprint.tasks.filter((task) => task._id !== taskId);
              return { ...sprint, tasks };
            }
            return sprint;
          });

          setSprintData(updatedData);

          setTask((prevTasks) => {
            console.log("prev", prevTasks)
            const updatedTasks = prevTasks && prevTasks.map((t) => {
              if (t._id === taskId) {
                return { ...t, sprint: null };
              }
              return t;
            });
            console.log("upd", updatedTasks)
            return updatedTasks;

          });



        } else {
          throw new Error('Failed to remove task from sprint');
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to remove task from sprint');
      });
  }


  const handleDeleteSprint = async (sprintId) => {
    Modal.confirm({
      title: 'Confirmation',
      content: 'Are you sure you want to delete this sprint?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          const res = await axios.delete(`${process.env.REACT_APP_API}/sprint/${sprintId}`, {
            headers: {
              authtoken,
            },
          });
          if (res.status === 200) {
            toast.success(`${res.data.message}`);
            setSprintData((prevSprint) => prevSprint.filter((sprint) => sprint._id !== sprintId));
  
            // Loop through the task array and set sprint property to null for tasks with matching sprintId
            setTask((prevTasks) =>
              prevTasks.map((task) => {
                if (task.sprint === sprintId) {
                  return {
                    ...task,
                    sprint: null,
                  };
                }
                return task;
              })
            );
          } else {
            throw new Error('Failed to delete sprint');
          }
        } catch (error) {
          console.error(error);
          toast.error('Failed to delete sprint');
        }
      },
      onCancel: () => {
        // Close the modal if canceled
      },
    });
  };



  const handleCompleteSprint = async (sprintId) => {
    try {
      const res = await axios.patch(`${process.env.REACT_APP_API}/sprint/complete/${sprintId}`, {}, {
        headers: {
          authtoken
        },
      });

      if (res) {
        // Toggle the completion status of the sprint
        setSprintData((prevSprints) =>
          prevSprints.map((sprint) => {
            if (sprint._id === sprintId) {
              return {
                ...sprint,
                sprintcompleted: !sprint.sprintcompleted
              };
            }
            return sprint;
          })
        );
      }
    } catch (error) {
      return error;
    }
  };


  const handleArchive = (sprintId) => {
    Modal.confirm({
      title: 'Confirm Archive',
      content: 'Are you sure you want to archive this sprint?',
      okText: 'Archive',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await archiveSprint(sprintId, authtoken);
          if (response && response.data) {
            setSprintData((prevSprints) =>
              prevSprints.filter((sprint) => sprint._id !== sprintId)
            );
            toast.success('Sprint archived');
          }
        } catch (error) {
          toast.error('Error archiving sprint:', error);
        }
      },
      onCancel: () => {
        
      },
    });
  };

  //panel change
  const handlePanelChange = (panelKey) => {

    dispatch({ type: "SET_OPEN_PANEL", payload: panelKey });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center",}}>
      <div className="custom-table">
      {createSprintButton}
      {link}
        <Title className="header-title" level={1} style={{ marginBottom: "20px", color: "#ffffff" }}>
          Sprint
        </Title>

        <Collapse accordion  activeKey={openPanel} // Set the activeKey prop to the openPanel state
          onChange={handlePanelChange} > 
          {data.map((item) => (
            <Panel
              header={
                <>
                <Title level={5}>
                  {item.name}{'     '}
                  {item.sprintcompleted && (
                    <Tag color="green">Completed</Tag>
                  )}
                </Title>
                    
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            
              <div>
              <Button
                type="primary"
                onClick={() => handleCompleteSprint(item._id)}
                style={{ marginRight: '10px', background: '#40916c' }}
              >
                {item.sprintcompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
              </Button>
              <Button type="primary" onClick={() => handleArchive(item._id)} style={{ marginRight: '10px', background: "#40916c" }}>Archive</Button>

                <Button type="primary" onClick={() => showModal(item)} style={{ marginRight: '10px', background: "#40916c" }}>Edit</Button>
                <Button type="danger" onClick={() => handleDeleteSprint(item._id)} style={{ background: "#f21b3f", color: "#ffffff" }}> Delete</Button>
              </div>
            </div>
            </>
              }
              key={item._id}
            >
 {item.start_date || item.end_date ? (
  <>
    {item.start_date && (
      <p>
        <strong>Start date:</strong> {moment(item.start_date).format('MMM DD, YYYY')}
      </p>
    )}
    {item.end_date && (
      <p>
        <strong>End date:</strong> {moment(item.end_date).format('MMM DD, YYYY')}
      </p>
    )}
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

        <Modal
          title="Edit Item"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form}>
            <Form.Item label="Goal" name="goal">
              <Input />
            </Form.Item>
            <Form.Item label="Start Date" name="start_date">
              <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
            </Form.Item>
            <Form.Item label="End Date" name="end_date">
              <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );

}

export default SprintComponent;
