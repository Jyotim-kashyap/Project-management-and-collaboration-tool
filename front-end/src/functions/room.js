import axios from "axios";



export const roomCreate = async (authtoken) => {
  
    try {
        const res = await axios.get(`${process.env.REACT_APP_API}/scrumpoker`, {},{
          headers: {
            authtoken
          },
        });
        
      return res
  
      } catch (error) {
        return error;
  
      }
}