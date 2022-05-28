import React, { Component } from "react";
import Joi from "joi-browser";
import { NavLink } from "react-router-dom";
import Input from "./input";

class Form extends Component {
  state = {
    data: {},
    errors: {},
    resendOtp: false,
  };

  validate = () => {
    const result = Joi.validate(this.state.data, this.schema, {
      abortEarly: false,
    });

    console.log(result);
    if (!result.error) return null;
    const errors = {};
    for (let item of result.error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  validateProperty = (e) => {
    const { name, value } = e.currentTarget;
    const obj = { [name]: value }; // this obj will have current field and its value
    const schema = { [name]: this.schema[name] }; // schema will have current field and its value from schema

    const result = Joi.validate(obj, schema);
    return result.error ? result.error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit(); // doSubmit will be in each respective form
  };

  handleChange = (e) => {
    const errors = { ...this.state.errors };
    const { data } = this.state;

    const errorMessage = this.validateProperty(e);
    const { name, value } = e.currentTarget;

    if (errorMessage) {
      errors[name] = errorMessage;
    } else {
      delete errors[name];
    }

    data[name] = value;

    this.setState({ data, errors });
  };

  //  disabled={this.validate()}

  renderSubmitButton = (label) => {
    return (
      <button className="btn btn-primary mt-2" disabled={this.validate()}>
        {label}
      </button>
    );
  };

  renderButton = (label, click) => {
    return (
      <button className="btn btn-primary mt-2" type="button" onClick={click}>
        {label}
      </button>
    );
  };

  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;
    return (
      <Input
        name={name}
        type={type}
        label={label}
        value={data[name]}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  };

  renderLink = (text, link, label) => {
    return (
      <div className="text-center mt-4 form-check">
        <label className="form-check-label" htmlFor="exampleCheck1">
          {text}
        </label>
        <NavLink to={link}>{label}</NavLink>
      </div>
    );
  };
}

export default Form;