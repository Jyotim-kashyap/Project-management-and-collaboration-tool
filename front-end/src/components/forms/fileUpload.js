
import React, { useState } from "react";
import "./fileUpload.css";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";

const FileUpload = (props) => {
  const { taskid, setImages } = props;
  const [file, setFile] = useState(null);

  const handleFileChange = (file) => {
    setFile(file);
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${process.env.REACT_APP_API}/task/${taskid}/fileupload`, formData)
      .then((response) => {
        console.log("File upload successful");
        toast.success("File uploaded successfully");
        console.log("r1",response.data.fileObj)
        console.log({ url: response.data.url, type: response.data.type })
        setImages((prevImages) => [...prevImages, { url: response.data.fileObj.url, type: response.data.fileObj.type }]);
       


        setFile(null);
      })
      .catch((error) => {
        console.error("File upload error:", error);
        toast.error("Error uploading file");
      });
  };

  return (
    <div>
      <Upload
        fileList={file ? [file] : []}
        beforeUpload={(file) => {
          handleFileChange(file);
          return false; // Prevent default upload behavior
        }}
      >
        <Button icon={<UploadOutlined />} disabled={file !== null}>
          Select File
        </Button>
      </Upload>

      {file && (
        <Button type="primary" onClick={handleUpload} style={{ marginTop: 16 }}>
          Upload
        </Button>
      )}
    </div>
  );
};

export default FileUpload;
