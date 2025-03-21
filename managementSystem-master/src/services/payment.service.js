const { roles } = require("../config/user");
const { PaymentMethodType, PaymentMethod } = require("../models");

const _filterPaymentMethodTypeData = (data) => {
  return {
    name: data?.name,
    description: data?.description,
    status: data?.status,
    isParent: false,
  };
};

const _filterPaymentMethodData = (data) => {
  return {
    userId: data?.dealerId,
    typeId: data?.typeId,
    name: data?.name,
    iban: data?.iban,
    detail: data?.detail,
    paymentMinLimit: data?.paymentMinLimit,
    paymentMaxLimit: data?.paymentMaxLimit,
    totalLimit: data?.totalLimit,
    totalLimitLeft: data?.totalLimit,
    currency: data?.currency,
    isFull: data?.isFull,
    fastTransferStatus: data?.fastTransferStatus,
    bankAccountStatus: data?.bankAccountStatus,
  };
};
/**
 * Add a payment method Type
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<User>}
 */
const addPaymentMethodyType = async (body) => {
  try {
    const paymentMethodType = await PaymentMethodType.create(
      _filterPaymentMethodTypeData(body)
    );
    if (!paymentMethodType) {
      throw new Error();
    }
    return paymentMethodType;
  } catch (e) {
    throw e;
  }
};
/**
 * Get a payment method type
 * @returns {Promise<User>}
 */
const getAPaymentMethodType = async (id) => {
  try {
    const paymentMethodType = await PaymentMethodType.findOne({ _id: id });
    return paymentMethodType;
  } catch (e) {
    throw e;
  }
};

/**
 * Get all payment method
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<User>}
 */
const getAllPaymentMethodyType = async (options, filter) => {
  try {
    // Build the aggregation pipeline

    const pipeline = [{ $match: filter }];
    // Apply pagination options
    const paymentMethodTypes = await PaymentMethodType.aggregatePaginate(
      PaymentMethodType.aggregate(pipeline),
      options
    );
    return paymentMethodTypes;
  } catch (e) {
    throw e;
  }
};

/**
 * Add a payment method
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<User>}
 */
const addPaymentMethod = async (body) => {
  try {
    const paymentMethod = await PaymentMethod.create(
      _filterPaymentMethodData(body)
    );
    if (!paymentMethod) {
      throw new Error();
    }
    return paymentMethod;
  } catch (e) {
    throw e;
  }
};

/**
 * Get all payment methods
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<User>}
 */
const getAllPaymentMethod = async (options, filter, loggedInUser) => {
  try {
    // Build the aggregation pipeline
    // filter = { ...filter, dealerId: loggedInUser?._id };
    filter.userId = loggedInUser?._id;

    loggedInUser?.role === roles.ADMIN && delete filter.userId;

    const pipeline = [{ $match: filter }];

    // Apply pagination options
    const paymentMethod = await PaymentMethod.aggregatePaginate(
      PaymentMethod.aggregate(pipeline),
      options
    );
    return paymentMethod;
  } catch (e) {
    throw e;
  }
};

/**
 * Get a payment method
 * @returns {Promise<User>}
 */
const getAPaymentMethod = async (id) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({ _id: id });
    return paymentMethod;
  } catch (e) {
    throw e;
  }
};

/**
 * Update a payment method
 * @returns {Promise<User>}
 */
const updatePaymentMethod = async (updateBody, paymentMethod) => {
  try {
    if (updateBody?.isAccountLimitReset) {
      updateBody.totalLimitLeft = paymentMethod.totalLimit;
    }
    Object.assign(paymentMethod, updateBody);
    await paymentMethod.save();
    return paymentMethod;
  } catch (e) {
    throw e;
  }
};

/**
 * Delete a payment method
 * @returns {Promise<User>}
 */
const deletePaymentMethod = async (paymentMethod) => {
  try {
    await PaymentMethod.deleteOne({ _id: paymentMethod?._id });
    return true;
  } catch (e) {
    throw e;
  }
};
module.exports = {
  addPaymentMethodyType,
  getAllPaymentMethodyType,
  addPaymentMethod,
  getAllPaymentMethod,
  getAPaymentMethodType,
  getAPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};
