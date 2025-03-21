const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { roles } = require("../config/user");
const { Dealer, Institution, Personal } = require("../models");

const verifyCallback =
  (req, resolve, reject, requiredRight, resource) =>
  async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }

    try {
      let userDetail = null;

      // Fetch user detail based on role
      if (user.role === roles.DEALER) {
        userDetail = await Dealer.findOne({ userId: user._id });
      } else if (user.role === roles.INSTITUTION) {
        userDetail = await Institution.findOne({ userId: user._id });
      } else if (user.role === roles.PERSONAL) {
        userDetail = await Personal.findOne({ userId: user._id });
      }

      // Attach the userDetail to the user object
      req.user = { ...user._doc, userDetail };

      if (requiredRight && resource) {
        // Implement your permission logic here if required
      }

      resolve();
    } catch (error) {
      return reject(
        new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Error fetching user details"
        )
      );
    }
  };

const auth = (requiredRight, resource) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject, requiredRight, resource)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
