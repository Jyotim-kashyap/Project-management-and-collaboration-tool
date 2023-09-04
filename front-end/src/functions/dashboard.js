import axios from "axios";

export const getProjects  = async ( userId, authtoken) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API}/user/${userId}`,{},{
          headers: {
            authtoken
          },
        });
        
      return res
  
      } catch (error) {
        return error;
  
      }
}
