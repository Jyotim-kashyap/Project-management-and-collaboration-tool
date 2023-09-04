import axios from "axios";


export const createTask = async (project,description, projectId,typeOfTask, authtoken, sprintId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API}/task`, {
          title: project,
          description,
          projectId,
          typeOfTask,
          sprintId


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

export const getTask = async ( projectId, authtoken) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API}/task/list`, {
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

export const GetOne = async ( pid, authtoken) => {
  try {
      const res = await axios.get(`${process.env.REACT_APP_API}/task/project/${pid}/users`, {
         

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

export const TaskDetails = async ( taskid, authtoken) => {
  try {
      const res = await axios.get(`${process.env.REACT_APP_API}/task/${taskid}`, {
         

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
export const UpdateTask = async ( taskid,task, authtoken) => {
  try {
      const res = await axios.put(`${process.env.REACT_APP_API}/task/${taskid}`, {task},{
          headers: {
            authtoken
          },
        });
      
  
    return res

    } catch (error) {
      return error;

    }
}

export const createComment = async ( taskid, commentText, authtoken) => {
  try {
      const res = await axios.patch(`${process.env.REACT_APP_API}/task/${taskid}/comment`, {commentText},{
          headers: {
            authtoken
          },
        });
      
  
    return res

    } catch (error) {
      return error;

    }
}

export const handleRemoveTask= async ( sprintId,taskId, authtoken) => {
  try {
      const res = await axios.patch(`${process.env.REACT_APP_API}/sprint/${sprintId}/${taskId}`, {},{
          headers: {
            authtoken
          },
        });
      
  
    return res

    } catch (error) {
      return error;

    }
}

export const getTaskByTransition= async ( projectId, authtoken) => {
  try {
      const res = await axios.get(`${process.env.REACT_APP_API}/task/project/${projectId}`, {},{
          headers: {
            authtoken
          },
        });
      
  
    return res

    } catch (error) {
      return error;

    }
}