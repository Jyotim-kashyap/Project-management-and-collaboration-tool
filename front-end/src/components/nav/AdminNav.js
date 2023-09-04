
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { AppstoreOutlined, BarChartOutlined } from "@ant-design/icons";
import Project from "../../pages/general/Projects";

const { SubMenu } = Menu;

const AdminNav = ({ handleButtonClick, handleAddUserClick }) => {
  const location = useLocation();
  const projectId = location.pathname.split("/")[2];

  return (
    <div style={{ height: "100%", width: "250px" }}>

      <Menu mode="inline" theme="light" style={{
        height: "100%",
        background: "linear-gradient(to right, #f6ffee, #c6fad2 )",
      }} selectedKeys={[location.pathname]}>



        {!projectId && (<Menu.Item key="/project" icon={<AppstoreOutlined />}>
          <Link to="/scrumpoker">Scrum Poker</Link>
        </Menu.Item>)}
            
        {!projectId && (<Menu.Item key="/project" icon={<AppstoreOutlined />}>

          <div onClick={handleButtonClick}  role="button">
            Add Project
          </div>
        </Menu.Item>)}

        {!projectId && (<Menu.Item key="/project" icon={<AppstoreOutlined />}>

          <div onClick={handleAddUserClick}  role="button">
            Add Members
          </div>
        </Menu.Item>)}
    

        {projectId && (<Menu.Item key={`project/${projectId}/codeupdate`} icon={<AppstoreOutlined />}>
          <Link to={`/project/${projectId}/codeupdate`}>Code Updates</Link>
        </Menu.Item>)}

        {projectId && (
          <Menu.Item key={`/project/${projectId}`} icon={<AppstoreOutlined />}>
            <Link to={`/project/${projectId}`}>Backlog</Link>
          </Menu.Item>
        )}

        {projectId && (<Menu.Item key="/admin/products" icon={<BarChartOutlined />}>
          <Link to={`/project/${projectId}/report`}>Reports</Link>
        </Menu.Item>)}
      </Menu>
    </div>
  );
};

export default AdminNav;
