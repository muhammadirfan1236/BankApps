const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const { roles, rolesReverseForVerifyingRoles } = require("../config/user");

// Middleware to check if the user has the specified role
const checkRole = (requiredRole) => async (req, res, next) => {
  try {
    // Ensure user is authenticated before checking roles
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
    }

    // Get user's roles from the database or helper function
    const user = await User.findOne({ _id: req?.user?._id });

    let userRole = user?.role;
    userRole = rolesReverseForVerifyingRoles[userRole];
    // Check if the user's roles is equal the required role
    if (!requiredRole.includes(userRole)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "You are not authorized for this action"
      );
    }
    // if (userRole !== requiredRole) {
    //   throw new ApiError(
    //     httpStatus.FORBIDDEN,
    //     "You are not authorized for this action"
    //   );
    // }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkRole;
