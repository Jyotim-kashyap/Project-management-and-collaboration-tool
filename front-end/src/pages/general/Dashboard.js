import React, { useState, useEffect } from 'react';
import AdminNav from '../../components/nav/AdminNav';
import {
    getProjects
  } from "../../functions/dashboard";  
  import { useSelector } from "react-redux";
  import { Link} from 'react-router-dom';
  import { Card , Divider} from 'antd';
  import { toast } from "react-toastify";

function Dashboard() {
 
    const token = useSelector((state) => state.user.token);
    const userId = useSelector((state) => state.user._id);

    const [projectData, setProjectData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getProjects(userId, token);
            setProjectData(response.data);
          } catch (error) {
            toast.error(error.message);
          }
        };
        fetchData();
      }, [userId, token]);
console.log(projectData)
return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2" style={{ height: "100vh", overflow: "auto" }}>
          <AdminNav />
        </div>
        <div className="col-md-10">
          <div className="row">
            <div className="col-md-12 mb-3">
              <h2>Allocated Projects</h2>
              <Divider />
            </div>
            {Array.isArray(projectData.projects) && projectData.projects.map(project => (

  project.createrId._id !== userId && (
    <div className="col-md-4 mb-3" key={project._id}>
      <Link to={`/project/${project._id}`}>
        <Card
          title={<h3>{project.name}</h3>}
          style={{
            width: 300,
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            borderRadius: "5px",
            transition: "0.3s",
            backgroundColor: "#f9f9f9",
            marginTop: 20
          }}
          hoverable={true}
        >
          <p>{project.createrId.name ? project.createrId.name : project.createrId.email }</p>
        </Card>
      </Link>
    </div>
  )
))}

          </div>
        </div>
      </div>
    </div>
  );
  
  
}

export default Dashboard;

