
import axios from "axios";

  export const getVelocityReportData = async (authtoken, projectId) => {
    
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/report/${projectId}`, {},{
        headers: {
          authtoken
        },
      });
      
    return res
  
    } catch (error) {
      return error;
  
    }
  } 
  export const getBurndownChart = async (sprintId, authtoken) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/report/${sprintId}/Burndown`, {
        headers: {
          authtoken
        }
      });
  
      return res.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const getBurnUpChart = async (sprintId, authtoken) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/report/${sprintId}/burnup`, {
        headers: {
          authtoken
        }
      });
  
      return res.data;
    } catch (error) {
      throw error;
    }
  };
  