import axios from "axios";


export const create = async ( projectId, authtoken, values) => {
  
    try {
        const res = await axios.post(`${process.env.REACT_APP_API}/project/${projectId}/codeupdate`, {
            project : values.project,
            requestDate: values.requestDate,
            developer: values.developer,
            changeDetails: values.changeDetails,
            changePath: values.changePath,
            priority: values.priority,
            systemAdmin: values.systemAdmin,
            deploymentDate: values.deploymentDate
        },{
          headers: {
            authtoken
          },
        });
        
      return res
  
      } catch (error) {
        return error;
  
      }
}

export const getAll  = async ( projectId, authtoken) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API}/project/${projectId}/codeupdate`,{},{
          headers: {
            authtoken
          },
        });
        
      return res
  
      } catch (error) {
        return error;
  
      }
}


export const handleDelete = async (projectId , codeId, authtoken) => {
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API}/project/${projectId}/codeupdate/${codeId}`,{},{
          headers: {
            authtoken
          },
        });
        
      return res
  
      } catch (error) {
        return error;
  
      }
  };
  
