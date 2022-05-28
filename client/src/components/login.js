import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import Form from "./common/form";
import { login, getCurrentUser } from "../services/authService";

class Login extends Form {
  state = {
    data: {
      email: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    const { email, password } = this.state.data;
    try {
      const user = await login(email, password);
      window.location = "/login";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ email: "", password: "", errors });
      }
    }
  };

  render() {
    const user = getCurrentUser();

    if (user && user.role === "user" && user.profilePicture.secure_url) {
      return <Redirect to="/userdashboard" />;
    }

    if (user && user.role === "user" && !user.profilePicture.secure_url) {
      return <Redirect to="/upload" />;
    }

    if (user && user.role === "admin" && user.profilePicture.secure_url) {
      return <Redirect to="/admindashboard" />;
    }

    if (user && user.role === "admin" && !user.profilePicture.secure_url) {
      return <Redirect to="/upload" />;
    }

    return (
      <React.Fragment>
        <form className="container form-group" onSubmit={this.handleSubmit}>
          {this.renderInput("email", "Email", "email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderLink(
            "Forgot Password:",
            "/forgotpassword",
            "Reset Your Password Here"
          )}
          {this.renderSubmitButton("Login")}
          {this.renderLink(`Don't have an account?`, "/signup", "Sign Up")}
        </form>
      </React.Fragment>
    );
  }
}

export default Login;