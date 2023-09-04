import axios from "axios";


export const createSprint = async (sprint, projectId, authtoken) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API}/sprint`, {
          name: sprint,
          projectId

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


export const getSprint = async ( projectId, authtoken) => {
    
    try {
        const res = await axios.get(`${process.env.REACT_APP_API}/sprint/${projectId}`, {
            projectId:projectId
  
          },{
            headers: {
              authtoken
            },
          });
        
     console.log(projectId)
      return res
  
      } catch (error) {
        return error;
  
      }
}

export const updateSprint = async ( sprintId,sprintData, authtoken) => {
    
  try {
      const res = await axios.patch(`${process.env.REACT_APP_API}/sprint/${sprintId}`, {sprintData},{
          headers: {
            authtoken
          },
        });
      
   
    return res

    } catch (error) {
      return error;

    }
}


export const archiveSprint = async ( sprintId, authtoken) => {
    
  try {
      const res = await axios.patch(`${process.env.REACT_APP_API}/sprint/archive/${sprintId}`, {},{
          headers: {
            authtoken
          },
        });
      
   
    return res

    } catch (error) {
      return error;

    }
}


export const getAllArchived = async ( projectId, authtoken) => {
    
  try {
      const res = await axios.get(`${process.env.REACT_APP_API}/sprint/${projectId}/archived/all`, {},{
          headers: {
            authtoken
          },
        });
      
   
    return res

    } catch (error) {
      return error;

    }
}

export const unarchiveSprint = async (sprintId, authtoken) => {
  try {
    const res = await axios.patch(`${process.env.REACT_APP_API}/sprint/unarchive/${sprintId}`, {}, {
      headers: {
        authtoken
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};


