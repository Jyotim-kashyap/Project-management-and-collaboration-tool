import React from 'react'
import {   Button, Form,Input, Row, Col,Modal } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import TableTask from "../../components/tables/TableTask.js"






function Projects() {
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const  token  = useSelector( state  =>  state.user.token); // geting the user out of redux state
  const  id  = useSelector(( state ) =>  state.user._id); // geting the id out of redux state
  //modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  //modal
  const handleSubmit = async (event) => {
    console.log(token)
   
    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/project`, {
        createrid: id,
        name: event.name,
      },{
        headers: {
          authtoken: token,
        },
      });
      console.log("Project created:", response.data);
      toast.success("Project created");

      // const createOrUpdateUser = async (authtoken) => {
      //   return await axios.post(
      //     `${process.env.REACT_APP_API}/create-or-update-user`,
      //     {},
      //     {
      //       headers: {
      //         authtoken,
      //       },
      //     }
      //   );
      // };






      // Clear form input
      setName("");
      // Hide the form
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Project creation failed");

    }
  };

  return (
    <>
    <Button onClick={showModal}>Create Project</Button>
    <Modal title="Give your project a name" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
    <Row justify="center">
      <Col span={12}>
        <Form
          name="basic"
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row> 

    </Modal>

    <TableTask/>
  </>
  );
 
}

export default Projects

{/* <>
<Button onClick={() => setShowForm(true)}>Create Project</Button>
{showForm && (
  <Form  layout="vertical" onFinish={handleSubmit}>
    <Form.Item label="Name" name="name" rules={[{ required: true }]}>
      <Input value={name} onChange={(event) => setName(event.target.value)} />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        Create
      </Button>
    </Form.Item>
  </Form>
)}
</> */}
//  <div className="container p-5">
//       <div className="row">
//         <div className="col-md-6 offset-md-3">
//             <Modal>
                
//             </Modal>
//           <Button
        
//         type="primary"
//         className="mb-3"
//         block
//         shape="round" size="large">
//         Create a Project
//       </Button>
//             </div>
//             </div>
//             </div> 

//////hfhelf
// import React from 'react'
// import {   Button, Form,Input, Row, Col } from 'antd';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";






// function Projects() {
//   const [name, setName] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const  token  = useSelector( state  =>  state.user.token); // geting the user out of redux state
//   const  id  = useSelector(( state ) =>  state._id); // geting the id out of redux state

//   const handleSubmit = async (event) => {
//     console.log(token)
   
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API}/project`, {
//         createrid: id,
//         name: event.name,
//       },{
//         headers: {
//           authtoken: token,
//         },
//       });
//       console.log("Project created:", response.data);
//       toast.success("Project created");

//       // const createOrUpdateUser = async (authtoken) => {
//       //   return await axios.post(
//       //     `${process.env.REACT_APP_API}/create-or-update-user`,
//       //     {},
//       //     {
//       //       headers: {
//       //         authtoken,
//       //       },
//       //     }
//       //   );
//       // };






//       // Clear form input
//       setName("");
//       // Hide the form
//       setShowForm(false);
//     } catch (error) {
//       console.error("Failed to create project:", error);
//       toast.error("Project creation failed");

//     }
//   };

//   return (
//     <>
//     <Button onClick={() => setShowForm(true)}>Create Project</Button>
//     {showForm && (
//       <Row justify="center">
//       <Col span={12}>
//         <Form
//           name="basic"
//           onFinish={handleSubmit}
//           layout="vertical"
//           initialValues={{
//             remember: true,
//           }}
//         >
//           <Form.Item
//             label="Name"
//             name="name"
//             rules={[
//               {
//                 required: true,
//                 message: 'Please input your name!',
//               },
//             ]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </Form.Item>
//         </Form>
//       </Col>
//     </Row>
//     )}
//   </>
//   );
 
// }

// export default Projects