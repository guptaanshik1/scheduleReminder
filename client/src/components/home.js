import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <React.Fragment>
      <div className="container text-center">
        <button className="btn btn-warning">
          <Link to="/login" style={{ textDecoration: "none", color: "white" }}>
            GET STARTED
          </Link>
        </button>
      </div>
      <div className="container text-center mt-4">
        <h1>HOW IT WORKS</h1>
        <ul className="list-group">
          <li className="list-group-item">
            Enter your activity With its time to start and end.
          </li>
          <li className="list-group-item">
            Once entered the activity, it can only be completed when the time
            for it comes.
          </li>
          <li className="list-group-item">
            If not completed within time then it is marked as incomplete.
          </li>
          <li className="list-group-item">
            You will be getting notified when your activity will start and end.
          </li>
          <li className="list-group-item">
            You can check how frequently you are completing you activites.
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};

export default Home;