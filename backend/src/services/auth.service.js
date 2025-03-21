const userService = require("./user.service");
const {
  Token,
  OTP,
  User,
  Dealer,
  Institution,
  Personal,
} = require("../models");
const { tokenTypes } = require("../config/tokens");
const { otpTypes } = require("../config/otp");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { roles } = require("../config/user");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const login = async (email, password) => {
  try {
    let user = await userService.findByClause({
      $or: [{ email }, { username: email }],
    });
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Incorrect email/username or password"
      );
    }

    let userDetail;
    if (user.role === roles.DEALER) {
      userDetail = await Dealer.findOne({ userId: user?._id });
    } else if (user.role === roles.INSTITUTION) {
      userDetail = await Institution.findOne({ userId: user?._id });
    } else if (user.role === roles.PERSONAL) {
      userDetail = await Personal.findOne({ userId: user?._id });
    }
    user = { ...user._doc, userDetail };

    return user;
  } catch (e) {
    throw e;
  }
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  try {
    const refreshTokenDoc = await Token.findOne({
      token: refreshToken,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    });
    if (!refreshTokenDoc) throw new Error();
    return refreshTokenDoc.deleteOne();
  } catch (e) {
    return false;
  }
};

/**
 * Reset password
 * @param resetPasswordTokenDoc
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (userId, newPassword) => {
  try {
    // Fetch User
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Update User Password
    await userService.update(user, { password: newPassword });

    // Delete all reset password OTPs for this user (To remove redundant documents)
    await OTP.deleteMany({ userId: user._id, type: otpTypes.RESET_PASSWORD });
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  login,
  logout,
  resetPassword,
};
