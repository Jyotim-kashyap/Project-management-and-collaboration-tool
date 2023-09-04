
import axios from "axios";

  export const getCategories = async (authtoken, id) => {
    
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/project/${id}`, {},{
        headers: {
          authtoken
        },
      });
      
    return res
  
    } catch (error) {
      return error;
  
    }
  } 
 

export const getProjectData = async (slug, token, id) => {
  try {


    const res = await axios.get(`${process.env.REACT_APP_API}/project/${id}/${slug}`, {},{
      headers: {
       authtoken: token
      }
    });
    
  return res

  } catch (error) {
    return error;

  }
}
 
export const removeCategory = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/category/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const updateCategory = async (slug, category, authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/category/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const createCategory = async (project, authtoken, id) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API}/project`, {
          createrId: id,
          name: project,
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

export const sendRequest = async (projectId, email, token)  => {
  try {
      const res = await axios.post(`${process.env.REACT_APP_API}/project/userAdd`, {
        email,
        projectId
      },{
        headers: {
          authtoken: token
        },
      });
      
    return res

    } catch (error) {
      return error;

    }
}

export const getUsers = async (authtoken)  => { // for auto suggestion in the project page
  try {
      const res = await axios.get(`${process.env.REACT_APP_API}/allUser`, {},{
        headers: {
          authtoken
        },
      });
      
    return res

    } catch (error) {
      return error;

    }
}


export const getMemberProjects = async (userId , authtoken)  => { 
  try {
      const res = await axios.get(`${process.env.REACT_APP_API}/project/user/${userId}`, {},{
        headers: {
          authtoken
        },
      });
      
    return res

    } catch (error) {
      return error;

    }
}

export const getUserTask = async (id , authtoken)  => { 
  try {
      const res = await axios.get(`${process.env.REACT_APP_API}/user/${id}/taskdata`, {},{
        headers: {
          authtoken
        },
      });
      
    return res

    } catch (error) {
      return error;

    }
}