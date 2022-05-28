import React from "react";
import OtpTimer from "otp-timer";

const Otp = ({ sendOtp }) => {
  const handleSendAgain = () => {
    sendOtp();
  };

  return (
    <React.Fragment>
      <OtpTimer
        seconds={0}
        minutes={2}
        text="Time Left:"
        ButtonText="Resend OTP"
        resend={handleSendAgain}
      />
    </React.Fragment>
  );
};

export default Otp;