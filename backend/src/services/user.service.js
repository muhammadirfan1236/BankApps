const httpStatus = require("http-status");
const { User, Dealer, Institution, Personal } = require("../models");
const ApiError = require("../utils/ApiError");
const { roles } = require("../config/user");
const mongoose = require("mongoose");
const { log } = require("winston");
const bcrypt = require("bcryptjs");
const InstitutionUser = require("../models/institutionUser.model");

/**
 * filter User Data from request
 * @param data
 * @returns {*}
 * @private
 */
const _filterUserData = (data) => {
  return {
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
    password: data?.password,
    username: data?.username,
    role: data?.role,
    isSocketOn: true,
  };
};

/**
 * filter Dealer Data from request
 * @param data
 * @returns {*}
 * @private
 */
const _filterDealerData = (data, userId) => {
  return {
    userId,
    payment_range_min: data?.paymentRangeMin,
    payment_range_max: data?.paymentRangeMax,
    classification: data?.classification,
    name: data?.name,
    paymentMethodType: data?.paymentMethodType,
    depositStatus: data?.depositStatus,
    withdrawalStatus: data?.withdrawalStatus,
  };
};

/**
 * filter Institution Data from request
 * @param data
 * @returns {*}
 * @private
 */
const _filterAccountData = (data, userId, loggedInUser) => {
  return {
    userId,
    name: data?.name,
    type: loggedInUser?.role,
    personalHolderId: loggedInUser?.userDetail?._id,
  };
};

/**
 * Filter Social Links data from request
 * @param data
 * @param roleId
 * @returns {{phoneNumber, roleId, name, email}}
 * @private
 */
const _filterSocialUserData = (data) => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    type: data.type,
    facebookId: data.facebookId,
    googleId: data.googleId,
    appleId: data.appleId,
  };
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<{user: *}>}
 */
const findById = async (_id) => {
  try {
    const user = await User.findById(_id).lean();
    if (!user) throw new Error();
    return user;
  } catch (e) {
    return false;
  }
};

/**
 * Validate Email and Username
 * @param userBody
 * @returns {Promise<void>}
 */
const validateEmailandUsername = async (userBody) => {
  const emailExists = await checkEmailValidity(userBody.email);
  // const userNameExists = await checkUsernameValidity(userBody.username);

  // Check if email/username already exists
  if (!emailExists) {
    let message = !emailExists ? "Email" : "";
    // message += !userNameExists ? " Username" : "";

    throw new ApiError(httpStatus.BAD_REQUEST, `${message} already Exists`);
  }
};

/**
 * find User by filters
 * @param filters
 * @param multiple
 * @returns {Promise<*>}
 */
const findByClause = async (filters, multiple = false) => {
  if (multiple) {
    return User.find(filters);
  }
  return User.findOne(filters);
};

/**
 * Create a user
 * @param {Object} userBody
 */
