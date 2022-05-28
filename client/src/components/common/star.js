import React from "react";

const Star = (props) => {
  return (
    <React.Fragment>
      {props.schedule.isImportant && (
        <i
          className="fa fa-star"
          onClick={() => props.onStar(props.schedule._id)}
          style={{ cursor: "pointer", color: "yellow" }}
        ></i>
      )}
      {!props.schedule.isImportant && (
        <i
          className="fa fa-star"
          onClick={() => props.onStar(props.schedule._id)}
          style={{ cursor: "pointer" }}
        ></i>
      )}
    </React.Fragment>
  );
};

export default Star;