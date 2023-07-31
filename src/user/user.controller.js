require("dotenv").config();
const UserModel = require("./user.model");
const LOG = require("../../helpers/logger");
const bcrypt = require("bcrypt");
const { sendClientEmail } = require("../../helpers/nodemailer");
const {
  getTokens,
  handleResponse,
  generateRandomString,
} = require("../../helpers/utils");
const { getConfirmEmailTemplate } = require("../../helpers/emailTemplates");

exports.Register = async (req, res) => {
  try {
    const response = await UserModel.find({ email: req.body.email });
    if (response.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const newUser = ({ email, phone, password, firstName, lastName, role } =
      req.body);
    const user = new UserModel(newUser);
    user.verificationKey = generateRandomString(20);
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    const tokens = getTokens(newUser);
    const data = {
      user: user,
      tokens: tokens,
    };
    const emailSend = {
      from: "Ordery <contact@avoconsulte.com>",
      to: email,
      subject: "[ Ordery GET ACCOUNT CONFIRMATION ]",
      html: getConfirmEmailTemplate(
        `${user.firstName} ${user.lastName}`,
        `http://127.0.0.1:3000/verify/${user._id}-${user.verificationKey}`
      ),
    };
    await sendClientEmail(emailSend);
    return res.json(handleResponse("User created successfully", 200, data));
  } catch (err) {
    LOG.error(err.message);
    res.status(500).send({ message: err.message, status: "fail" });
  }
};
exports.Login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.json(handleResponse("User not found", 404, null));
    }
    console.log(user);
    if (await bcrypt.compare(req.body.password, user.password)) {
      const tokens = getTokens(user);
      const data = {
        user: user,
        tokens: tokens,
      };
      return res.json(handleResponse("User logged in successfully", 200, data));
    }
    return res.json(handleResponse("something went wrong", 401, null));
  } catch (err) {
    LOG.error(err.message);
    return res.json(handleResponse("wrong credentials", 401, null));
  }
};
exports.Refresh = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    const headers = {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    };
    const config = {
      headers,
    };
    const response = await axios.get(
      `${process.env.AUTH_SERVER_URL}/user/refresh`,
      config
    );
    res.json({
      message: "User logged in successfully",
      data: {
        accessToken: response.data.accessToken,
      },
      status: "success",
    });
  } catch (err) {
    LOG.error(err.message);
    res.status(403).send({ message: "wrong credentials", status: "fail" });
  }
};
exports.ForgotPassword = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    // generate passwordResetCode 8 digit random number
    const passwordResetCode = Math.floor(Math.random() * 100000000000);
    // send passwordResetCode to auth server
    const response = await axios.post(
      `${process.env.AUTH_SERVER_URL}/user/forgot-password`,
      {
        id: user._id,
        passwordResetCode,
      }
    );
    if (response.status !== 200) {
      return res.status(400).json({
        message: "Could not send password reset code",
      });
    }
    const resetPasswordLink =
      "https://avoconsulte.com/" + user._id + "-" + passwordResetCode;

    const config = {
      from: "AvoConsulte <contact@avoconsulte.com>",
      to: user.email,
      subject: `[ CAPTURE GET RESET PASSWORD ]`,
      html: `Name: ${`${user.firstName} ${user.lastName}`} \nEmail:  ${
        user.email
      } 
      \n \n Password reset link: <a href=${resetPasswordLink}>click here</a>
      \n \n Please use this code to reset your password.
      \n \n This code will expire in 1 hour.
      \n \n If you did not request a password reset, please ignore this email.`,
    };
    await sendClientEmail(config);
    res.status(200).json({
      message: "Email sent successfully",
      status: "success",
    });
  } catch (err) {
    LOG.error(err.message);
    res.status(500).send({ message: err.message, status: "fail" });
  }
};
exports.ResetPassword = async (req, res) => {
  try {
    // find user by email
    const user = await UserModel.findOne({ _id: req.body.id });
    // send passwordResetCode and user id to auth server
    const response = await axios.post(
      `${process.env.AUTH_SERVER_URL}/user/reset-password`,
      {
        id: user._id,
        passwordResetCode: req.body.passwordResetCode,
        password: req.body.password,
      }
    );
    if (response.status !== 200) {
      return res.status(400).json({
        message: "Could not reset password",
      });
    }
    res.status(200).json({
      message: "Password reset successfully",
      status: "success",
    });
  } catch (err) {
    LOG.error(err.message);
    res.status(500).send({ message: err.message, status: "fail" });
  }
};
exports.ChangePassword = async (req, res) => {
  try {
    // find user by email
    const user = await UserModel.findOne({ email: req.body.email });
    const payload = {
      id: user._id.toString(),
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    };
    // send authorization token and user id to auth server
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const response = await axios.post(
      `${process.env.AUTH_SERVER_URL}/user/change-password`,
      { data: payload },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status !== 200) {
      return res.status(400).json({
        message: "Could not reset password",
      });
    }
    res.status(200).json({
      message: "Password reset successfully",
      status: "success",
    });
  } catch (err) {
    LOG.error(err.message);
    res.status(500).send({ message: err.message, status: "fail" });
  }
};
exports.Update = async (req, res) => {
  try {
    UserModel.findOneAndUpdate(
      { _id: req.user.id },
      req.body,
      { new: true },
      (err, data) => {
        if (err) {
          res.send(err);
        }
        res.json(data);
      }
    );
  } catch (err) {
    LOG.error(err.message);
    res.status(500).send({ message: err.message, status: "fail" });
  }
};
exports.Verify = async (req, res) => {
  try {
    // the user id is the first part of the key
    const { userId } = req.body.data.split("-")[0];
    // the user verification key is the second part of the key
    const userVerificationKey = req.body.data.split("-")[1];
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user.verificationKey !== userVerificationKey) {
      return res.status(400).json({
        message: "Invalid verification key",
      });
    }
    user.isVerified = true;
    await user.save();
    res.status(200).send({
      message: "User verified successfully",
      status: "success",
    });
  } catch (err) {
    LOG.error(err.message);
    res.status(500).send({ message: err.message, status: "fail" });
  }
};
exports.ChangeEmail = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body._id });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user.email === req.body.email) {
      return res.status(400).json({
        message: "you are already using this email",
      });
    }
    user.verificationKey = helpers.generateRandomString(20);
    user.email = req.body.email;
    const emailSend = {
      from: "AvoConsulte <contact@avoconsulte.com>",
      to: req.body.email,
      subject: "[ CAPTURE GET ACCOUNT CONFIRMATION ]",
      html: getConfirmEmailTemplate(
        `${user.firstName} ${user.lastName}`,
        `https://avoconsulte.com/verify/${user._id}-${user.verificationKey}`
      ),
    };
    await sendClientEmail(emailSend);
    await user.save();
    res.status(200).send({
      message: "Email changed successfully",
      status: "success",
    });
  } catch (err) {
    LOG.error(err.message);
    res.status(500).send({ message: err.message, status: "fail" });
  }
};
exports.updateFcmToken = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.body.id });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const token = req.body.token;
  user.fcmToken = token;
  user.save();
  res.status(200).json({
    message: "User FcmToken updated",
    status: "success",
  });
};
