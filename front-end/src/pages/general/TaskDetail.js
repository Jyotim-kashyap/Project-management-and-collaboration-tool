import React, { useState, useEffect } from "react";
import CommentSection from "../../components/comment/CommentSection";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { GetOne, TaskDetails,UpdateTask } from "../../functions/task";
import TaskUpdate from "../../components/forms/TaskUpdate";
import FileUpload from "../../components/forms/fileUpload";

import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Typography} from "antd";
import axios from "axios";
import "./TaskDetail.css"
const { Title } = Typography;


const initialState = {
  title: "",
  transition: "",
  assignee: [],
  transitions: ['ToDo','InProgress', 'Done'],
  sprint: "",
  description: "",
  labels: "",
  duedate: null, // or duedate: undefined
  comments: [],
  storyPoints: 0,
  imageUrl: [],
  typeOfTask: "",
  typeOfTasks: ['Task','Bug', 'Story'],

};


const TaskDetail = () => {
    // state
  const [values, setValues] = useState(initialState);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState({});
  const [assignee, setAssignee] = useState([]);
  const [images, setImages] = useState([]);


  const {  id,taskid  } = useParams();
  const  token  = useSelector((state) => ( state.user.token ));
 const history = useNavigate()


  useEffect(() => {
    loadProject();
    loadTask();
   
  }, []);

//new
  useEffect(() => {
    fetchImages();
  }, []);


  const fetchImages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/task/${taskid}/image`);
      const imageData = response.data; // Assuming the response data is in the format { "imageFiles": [...] }
      const imageUrls = imageData.imageFiles.map((imageFile) => {
        return { url: imageFile.url, type: imageFile.type };
      });
      setImages(imageUrls);
    } catch (error) {
      console.error(error);
    }
  };
  
  


  const loadProject = () => // to get assignees
    GetOne(id,token).then((c) => {

      return setProject(c.data) 
   

    });

    const loadTask = () =>
    TaskDetails(taskid,token).then((c) => {
     
      return setValues({...values,...c.data})
     
    });
 
    const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);
    
      const updatedValues = { ...values };
    
      if (assignee && assignee.length > 0) {
        updatedValues.assignee = assignee.map((str) => str);
      } else {
        // if assignee is empty
        updatedValues.assignee = [];
      }
    
      if (values.duedate) {
        updatedValues.duedate = values.duedate;
      }
    
      setValues(updatedValues); // updating state with new assignee values
    
      UpdateTask(taskid, updatedValues, token)
        .then((e) => {
          setLoading(false);
          toast.success(`"${e.data.title}" is updated`);
          history(-1);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast.error(err);
        });
    };
    
    

    
    const handleChange = (e) => {
      const { name, value, checked } = e.target;
      if (name === "assignee") {
        const newAssignee = checked
          ? [...values.assignee, value]
          : values.assignee.filter((id) => id !== value);
        setValues({ ...values, assignee: newAssignee });
      }  else if (name === "storyPoints") {
        setValues({ ...values, storyPoints: parseInt(value) });
      } else {
        setValues({ ...values, [name]: value });
      }
    };
    const handleFileClick = async (url) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API}/task/${taskid}/getfile`,
          {
            url: url,
          },
          {
            responseType: 'blob',
          }
        );
    
        // Create a blob URL from the response data
        const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
        const fileUrl = URL.createObjectURL(fileBlob);
    
        // Extract the filename from the URL and get the second part after splitting at "__"
        const fileName = url.split('__')[1];
    
        // Create a temporary <a> element to trigger the file download
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.download = fileName; // Set the filename as the download attribute
        downloadLink.click();
    
        // Clean up the temporary URL
        URL.revokeObjectURL(fileUrl);
      } catch (error) {
        console.error(error);
      }
    };
    
    
    
    const getFileNameFromURL = (url) => {
      const parts = url.split('\\');
      const fileName = parts[parts.length - 1];
      const separatorIndex = fileName.indexOf('__');
      const displayedName = separatorIndex !== -1 ? fileName.substring(separatorIndex + 2) : fileName;
      return displayedName;
    };
    

    
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            {loading ? (
              <h4 className="text-danger">Loading..</h4>
            ) : (
              <div className="row">
              <div className="col-md-8 offset-md-2">
               <Title  className="header-title" level={1} style={{ color: "#ffffff", marginTop: "2em", marginBottom: "2em"}}>
                
                Update Task   </Title>
                </div>
            </div>
            )}
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <TaskUpdate
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  setValues={setValues}
                  values={values}
                  project={project}
                  setAssignee={setAssignee}
                  assignee={assignee}
                />
              </div>
            </div>


<div className="row">
  <div className="col-md-8 offset-md-2">
    <div className="file-upload-container">
      {images &&
        images.map((file, index) => (
          <div
            key={index}
            className="file-card"
            onClick={() => handleFileClick(file.url)}
            style={{ cursor: 'pointer', border: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '4px' }}
          >
            <div className="file-card-name">{getFileNameFromURL(file.url)}</div>
          </div>
        ))}
    </div>
  </div>
</div>




            <div className="row">
  <div className="col-md-8 offset-md-2">
    <div className="file-upload-container">
      <FileUpload taskid={taskid} setImages={setImages}/>
    </div>
  </div>
</div>
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <CommentSection comments={values.comments} taskid={taskid} token={token} setValues={setValues} />
              </div>
            </div>
          </div>
 
        </div>
      </div>
    );
    



};

export default TaskDetail;

