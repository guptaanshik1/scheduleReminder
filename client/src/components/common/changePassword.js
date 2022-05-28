import React from "react";
import Form from "./form";
import Joi from "joi-browser";
import { updatePassword } from "./../../services/userService";

class ChangePassword extends Form {
  state = {
    data: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    errors: {},
  };

  schema = {
    oldPassword: Joi.string().min(6).required().label("Password"),
    newPassword: Joi.string().min(6).required().label("New Password"),
    confirmNewPassword: Joi.string()
      .min(6)
      .required()
      .label("Confirm New Password"),
  };

  doSubmit = async () => {
    const { oldPassword, newPassword, confirmNewPassword } = this.state.data;
    if (newPassword !== confirmNewPassword) {
      alert("Passwords does not match");
    }
    const dataToBeSent = {
      oldPassword,
      newPassword
    }
    try {
      await updatePassword(dataToBeSent);
      alert("Your password has been change succesfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <form className="container form-group" onSubmit={this.handleSubmit}>
          {this.renderInput("oldPassword", "Old Password", "password")}
          {this.renderInput("newPassword", "New Password", "password")}
          {this.renderInput(
            "confirmNewPassword",
            "Confirm New Password",
            "password"
          )}
          {this.renderSubmitButton("Update Password")}
        </form>
      </React.Fragment>
    );
  }
}

export default ChangePassword;