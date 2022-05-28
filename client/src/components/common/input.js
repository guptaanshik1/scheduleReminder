import React from "react";

const Input = ({ name, label, type, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        // type={type}
        // name={name}
        // value={value}
        // onChange={onChange}
        {...rest}
        name={name}
        type={type}
        id={name}
        className="form-control"
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;