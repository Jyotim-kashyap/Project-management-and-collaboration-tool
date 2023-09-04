import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TaskUpdate.css"


const TaskUpdate = ({
  handleSubmit,
  handleChange,
  setValues,
  values,
  project,
  setAssignee,
  assignee,
}) => {
  const {
    title,
    transition,
    transitions,
    sprint,
    description,
    labels,
    duedate,
    storyPoints,
    imageUrl,
    typeOfTask, 
    typeOfTasks
 
  } = values;
  const selectedDate = values.duedate ? new Date(values.duedate) : null;
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={title}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Type of Task</label>
        <select
          name="typeOfTask"
          className="form-control"
          value={typeOfTask}
          onChange={handleChange}
        >
          <option>Please select</option>
          {typeOfTasks.map((taskType) => (
            <option key={taskType} value={taskType}>
              {taskType}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group" style={{padding: '2rem', border: '1px solid olive', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
  <label>Assignee</label>
  <div>
    {project.users &&
      project.users.map((user) => {
        if (values.assignee.includes(user._id)) {
          // Skip displaying checkbox for this user
          return null;
        }
        return (
          <div key={user._id}>
            <input
              type="checkbox"
              name="assignee"
              value={user._id}
              checked={assignee.includes(user._id)}
              onChange={(e) => {
                const { checked, value } = e.target;
                setAssignee((prevAssignee) => {
                  if (checked) {
                    return [...prevAssignee, value];
                  } else {
                    return prevAssignee.filter((id) => id !== value);
                  }
                });
              }}
            />
            <label>{user.email}</label>
          </div>
        );
      })}
  </div>
</div>

      <div className="form-group">
        <label>Transition</label>
        <select
          name="transition"
          className="form-control"
          value={transition}
          onChange={handleChange}
        >
          <option>Please select</option>
          {transitions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
  name="description"
  className="form-control"
  value={description}
  onChange={handleChange}
  rows="5"
></textarea>


      </div>
      <div className="form-group">
  <label>Story Points</label>
  <input
    type="number"
    name="storyPoints"
    className="form-control"
    value={storyPoints}
    onChange={handleChange}
  />
</div>

      <div className="form-group">
        <label>Labels</label>
        <input
          type="text"
          name="labels"
          className="form-control"
          value={labels}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
  <label>Due Date</label>
 
  <DatePicker
  name="duedate"
  className="form-control"
  selected={selectedDate}
  value={selectedDate}
  onChange={(date) => setValues({ ...values, duedate: date ? date : null })}
/>


</div>


      <br />
      <button className="button-88">Save</button>
    </form>
  );
};

export default TaskUpdate;
