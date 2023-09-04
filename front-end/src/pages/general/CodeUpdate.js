import React, { useState, useEffect } from 'react';
import {Popconfirm , Typography,Tag,Button, Modal, Form, Input, Select, DatePicker ,Table,Divider,AutoComplete} from 'antd';
import AdminNav from '../../components/nav/AdminNav';
import {
  create,getAll,handleDelete
} from "../../functions/codeUpdate";  
import {
  getUsers
} from "../../functions/project";
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import moment from 'moment';
import { toast } from "react-toastify";
import { GetOne} from "../../functions/task";
import "./CodeUpdate.css"
import { DeleteOutlined} from '@ant-design/icons';


const { Title } = Typography;
const { Option } = Select;

const CodeUpdate = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.user.token);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedDevId, setSelectedDevId] = useState('');

  const [formData, setFormData] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll(id, token);
        setData(response.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchData();
  }, [id, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers(token);
        setUsers(response.data);
       
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchData();
  }, [token]);

 

  const generateOptions = (users) => {
    return users.map((user) => ({
      value: user.value,
      id: user.id,
    }));
  };
  
const handleAutoCompleteChange = (value) => {
  const selectedUser = users.find((user) => user.value === value);
  setSelectedUserId(selectedUser ? selectedUser.id : '');
};

const handleAutoCompleteChangeDev = (value) => {
  const selectedUser = users.find((user) => user.value === value);
  setSelectedDevId(selectedUser ? selectedUser.id : '');
};
const handleOk = async () => {

  try {
    const values = await form.validateFields(); // Validate
    console.log(values, selectedDevId,selectedUserId)
    const response = await create(id, token, {
      project: id,
      requestDate: moment(values.requestDate).format('YYYY-MM-DD'),
      developer: selectedDevId,
      changeDetails: values.changeDetails,
      changePath: values.changePath,
      priority: values.priority,
      systemAdmin: selectedUserId,
      deploymentDate: moment(values.deploymentDate).format('YYYY-MM-DD'),
    });

    if (response && response.data) {
      setVisible(false);
      setData([...data, response.data]);
      toast.success('New update created');
      form.resetFields(); // Reset the form 
    } else if (response && response.error) {
      toast.error(`Error creating new update: ${response.error}`);
    } else {
      toast.error('Error creating new update: Response data is missing');
    }
  } catch (error) {
    toast.error(`Error creating new entry. Please fill all the values`);
  }
};




  const handleCancel = () => {
    setVisible(false);
    form.resetFields(); // Reset
  };
  const showModal = () => {
    setVisible(true);
  };
  const columns = [
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
    },
    {
      title: 'Developer',
      dataIndex: 'developer',
      key: 'developer',
      render: (user) => (
        <div>
          <Tag key={user._id}>{user.name ? user.name : user.email}</Tag>
        </div>
      ),
    },
    {
      title: 'Change Details',
      dataIndex: 'changeDetails',
      key: 'changeDetails',
    },
    {
      title: 'Change Path',
      dataIndex: 'changePath',
      key: 'changePath',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
    },
    {
      title: 'System Admin',
      dataIndex: 'systemAdmin',
      key: 'systemAdmin',
      render: (user) => (
        <div>
          <Tag key={user._id}>{user.name ? user.name : user.email}</Tag>
        </div>
      ),
    },
    {
      title: 'Deployment Date',
      dataIndex: 'deploymentDate',
      key: 'deploymentDate',
    },
    {
      title: 'Action',
      dataIndex: '_id',
      key: '_id',
      render: (_, record) => (
        <Popconfirm
        title="Are you sure you want to delete this record?"
        onConfirm={() => envelope(id, record, token)}
        okButtonProps={{ loading }} // Pass the loading prop here
        disabled={loading} // Add disabled prop to disable the button when loading is true
      >
        <Button type="link" danger>
          <DeleteOutlined />
        </Button>
      </Popconfirm>
      
      ),
    },
  ];
  

  // const envelope = async (id, record, token) => {
  //   handleDelete(id, record._id, token)
  //     .then((e) => {
  //       setLoading(false);
  //       toast.success(`${e.data.message}`);
  //       deleteFromDataHook(record._id); 
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       toast.error(err);
  //     });
  // };
  const envelope = async (id, record, token) => {
    setLoading(true); // Set loading to true before the delete operation starts
    try {
      const response = await handleDelete(id, record._id, token);
      toast.success(response.data.message);
      deleteFromDataHook(record._id);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false); // Set loading to false after the delete operation is complete, regardless of success or error
    }
  };
  
  const deleteFromDataHook = (id) => {
    setData((prevData) => prevData.filter((item) => item._id !== id));
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
    
        <div className="col-md-10 ">
      
                <div className="row">
            <div className="col-md-12 d-flex justify-content-center">
              <div className="table-container mt-5">
              <Title  className="header-title" level={1} style={{ color: "#ffffff" }}>
               Release Notes
                </Title>            
                  </div>
                  
            </div>
          </div>        
          <div className="pt-3" style={{ marginLeft: '10rem' }}>
            <button className="button-33" type="primary" onClick={showModal}>
              Add
            </button>
          </div>
          <Modal
          title="Release note"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          className="custom-modal"
          footer={[
          
            <Button className="btn btn-outline-primary" key="ok" type="primary" onClick={handleOk}>
       Save
            </Button>
          ]}
        >
         <Form
         form={form}
  onValuesChange={(changedValues, allValues) => {
    setFormData(allValues);
  }}
>
  <div className="row">
    <div className="col-md-6">
      <Form.Item
        label="Request Date"
        name="requestDate"
        rules={[{ required: true, message: 'Please select a request date' }]}
      >
        <DatePicker />
      </Form.Item>
    </div>
    <div className="col-md-6">
      <Form.Item
        label="Developer"
        name="developer"
        rules={[{ required: true }]}
      >
        <AutoComplete
          options={generateOptions(users)}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={handleAutoCompleteChangeDev}
        />
      </Form.Item>
    </div>
  </div>

  <div className="row">
    <div className="col-md-12">
      <Form.Item
        label="Change Details"
        name="changeDetails"
        rules={[{ required: true }]}
      >
        <Input.TextArea />
      </Form.Item>
    </div>
  </div>

  <div className="row">
    <div className="col-md-6">
      <Form.Item
        label="Change Path"
        name="changePath"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </div>
    <div className="col-md-6">
      <Form.Item
        label="Priority"
        name="priority"
        rules={[{ required: true }]}
      >
        <Select >
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
        </Select>
      </Form.Item>
    </div>
  </div>

  <div className="row">
    <div className="col-md-6">
      <Form.Item
        label="System Admin"
        name="systemAdmin"
        rules={[{ required: true }]}
      >
        <AutoComplete
          options={generateOptions(users)}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={handleAutoCompleteChange}
        />
      </Form.Item>
    </div>
    <div className="col-md-6">
      <Form.Item
        label="Deployment Date"
        name="deploymentDate"
        rules={[{ required: true }]}
      >
        <DatePicker />
      </Form.Item>
    </div>
  </div>
</Form>

        </Modal>
          <div className="row">
            <div className="col-md-12 d-flex justify-content-center">
              <div className="table-container">
                <Table dataSource={data} columns={columns} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

export default CodeUpdate;








































