const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const Helper = require("../../utils/Helper");
const messages = require("../../config/messages");
const { depositService } = require("../../services");
const ApiError = require("../../utils/ApiError");
const pick = require("../../utils/pick");
const { Deposit } = require("../../models");
const { ObjectId } = require("mongodb");
const { transactionTypeStatus } = require("../../config/payment");

/**
 * Store a Deposit
 * @type {(function(*, *, *): void)|*}
 */
const storeDeposit = catchAsync(async (req, res) => {
  const deposit = await depositService.addDeposit(req.body);
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, deposit));
});
/**
 * Get a Deposit
 * @type {(function(*, *, *): void)|*}
 */
const getADeposit = catchAsync(async (req, res) => {
  const deposit = await depositService.getADeposit(req.params?.id);
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, deposit));
});

/**
 * Get all Deposits
 * @type {(function(*, *, *): void)|*}
 */
const getAllDeposit = catchAsync(async (req, res) => {
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
    ...(req.query.senderId && { senderId: new ObjectId(req.query.senderId) }),
    ...(req.query.status && { status: Number(req.query.status) }),
    ...(req.query.receiverId && {
      serviceProviderId: new ObjectId(req.query.receiverId),
    }),
    ...(req.query.typeId && { typeId: new ObjectId(req.query.typeId) }),
    ...(req.query.transactionType && {
      transactionType: Number(req.query.transactionType),
    }),
    // transactionType: req.query.transactionType
    //   ? Number(req.query.transactionType)
    //   : transactionTypeStatus.DEPOSIT,
  };
  if (req.query.searchTerm) {
    const term = req.query.searchTerm.trim();
    // Try to parse the term as a number for the dealer fields
    const termAsNumber = parseFloat(term);
    filter = {
      ...filter,
      $or: [
        { name: { $regex: term, $options: "i" } },
        { iban: { $regex: term, $options: "i" } },
        ...(isNaN(termAsNumber)
          ? [] // If the term is not a number, don't include numeric fields
          : [{ amount: termAsNumber }]),
      ],
    };
  }

  // Add date range filter for createdAt
  if (req.query.minDate && req.query.maxDate) {
    filter.createdAt = {
      $gte: new Date(req.query.minDate),
      $lte: new Date(req.query.maxDate),
    };
  }
  const deposits = await depositService.getAllDeposits(
    filter,
    options,
    req.user
  );
  res.send(Helper.apiResponse(httpStatus.OK, messages.api.success, deposits));
});

/**
 * Update a deposit
 * @type {(function(*, *, *): void)|*}
 */
const updateADeposit = catchAsync(async (req, res) => {
  const deposit = await Deposit.findById(req.params.id);
  if (!deposit) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.deposit.notFound);
  }
  const updatedDeposit = await depositService.updateDeposit(deposit, req.body);
  res.send(
    Helper.apiResponse(httpStatus.OK, messages.api.success, updatedDeposit)
  );
});
/**
 * Delete a deposit
 * @type {(function(*, *, *): void)|*}
 */
const deleteADeposit = catchAsync(async (req, res) => {
  const deposit = await Deposit.findById(req.params.id);
  if (!deposit) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.deposit.notFound);
  }
  const deletedDeposit = await depositService.deleteDeposit(deposit);
  res.send(
    Helper.apiResponse(httpStatus.OK, messages.api.success, deletedDeposit)
  );
});

/**
 * Get a payment account
 * @type {(function(*, *, *): void)|*}
 */
const getAPaymentAccount = catchAsync(async (req, res) => {
  const paymentAccount = await depositService.getPaymentAccount(
    req.query.amount,
    req.query.typeId
  );
  res.send(
    Helper.apiResponse(httpStatus.OK, messages.api.success, paymentAccount)
  );
});
/**
 * Get all Deposits
 * @type {(function(*, *, *): void)|*}
 */
const getADealerWithdrawal = catchAsync(async (req, res) => {
  const dealerAccount = await depositService.getDealerAccountForWithdrawal();
  res.send(
    Helper.apiResponse(httpStatus.OK, messages.api.success, dealerAccount)
  );
});
module.exports = {
  storeDeposit,
  getADeposit,
  getAllDeposit,
  deleteADeposit,
  updateADeposit,
  getAPaymentAccount,
  getADealerWithdrawal,
};
