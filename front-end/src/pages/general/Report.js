
import React, { useState, useEffect } from 'react';
import "./Report.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Typography, Select } from "antd";
import { getVelocityReportData, getBurndownChart,getBurnUpChart } from "../../functions/report";
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const { Title } = Typography;
const { Option } = Select;

function Report() {
  const { id } = useParams();
  const token = useSelector((state) => state.user.token);
  const [reportData, setReportData] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState("");
  const [burndownChartData, setBurndownChartData] = useState([]);
  const [burnupChartData, setBurnupChartData] = useState({});
  const [selectedSprintBurnup, setSelectedSprintBurnup] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getVelocityReportData(token, id);
        setReportData(response.data);
      
      } catch (error) {
        console.log(error);
        if (error.response) {
          toast.error(error.response.data.message);
        } else if (error.request) {
          toast.error('No response from the server');
        } else {
          toast.error('An error occurred');
        }
      }
    };

    fetchData();
  }, [id, token]);



  const handleSprintChange = async (value) => {
    setSelectedSprint(value);
 
    try {
      const response = await getBurndownChart(value,token);
      setBurndownChartData(response);
      
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error('No response from the server');
      } else {
        toast.error('An error occurred');
      }
    }
  };
  
  const handleSprintChangeBurnup = async (value) => {
    setSelectedSprintBurnup(value);
 
    try {
      const response = await getBurnUpChart(value,token);
      setBurnupChartData(response);
      console.log(response)
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error('No response from the server');
      } else {
        toast.error('An error occurred');
      }
    }
  };


  return (
    <div className="container-fluid" style={{ backgroundColor: "#ffffff" }}>
      <div className="row justify-content-center">
        <div className="col-md-10 d-flex flex-column justify-content-center align-items-center">
          <div className="content-container">
            <Title className="header-title" level={1} style={{ color: "#ffffff" }}>
              Velocity graph
            </Title>
            <div className="graph-container">
            <BarChart width={600} height={400} data={reportData}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="sprint" />
                 <YAxis />
                 <Tooltip />
                 <Legend />
                 <Bar dataKey="totalStoryPoints" name="Commulative StoryPoints" fill="#8884d8" />
                 <Bar dataKey="completedStoryPoints" name="Completed Story Points" fill="#82ca9d" />
               </BarChart>
            </div>
            <Title className="header-title" level={1} style={{ color: "#ffffff" }}>
              Burndown Chart
            </Title>
            <div className="graph-container">
              <Select
                style={{ width: 200 }}
                placeholder="Select Sprint"
                onChange={handleSprintChange}
               value={selectedSprint}
              >
                { reportData && reportData.map((sprint) => (
                  <Option key={sprint.sprintId}>
                    {sprint.sprint}
                  </Option>
                ))}
              </Select>
              <LineChart width={600} height={400} data={burndownChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="remainingPoints" name="Remaining Points" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </div>
            <Title className="header-title" level={1} style={{ color: "#ffffff" }}>
              Burnup Chart
            </Title>
            <div className="graph-container">
              <Select
                style={{ width: 200 }}
                placeholder="Select Sprint"
                onChange={handleSprintChangeBurnup}
               value={selectedSprintBurnup}
              >
                { reportData && reportData.map((sprint) => (
                  <Option key={sprint.sprintId}>
                    {sprint.sprint}
                  </Option>
                ))}
              </Select>
              <LineChart width={600} height={400} data={burnupChartData.burnUpData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="createdTasks"
            name=""
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="completedTasks"
            name=""
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;



