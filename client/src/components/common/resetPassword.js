import React from "react";
import Form from "./form";
import Joi from "joi-browser";
import { passwordResetFromToken } from "./../../services/authService";

class ResetPassword extends Form {
  state = {
    data: {
      password: "",
      confirmPassword: "",
    },
    errors: {},
  };

  schema = {
    password: Joi.string().required().min(6).label("Password"),
    confirmPassword: Joi.string().required().min(6).label("Confirm Password"),
  };

  doSubmit = async () => {
    const { password, confirmPassword } = this.state.data;
    const { token } = this.props.match.params;
    if (password !== confirmPassword) {
      alert("Password does not match");
      this.setState({ password: "", confirmPassword: "" });
      return;
    }
    await passwordResetFromToken(token, password);
    alert("Your password has been changed now login.");
  };

  render() {
    return (
      <form className="container form-group" onSubmit={this.handleSubmit}>
        {this.renderInput("password", "Password", "password")}
        {this.renderInput("confirmPassword", "Confirm Password", "password")}
        {this.renderSubmitButton("Submit")}
      </form>
    );
  }
}

export default ResetPassword;