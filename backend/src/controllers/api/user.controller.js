const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const userService = require("../../services/user.service");
// const otpService = require('../../services/otp.service');
const Helper = require("../../utils/Helper");
const messages = require("../../config/messages");
const { User, Dealer, Institution, Personal } = require("../../models");
const { log } = require("winston");
const InstitutionUser = require("../../models/institutionUser.model");

/**
 * Update user personal Information
 * @type {(function(*, *, *): void)|*}
 */
const updateUser = catchAsync(async (req, res) => {
  let user = await User.findById(req.params?.id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.api.userNotFound);
  }
  const updatedUser = await userService.update(user, req.body);
  res.send(
    Helper.apiResponse(httpStatus.OK, messages.api.success, updatedUser)
  );
});

/**
 * Add a dealer
 * @type {(function(*, *, *): void)|*}
 */
const addDealer = catchAsync(async (req, res) => {
  const dealer = await userService.addDealer(req.body);
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, dealer));
});

/**
 * Get all dealer
 * @type {(function(*, *, *): void)|*}
 */
const getAllDealers = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page"]);
  // if (req.query.sortBy) {
  //   options.sort = {};
  //   // eslint-disable-next-line prefer-destructuring
  //   options.sort[req.query.sortBy.split(":")[0]] =
  //     req.query.sortBy.split(":")[1];
  // }
  options.sort = {};

  req.query.sortBy
    ? (options.sort[req.query.sortBy.split(":")[0]] =
        req.query.sortBy.split(":")[1])
    : (options.sort["createdAt"] = "desc");
  let filter = {};
  if (req.query.searchTerm) {
    const term = req.query.searchTerm.trim();

    // Try to parse the term as a number for the dealer fields
    const termAsNumber = parseFloat(term);

    filter = {
      $or: [
        { "user.email": { $regex: term, $options: "i" } },
        { name: { $regex: term, $options: "i" } },
        ...(isNaN(termAsNumber)
          ? [] // If the term is not a number, don't include numeric fields
          : [
              { payment_range_min: termAsNumber },
              { payment_range_max: termAsNumber },
            ]),
      ],
    };
  }

  const dealers = await userService.getAllDealers(filter, options);
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, dealers));
});

/**
 * Get a dealer
 * @type {(function(*, *, *): void)|*}
 */
const getADealer = catchAsync(async (req, res) => {
  const dealer = await userService.getADealer(req.params?.id);
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, dealer));
});

/**
 * Delete a dealer
 * @type {(function(*, *, *): void)|*}
 */
const deleteADealer = catchAsync(async (req, res) => {
  const dealer = await Dealer.findById(req.params.id).select("_id userId");
  if (!dealer) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.dealer.notFound);
  }
  const deleteDealer = await userService.deleteADealer(dealer);
  res.send(
    Helper.apiResponse(httpStatus.OK, messages.api.success, deleteDealer)
  );
});

/**
 * Update a Dealer
 * @type {(function(*, *, *): void)|*}
 */
const updateADealer = catchAsync(async (req, res) => {
  const dealer = await Dealer.findById(req.params.id);

  if (!dealer) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.dealer.notFound);
  }
  const updateDealer = await userService.updateADealer(dealer, req.body);
  res.send(
    Helper.apiResponse(httpStatus.OK, messages.api.success, updateDealer)
  );
});

/**
 * Add a  Personal or Institution Account
 * @type {(function(*, *, *): void)|*}
 */
const addAccount = catchAsync(async (req, res) => {
  const account = await userService.addAccount(req.body, req.user);
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, account));
});

/**
 * Get all Personal or Institution Accounts
 * @type {(function(*, *, *): void)|*}
 */
const getAllAccounts = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page"]);
  // if (req.query.sortBy) {
  //   options.sort = {};
  //   // eslint-disable-next-line prefer-destructuring
  //   options.sort[req.query.sortBy.split(":")[0]] =
  //     req.query.sortBy.split(":")[1];
  // }
  options.sort = {};

  req.query.sortBy
    ? (options.sort[req.query.sortBy.split(":")[0]] =
        req.query.sortBy.split(":")[1])
    : (options.sort["createdAt"] = "desc");
  let filter = {
    ...(req.query.type && { type: Number(req.query.type) }),
  };
  if (req.query.searchTerm) {
    const term = req.query.searchTerm.trim();
    filter = {
      ...filter,

      $or: [
        { name: { $regex: term, $options: "i" } },
        { "user.username": { $regex: term, $options: "i" } },
        { "user.email": { $regex: term, $options: "i" } },
      ],
    };
  }

  const account = await userService.getAllAccounts(
    filter,
    options,
    req.query.model,
    req.user
  );
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, account));
});

/**
 * Get all Personals
 * @type {(function(*, *, *): void)|*}
 */
const getAllPersonal = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page"]);
  // if (req.query.sortBy) {
  //   options.sort = {};
  //   // eslint-disable-next-line prefer-destructuring
  //   options.sort[req.query.sortBy.split(":")[0]] =
  //     req.query.sortBy.split(":")[1];
  // }
  options.sort = {};

  req.query.sortBy
    ? (options.sort[req.query.sortBy.split(":")[0]] =
        req.query.sortBy.split(":")[1])
    : (options.sort["createdAt"] = "desc");
  let filter = {
    ...(req.query.type && { type: Number(req.query.type) }),
  };
  if (req.query.searchTerm) {
    const term = req.query.searchTerm.trim();
    filter = {
      ...filter,

      $or: [
        { name: { $regex: term, $options: "i" } },
        { "user.email": { $regex: term, $options: "i" } },
      ],
    };
  }

  const personal = await userService.getAllPersonals(filter, options);
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, personal));
});

/**
 * Get a  Personal or Institution
 * @type {(function(*, *, *): void)|*}
 */
const getAAccount = catchAsync(async (req, res) => {
  const account = await userService.getAAccount(
    req.params?.id,
    req.query.model,
    req.user
  );
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, account));
});

/**
 * Delete a Personal or Institution
 * @type {(function(*, *, *): void)|*}
 */
const deleteAAccount = catchAsync(async (req, res) => {
  let account;
  if (req.query.model == 1)
    account = await Institution.findById(req.params.id).select("_id userId");
  else if (req.query.model == 2)
    account = await Personal.findById(req.params.id).select("_id userId");
  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.api.userNotFound);
  }
  const deleteAccount = await userService.deleteAAccount(
    account,
    req.query.model
  );
  res.send(
    Helper.apiResponse(httpStatus.OK, messages.api.success, deleteAccount)
  );
});

/**
 * Update a Personal or Institution
 * @type {(function(*, *, *): void)|*}
 */
const updateAAccount = catchAsync(async (req, res) => {
  let account;
  if (req.query.model == 1) account = await Institution.findById(req.params.id);
  else if (req.query.model == 2)
    account = await Personal.findById(req.params.id);
  else if (req.query.model == 3)
    account = await InstitutionUser.findById(req.params.id);

  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.api.userNotFound);
  }
  const updateAccount = await userService.updateAAccount(
    account,
    req.query.model,
    req.body
  );
  res.send(
    Helper.apiResponse(httpStatus.OK, messages.api.success, updateAccount)
  );
});
module.exports = {
  updateUser,
  addDealer,
  getAllDealers,
  getADealer,
  deleteADealer,
  addAccount,
  getAAccount,
  getAllAccounts,
  deleteAAccount,
  updateAAccount,
  updateADealer,
  getAllPersonal,
};
