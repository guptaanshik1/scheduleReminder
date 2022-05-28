import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import Form from "./common/form";
import Otp from "./otp";
import { register } from "../services/userService";
import { verifyEmail } from "../services/userService";
import { loginWithJwt, getCurrentUser } from "../services/authService";

class Signup extends Form {
  state = {
    data: {
      name: "",
      age: 0,
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
      occupation: "",
    },
    errors: {},
    otpButton: true,
    otpToBeVerified: "",
    verifyButton: false,
    setTimer: false,
    resendOtp: false,
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Name"),
    age: Joi.number().required().min(6).max(100).label("Age"),
    email: Joi.string().email().required().label("Email"),
    otp: Joi.string().required().label("OTP"),
    password: Joi.string().required().min(6).label("Password"),
    confirmPassword: Joi.string().required().min(6).label("Confirm Password"),
    occupation: Joi.string().required(),
  };

  renderOtpHandler = () => {
    return <Otp sendOtp={this.sendOtp} />;
  };

  sendOtp = async () => {
    try {
      const { email } = this.state.data;
      const toBeSendEmail = { email };
      const response = await verifyEmail(toBeSendEmail);

      if (response) {
        alert("OTP has been sent to email id.");
        const { otp } = response.data;
        this.setState({
          verifyButton: true,
          setTimer: true,
          resendOtp: true,
          otpButton: false,
          otpToBeVerified: otp,
        });
      }
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  checkOtp = () => {
    this.setState({ setTimer: false });
    const { otp } = this.state.data;

    if (otp === this.state.otpToBeVerified) {
      alert("Verified");
      this.setState({
        verifyButton: false,
        setTimer: false,
        resendOtp: false,
        otp: "",
      });
    } else {
      alert("Entered OTP is wrong.");
      this.setState({
        verifyButton: true,
        setTimer: true,
        resendOtp: true,
        otp: "",
      });
    }
  };

  doSubmit = async () => {
    const { password, confirmPassword } = this.state.data;
    if (password !== confirmPassword) {
      alert("Password does not match");
      return;
    }
    try {
      const { data: jwt } = await register(this.state.data);
      loginWithJwt(jwt.token);
      window.location = "/signup";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
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

    const { email, otp } = this.state.data;
    const { verifyButton, setTimer, otpButton, resendOtp } = this.state;
    // console.log(this.state.data)

    return (
      <form className="container form-group" onSubmit={this.handleSubmit}>
        {this.renderInput("name", "Name")}
        {this.renderInput("age", "Age", "number")}
        {this.renderInput("email", "Email", "email")}
        {email && otpButton && this.renderButton("Send OTP", this.sendOtp)}
        {email && this.renderInput("otp", "Enter OTP")}
        {setTimer && resendOtp && this.renderOtpHandler()}
        {otp &&
          verifyButton &&
          this.renderButton("Verify Email", this.checkOtp)}
        {this.renderInput("password", "Password", "password")}
        {this.renderInput("confirmPassword", "Confirm Password", "password")}
        {this.renderInput("occupation", "Occupation")}
        {!verifyButton && this.renderSubmitButton("Sign Up")}
        {this.renderLink("Already have an account?", "/login", "Login")}
      </form>
    );
  }
}

export default Signup;