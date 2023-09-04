import React, { useState } from 'react';
import { Input, Button, List } from 'antd';
import { createComment } from "../../functions/task"
import { toast } from "react-toastify";
import { Divider } from 'antd';
import { useSelector } from "react-redux";

const { TextArea } = Input;

const CommentSection = ({ comments, taskid, token, setValues }) => {
  const { user } = useSelector(( state ) => ({ ...state})); // geting the user out of redux state

  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    if (!commentText.trim()) {
      toast.warning('Comment cannot be empty');
      return;
    }
    if (commentText.length > 500) {
      toast.warning('Comment is too long');
      return;
    }
    createComment(taskid, commentText, token)
      .then((response) => {
        console.log(response);
        setValues((prevState) => ({
          ...prevState,
          comments: response.data
        }));
        setCommentText('');
        toast.success('Comment Added');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error adding comment');
      });
  };

  return (
   
    <div className="comment-section">
    <Divider />
    <div className="form-group">
      <textarea 
        className="form-control" 
        rows={4} 
        placeholder="Write your comment here" 
        value={commentText} 
        onChange={e => setCommentText(e.target.value)} 
      />
    </div>
    <button className="btn btn-primary" onClick={handleSubmit}>Add Comment</button>
    <ul className="list-unstyled">
      <h4>{comments.length} Comments</h4>
      {comments.map((item, index) => (
        <li key={index}>
          <p className="font-weight-bold">{user.name ? user.name : user.email}</p>
          <p>{item}</p>
        </li>
      ))}
    </ul>
  </div>
  );
}

export default CommentSection;
