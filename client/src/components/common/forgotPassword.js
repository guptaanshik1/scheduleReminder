import React from "react";
import Joi from "joi-browser";
import Form from "./form";
import { forgotPasswordMail } from "../../services/authService";

class ForgotPassword extends Form {
  state = {
    data: {
      email: "",
    },
    errors: {},
  };

  schema = {
    email: Joi.string().email().required().label("Email"),
  };

  doSubmit = async () => {
    const { email } = this.state.data;
    try {
      await forgotPasswordMail(email);
      alert("Password reset email has been sent to the given email.");
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
      <form className="container form-group" onSubmit={this.handleSubmit}>
        {this.renderInput("email", "Enter the Email", "email")}
        {this.renderSubmitButton("Submit")}
      </form>
    );
  }
}

export default ForgotPassword;