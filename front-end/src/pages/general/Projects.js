import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Table, Input, Button, Select, AutoComplete, Typography, Modal } from "antd";
import {
  createCategory,
  getCategories,
  removeCategory,
  sendRequest,
  getUsers,
  getMemberProjects,
  getUserTask
} from "../../functions/project";
import { Link } from "react-router-dom";
import "./Project.css"
import { PlusCircleOutlined ,EyeOutlined} from "@ant-design/icons";
import AdminNav from "../../components/nav/AdminNav";

import { Pagination } from "antd";


const { Title } = Typography;

const { Option } = Select;

const Project = () => {
  const id = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.user.token);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const [memberProjects, setMemberProjects] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Number of users  per page
  

  useEffect(() => {
    loadCategories();
    loadUsers();
    fetchMemberProjects();
    fetchUserTasks();
  }, []);


  const handleAddUserClick = () => {
    setAddUserModal(true);
  };

  const fetchUserTasks = async () => {
    try {
      const response = await getUserTask(id, token);
      const { data, error, message } = response;

      if (error) {
        console.error("Failed to fetch user tasks:", error);
      } else if (message && message === "User has no assigned tasks") {

        setUserTasks([]);
      } else {
        setUserTasks(data.tasks);
      }
    } catch (error) {
      console.error("Failed to fetch user tasks:", error);
    }
  };

  const fetchMemberProjects = async () => {
    try {
      const response = await getMemberProjects(id, token);
      const { data, error } = response;

      if (error) {
        console.error("Failed to fetch member projects:", error);
      } else {
        setMemberProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch member projects:", error);
    }
  };




  const loadCategories = () =>
    getCategories(token, id).then((c) => setCategories(c.data));

  const loadUsers = () =>
    getUsers(token).then((c) => setUsers(c.data))

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCategory(name, token, id)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is created`);
        loadCategories(); // Reload categories after successful creation
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err === 400) toast.error(err);
      });
  };

  const handleRemove = (slug) => { };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setAddUserModal(false)
  };


  const handleSendRequest = (e) => {
    e.preventDefault();
    sendRequest(selectedCategory, email, token)
      .then((res) => {

        if (res.status === 404) {
          toast.error(res.data.message);
        }
        toast.success(res.data.message);
        setSelectedCategory("");
        setEmail("");
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data.error);
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Link to={`/project/${record.key}/projectdashboard`}><EyeOutlined style={{ fontSize: "20px" }}/></Link>
      ),
    },
  ];


  const columnTasks = [
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Link to={`/project/${record.project}/${record._id}`}><EyeOutlined style={{ fontSize: "20px" }}/></Link>
      ),
    },
  ];

  const data = categories.map((category) => ({
    key: category._id,
    name: category.name,
    slug: category.slug,
  }));

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
        <button className="btn btn-outline-primary">Save</button>
      </div>
    </form>
  );

  // added the auto complete
  const requestForm = () => (
    <form onSubmit={handleSendRequest}>
      <div className="form-group">
        <Select
          className="form-control"
          onChange={(value) => setSelectedCategory(value)}
          value={selectedCategory}
          required
        >
          <Option value="">Please select</Option>
          {categories.map((c) => (
            <Option key={c._id} value={c._id}>
              {c.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="form-group">
        <label>Email</label>
        <AutoComplete
          options={users.filter((user) => user.value.includes(email))}
          onChange={(value) => setEmail(value)}
          value={email}
          className="w-100"
          required
        >
          <Input type="email" autoFocus required className="form-control" />
        </AutoComplete>
      </div>

      <br />
      <button className="btn btn-outline-primary">Send Request</button>
    </form>
  );

     {/* Pagination code */}
     const indexOfLastUser = currentPage * usersPerPage;
      const indexOfFirstUser = indexOfLastUser - usersPerPage;
      const usersToShow = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="container-fluid" style={{ backgroundColor: "#ffffff", height: "100vh" }}>
      <div className="row">
        <div className="col-md-2">
          {/* AdminNav Component */}
          <AdminNav
            handleButtonClick={handleButtonClick}
            handleAddUserClick={handleAddUserClick}
          />
        </div>
        <div className="col-md-10">
          {/* Your Projects */}
          <div className="row">
            <div className="col-md-6">
              <div className="content-container">
                {loading ? (
                  <h4 className="text-danger">Loading..</h4>
                ) : (
                  <>
                    <div className="first">
                      <Title className="header-title" level={1} style={{ color: "#ffffff" }}>
                        My Projects <PlusCircleOutlined className="header-icon" />
                      </Title>
                      <div className="table-container">
                        <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Assigned to */}
            <div className="col-md-6">
              <div className="content-container">
                <Title className="header-title" level={1} style={{ color: "#ffffff" }}>
                  Assigned Projects  <PlusCircleOutlined className="header-icon" />
                </Title>
                <div className="table-container">
                  <Table columns={columns} dataSource={memberProjects} pagination={{ pageSize: 5 }} />
                </div>
              </div>
            </div>
          </div>
  
          {/* Assigned Tasks */}
          <div className="row">
            <div className="col-md-6">
              <div className="content-container">
                <Title className="header-title" level={1} style={{ color: "#ffffff" }}>
                  Assigned Tasks <PlusCircleOutlined className="header-icon" />
                </Title>
                <div className="table-container">
                  {/* Your Table for Assigned Tasks */}
                  <Table columns={columnTasks} dataSource={userTasks} pagination={{ pageSize: 5 }} />
                </div>
              </div>
            </div>
  
            {/* Current Users */}
            {/* <div className="col-md-6">
            <div className="content-container">
          <Title className="header-title" level={1} style={{ color: "#ffffff" }}>
            Current Users <PlusCircleOutlined className="header-icon" />
          </Title>
          <div className="user-list-container">
            {users.map((user) => (
              <div className="user-item" key={user._id}>
                <div className="user-icon">{user.email.charAt(0).toUpperCase()}</div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
            </div> */}
            {/* Current Users */}
<div className="col-md-6">
  <div className="content-container">
    <Title className="header-title" level={1} style={{ color: "#ffffff" }}>
      Current Users <PlusCircleOutlined className="header-icon" />
    </Title>
    <div className="user-list-container">
 
      
      {/* Map through the sliced usersToShow array */}
      {usersToShow.map((user) => (
        <div className="user-item" key={user._id}>
          <div className="user-icon">{user.email.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>
      ))}
    </div>
    {/* Pagination component */}
    <Pagination
      current={currentPage}
      total={users.length}
      pageSize={usersPerPage}
      onChange={(page) => setCurrentPage(page)}
      className="pagination"
    />
  </div>
</div>
          </div>
        </div>
      </div>
      <Modal
        title="Create a new project"
        visible={showModal}
        onCancel={handleModalClose}
        footer={null}
      >
        {categoryForm()}
      </Modal>
      <Modal
        title="Assign an existing user to a project"
        visible={addUserModal}
        onCancel={handleModalClose}
        footer={null}
      >
        {requestForm()}
      </Modal>
    </div>
  );
  


};

export default Project;














