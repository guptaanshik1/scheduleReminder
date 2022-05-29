const cookieToken = (user, res) => {
  const token = user.getJwtToken();

  const options = {
    expires: new Date(Date.now() * process.env.COOKIETIME),
    httpOnly: true,
  };

  user.password = undefined;

//   SMTP_HOST=smtp.mailtrap.io
// SMTP_PORT=2525
// SMTP_USER=c782459786e5ba
// SMTP_PASS=5bbaae46bc9830

// SERVICE = "gmail";
// USER = "1testeremail0@gmail.com";
// PASS = "G1u2p3t4a5#";

  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = cookieToken;