const createUser = async (userBody) => {
  try {
    await validateEmailandUsername(userBody);
    const item = await User.create(_filterUserData(userBody));
    if (!item) {
      throw new Error();
    }
    delete item._doc.password;

    return { ...item.toObject() };
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

/**
 * Create a user against a new social login
 * @param userBody
 * @returns {*}
 */
const createSocialUser = async (userBody) => {
  try {
    // Create User
    const item = await User.create(_filterSocialUserData(userBody));
    if (!item) {
      throw new Error();
    }

    return { ...item.toObject() };
  } catch (error) {
    throw error;
  }
};

/**
 * Check if email exists
 * @param email
 * @returns {Promise<boolean>}
 */
const checkEmailValidity = async (email) => {
  try {
    const user = await findByClause({ email });
    return !user;
  } catch (error) {
    return false;
  }
};

/**
 * check if username exists
 * @param username
 * @returns {Promise<boolean>}
 */
const checkUsernameValidity = async (username) => {
  try {
    const user = await findByClause({ username });
    return !user;
  } catch (error) {
    return false;
  }
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const update = async (user, updateBody) => {
  try {
    Object.assign(user, updateBody);
    await user.save();

    return user;
  } catch (e) {
    throw error;
  }
};

/**
 * Add a delaer
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<User>}
 */
const addDealer = async (body) => {
  try {
    body.role = roles.DEALER;
    const user = await createUser(body);

    if (!user) {
      throw new Error("Unable to create user");
    }

    const dealer = await Dealer.create(_filterDealerData(body, user?._id));

    return { user, dealer };
  } catch (e) {
    throw e;
  }
};

/**
 * Get all dealers with user information using aggregate and aggregatePaginate
 * @returns {Promise<Object>}
 */
const getAllDealers = async (filter, options) => {
  try {
    // Build the aggregation pipeline
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" }, // Unwind to flatten the user data if only one user per dealer
      { $match: filter },
    ];

    // Apply pagination options
    const dealers = await Dealer.aggregatePaginate(
      Dealer.aggregate(pipeline),
      options
    );

    return dealers;
  } catch (e) {
    throw e;
  }
};

/**
 * Get a dealer
 * @returns {Promise<User>}
 */
const getADealer = async (id) => {
  try {
    const dealer = await Dealer.findOne({ _id: id }).populate(
      "userId",
      "_id name email firstName isEmailVerified"
    );
    return dealer;
  } catch (e) {
    throw e;
  }
};

/**
 * Get a dealer
 * @returns {Promise<User>}
 */
const deleteADealer = async (dealer) => {
  try {
    await User.deleteOne({ _id: dealer?.userId });
    await Dealer.deleteOne({ _id: dealer?._id });
    return true;
  } catch (e) {
    throw e;
  }
};

/**
 * Update a Dealer
 * @returns {Promise<User>}
 */
const updateADealer = async (dealer, updateBody) => {
  try {
    let user;
    if (updateBody?.email || updateBody?.password) {
      user = await User.findById(dealer?.userId);
      updateBody?.email && (await validateEmailandUsername(updateBody));
      updateBody?.email && Object.assign(user, { email: updateBody?.email });

      updateBody?.password && (await bcrypt.hash(updateBody?.password, 8));
      updateBody?.password &&
        Object.assign(user, { password: updateBody?.password });

      await user.save();
    }
    Object.assign(dealer, updateBody);
    await dealer.save();
    return { dealer, user };
  } catch (e) {
    throw e;
  }
};

/**
 * Add an Personal or Institution Account
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<User>}
 */
const addAccount = async (body, loggedInUser) => {
  try {
    const user = await createUser(body);

    if (!user) {
      throw new Error("Unable to create user");
    }
    let account;
    if (user?.role === roles.INSTITUTION) {
      account = await Institution.create(_filterAccountData(body, user?._id));
    } else if (user?.role === roles.PERSONAL) {
      account = await Personal.create(
        _filterAccountData(body, user?._id, loggedInUser)
      );
    }

    return { user, account };
  } catch (e) {
    throw e;
  }
};

/**
 * Get all Personal or Institution Accounts with user information using aggregate and aggregatePaginate
 * @returns {Promise<Object>}
 */
const getAllAccounts = async (filter, options, model, user) => {
  try {
    // Build the aggregation pipeline
    if (model == 2) {
      filter = { ...filter, personalHolderId: user?.userDetail?._id };
      if (user.role === roles.ADMIN) {
        delete filter.personalHolderId;
      }
    }
    console.log("filter", filter);
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: filter },
    ];
    if (model == 3) {
      pipeline.push(
        {
          $lookup: {
            from: "institutions", // Join with the institutions collection
            localField: "institutionId",
            foreignField: "_id",
            as: "institution",
          },
        },
        {
          $unwind: {
            path: "$institution",
            preserveNullAndEmptyArrays: true, // Keep records even if there is no match in institutions
          },
        }
      );
    }
    let accounts;
    if (model == 1) {
      accounts = await Institution.aggregatePaginate(
        Institution.aggregate(pipeline),
        options
      );
    } else if (model == 2) {
      accounts = await Personal.aggregatePaginate(
        Personal.aggregate(pipeline),
        options
      );
    } else if (model == 3) {
      accounts = await InstitutionUser.aggregatePaginate(
        InstitutionUser.aggregate(pipeline),
        options
      );
    }

    return accounts;
  } catch (e) {
    throw e;
  }
};

/**
 * Get all Personal Accounts with user information using aggregate and aggregatePaginate
 * @returns {Promise<Object>}
 */
const getAllPersonals = async (filter, options) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" }, // Unwind to flatten the user data if only one user per dealer
      { $match: filter },
    ];

    const personals = await Personal.aggregatePaginate(
      Personal.aggregate(pipeline),
      options
    );

    return personals;
  } catch (e) {
    throw e;
  }
};

/**
 * Get a Personal or Institution
 * @returns {Promise<User>}
 */
const getAAccount = async (id, model, user) => {
  try {
    let account;
    if (model == 1) {
      account = await Institution.findOne({ _id: id }).populate(
        "userId",
        "_id  email role isEmailVerified"
      );
    } else if (model == 2) {
      account = await Personal.findOne({ _id: id }).populate(
        "userId",
        "_id email role isEmailVerified"
      );
    } else if (model == 3) {
      account = await InstitutionUser.findOne({ _id: id }).populate(
        "userId",
        "_id email role isEmailVerified"
      );
    }

    return account;
  } catch (e) {
    throw e;
  }
};

/**
 * Delete a Personal or Institution
 * @returns {Promise<User>}
 */
const deleteAAccount = async (account, model) => {
  try {
    await User.deleteOne({ _id: account?.userId });

    if (model == 1) {
      await Institution.deleteOne({ _id: account?._id });
    } else if (model == 2) {
      await Personal.deleteOne({ _id: account?._id });
    } else if (model == 3) {
      await InstitutionUser.deleteOne({ _id: account?._id });
    }
    return true;
  } catch (e) {
    throw e;
  }
};

/**
 * Update a Personal or Institution
 * @returns {Promise<User>}
 */
const updateAAccount = async (account, model, updateBody) => {
  try {
    let user;
    if (updateBody?.email || updateBody?.password) {
      user = await User.findById(account?.userId);
      updateBody?.email && (await validateEmailandUsername(updateBody));
      updateBody?.email && Object.assign(user, { email: updateBody?.email });

      updateBody?.password && (await bcrypt.hash(updateBody?.password, 8));
      updateBody?.password &&
        Object.assign(user, { password: updateBody?.password });

      await user.save();
    }

    Object.assign(account, updateBody);
    await account.save();

    return { user, account };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  findByClause,
  findById,
  createUser,
  createSocialUser,
  checkUsernameValidity,
  checkEmailValidity,
  validateEmailandUsername,
  update,
  addDealer,
  getAllDealers,
  getADealer,
  deleteADealer,
  addAccount,
  deleteAAccount,
  getAllAccounts,
  getAAccount,
  updateAAccount,
  updateADealer,
  getAllPersonals,
};
