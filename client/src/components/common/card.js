import React from "react";
import { Link } from "react-router-dom";

const Card = ({ heading, text, description, linkLabel, link }) => {
  return (
    <div>
      <div className="card">
        <div className="card-header">{heading}</div>
        <div className="card-body">
          <h5 className="card-title">{text}</h5>
          <p className="card-text">{description}</p>
          <Link to={link} className="btn btn-primary">
            {linkLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;