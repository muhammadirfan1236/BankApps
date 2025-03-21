const {
  depositStatus,
  transactionTypeStatus,
  passiveActiveStatuses,
} = require("../config/payment");
const { roles, personalType } = require("../config/user");
const { Deposit, Dealer, PaymentMethod, User } = require("../models");
const InstitutionUser = require("../models/institutionUser.model");

const _filterDepositData = (data, username, institutionUser) => {
  return {
    serviceProviderId: data?.recieverId,
    typeId: data?.typeId,
    name: data?.name,
    iban: data?.iban,
    amount: data?.amount,
    senderId: data?.senderId,
    username,
    status:
      data?.isEndUserTransaction == false
        ? depositStatus.APPROVED
        : depositStatus.PENDING,
    paymentMethodId: data?.paymentMethodId,
    institutionId: data?.institutionId,
    isEndUserTransaction: data?.isEndUserTransaction,
    transactionType: data?.transactionType
      ? data?.transactionType
      : transactionTypeStatus.DEPOSIT,
  };
};
function generateRandomUsername() {
  const names = ["John", "Michael", "Sarah", "Jessica", "David", "Emily"];
  const surnames = ["Smith", "Johnson", "Brown", "Williams", "Jones", "Taylor"];
  const name = names[Math.floor(Math.random() * names.length)];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const username = `${name.toLowerCase()}.${surname.toLowerCase()}${
    Math.floor(Math.random() * 900) + 100
  }`;
  return username;
}
/**
 * Add a Deposit
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<User>}
 */
const addDeposit = async (body) => {
  try {
    const username = generateRandomUsername();

    let institutionUser;

    // let user;
    // user = await User.findOne({ email: `${username}@gmail.com` });
    // if (!user) {
    //   user = await User.create({
    //     username: username,
    //     role: roles.ENDUSER,
    //     email: `${username}@gmail.com`,
    //   });
    // }
    // if (body?.isEndUserTransaction) {
    institutionUser = await InstitutionUser.create({
      username,
      isBlocked: false,
      institutionId: body?.institutionId,
      type: personalType.INSTITUTION_USER,
    });
    // }
    console.log("institutionUser", institutionUser);
    const deposit = await Deposit.create(
      _filterDepositData(body, username, institutionUser)
    );
    console.log("deposit", deposit);
    if (!deposit) {
      throw new Error();
    }

    const paymentMethod = await PaymentMethod.findOne({
      _id: body?.paymentMethodId,
    });

    if (
      paymentMethod &&
      deposit?.transactionType == transactionTypeStatus.DEPOSIT
    ) {
      let totalLimitLeft = paymentMethod?.totalLimitLeft - deposit?.amount;
      if (totalLimitLeft < 1) {
        Object.assign(paymentMethod, {
          totalLimitLeft: totalLimitLeft,
          isFull: true,
        });
      } else {
        Object.assign(paymentMethod, {
          totalLimitLeft: totalLimitLeft,
        });
      }

      await paymentMethod.save();
    }
    return deposit;
  } catch (e) {
    throw e;
  }
};
/**
 * Add a Deposit
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<User>}
 */
const getADeposit = async (id) => {
  try {
    const deposit = await Deposit.findOne({ _id: id });
    if (!deposit) {
      throw new Error();
    }
    return deposit;
  } catch (e) {
    throw e;
  }
};

/**
 * Get all Deposits
 * @param {Object} filter - MongoDB filter object
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - Paginated deposits with associated data
 */
const getAllDeposits = async (filter, options, user) => {
  try {
    let allRecords;
    if (
      user.role !== roles.ADMIN &&
      user?.userDetail?.type !== personalType.ADMIN_PERSONAL
    ) {
      const { role, userDetail } = user;
      const { type, _id, personalHolderId } = userDetail;

      if (role === roles.DEALER) {
        filter.serviceProviderId ??= _id;
        allRecords = await Deposit.find(filter).select("status amount");
        if (filter.transactionType === transactionTypeStatus.WITHDRAWAL) {
          filter.status ??= filter.status = { $ne: depositStatus.PENDING };
        }
      } else if (role === roles.INSTITUTION) {
        filter.institutionId ??= _id;
        allRecords = await Deposit.find(filter).select("status amount");
      } else if (role === roles.PERSONAL) {
        if (type === personalType.DEALER_PERSONAL) {
          filter.serviceProviderId ??= personalHolderId;
          allRecords = await Deposit.find(filter).select("status amount");
          if (filter.transactionType === transactionTypeStatus.WITHDRAWAL) {
            filter.status ??= filter.status = { $ne: depositStatus.PENDING };
          }
        } else if (type === personalType.INSTITUTION_PERSONAL) {
          filter.institutionId ??= personalHolderId;
          allRecords = await Deposit.find(filter).select("status amount");
        } else {
          filter.senderId ??= _id;
          allRecords = await Deposit.find(filter).select("status amount");
        }
      }
    } else {
      allRecords = await Deposit.find(filter).select("status amount");
    }
    const pipeline = [
      { $match: filter },

      // Lookup for Personal based on senderId
      {
        $lookup: {
          from: "personals",
          localField: "senderId",
          foreignField: "_id",
          as: "personal",
        },
      },
      {
        $unwind: {
          path: "$personal",
          preserveNullAndEmptyArrays: true, // Keep deposits even if no matching personal is found
        },
      },
      {
        $lookup: {
          from: "dealers", // Collection name for Dealer
          localField: "serviceProviderId",
          foreignField: "_id",
          as: "dealer",
        },
      },
      // Unwind the dealer array to a single object
      {
        $unwind: {
          path: "$dealer",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup for Institution based on personalHolderId in personal
      {
        $lookup: {
          from: "institutions",
          localField: "personal.personalHolderId", // Field in personal
          foreignField: "_id",
          as: "institution",
        },
      },
      {
        $unwind: {
          path: "$institution",
          preserveNullAndEmptyArrays: true, // Keep deposits even if no matching institution is found
        },
      },
      // Lookup for PaymentMethodType based on typeId
      {
        $lookup: {
          from: "paymentmethodtypes", // Collection name for PaymentMethodType
          localField: "typeId",
          foreignField: "_id",
          as: "paymentMethodType",
        },
      },
      // Unwind the paymentMethodType array to a single object
      {
        $unwind: {
          path: "$paymentMethodType",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup for PaymentMethodType based on typeId
      {
        $lookup: {
          from: "paymentmethods", // Collection name for PaymentMethodType
          localField: "paymentMethodId",
          foreignField: "_id",
          as: "paymentMethod",
        },
      },
      // Unwind the paymentMethodType array to a single object
      {
        $unwind: {
          path: "$paymentMethod",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    console.log("filter", filter);
    const transactionCounts = await getStatusCounts(allRecords);
    // Apply pagination options using aggregatePaginate
    const deposits = await Deposit.aggregatePaginate(
      Deposit.aggregate(pipeline),
      options
    );
    const totalAmount = allRecords.reduce((sum, record) => {
      return sum + (record.amount || 0);
    }, 0);

    return {
      deposits,
      transactionCounts,
      totalAmount,
    };
  } catch (e) {
    throw e;
  }
};
const getStatusCounts = async (deposits) => {
  try {
    const statusCounts = {
      PENDING: 0,
      APPROVED: 0,
      DECLINED: 0,
      AWAITING_DEPOSIT: 0,
      MARKED_AS_MANUAL: 0,
      CONFIRM_DEPOSIT: 0,
      PROCESSING: 0,
      PAYMENT_MADE: 0,
      MISSING_INFORMATION: 0,
    };
    const amountCounts = {
      PENDING: 0,
      APPROVED: 0,
      DECLINED: 0,
      AWAITING_DEPOSIT: 0,
      MARKED_AS_MANUAL: 0,
      CONFIRM_DEPOSIT: 0,
      PROCESSING: 0,
      PAYMENT_MADE: 0,
      MISSING_INFORMATION: 0,
    };
    statusCounts.TOTAL_RECORDS = deposits.length;

    deposits.forEach((deposit) => {
      switch (deposit.status) {
        case depositStatus.PENDING:
          statusCounts.PENDING++;
          amountCounts.PENDING = amountCounts.PENDING + deposit.amount;
          break;
        case depositStatus.APPROVED:
          statusCounts.APPROVED++;
          amountCounts.APPROVED = amountCounts.APPROVED + deposit.amount;

          break;
        case depositStatus.DECLINED:
          statusCounts.DECLINED++;
          amountCounts.DECLINED = amountCounts.DECLINED + deposit.amount;

          break;
        case depositStatus.AWAIT_DEPOSIT:
          statusCounts.AWAITING_DEPOSIT++;
          amountCounts.AWAITING_DEPOSIT =
            amountCounts.AWAITING_DEPOSIT + deposit.amount;

          break;
        case depositStatus.MARK_AS_MANUAL:
          statusCounts.MARKED_AS_MANUAL++;
          amountCounts.MARKED_AS_MANUAL =
            amountCounts.MARKED_AS_MANUAL + deposit.amount;

          break;
        case depositStatus.CONFIRM_DEPOSIT:
          statusCounts.CONFIRM_DEPOSIT++;
          amountCounts.CONFIRM_DEPOSIT =
            amountCounts.CONFIRM_DEPOSIT + deposit.amount;

          break;
        case depositStatus.PROCESSING:
          statusCounts.PROCESSING++;
          amountCounts.PROCESSING = amountCounts.PROCESSING + deposit.amount;

          break;
        case depositStatus.PAYMENT_MADE:
          statusCounts.PAYMENT_MADE++;
          amountCounts.PAYMENT_MADE =
            amountCounts.PAYMENT_MADE + deposit.amount;

          break;
        case depositStatus.MISSING_INFORMATION:
          statusCounts.MISSING_INFORMATION++;
          amountCounts.MISSING_INFORMATION =
            amountCounts.MISSING_INFORMATION + deposit.amount;

          break;
        default:
          break;
      }
    });

    return { statusCounts, amountCounts };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a Deposit
 * @returns {Promise<User>}
 */
const deleteDeposit = async (deposit) => {
  try {
    await Deposit.deleteOne({ _id: deposit?._id });
    return true;
  } catch (e) {
    throw e;
  }
};

/**
 * Update a Deposit
 * @returns {Promise<User>}
 */
const updateDeposit = async (deposit, updateBody) => {
  try {
    Object.assign(deposit, updateBody);
    await deposit.save();
    return deposit;
  } catch (e) {
    throw e;
  }
};

const getPaymentAccount = async (amount, typeId) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      typeId,
      paymentMinLimit: { $lte: amount },
      paymentMaxLimit: { $gte: amount },
      totalLimitLeft: { $gte: amount },
    }).sort({ totalLimitLeft: 1 });
    if (!paymentMethod) return null;

    // Find the dealer based on the userId from paymentMethod
    let accountHolder = await Dealer.findOne({ userId: paymentMethod.userId });
    if (!accountHolder) {
      accountHolder = await User.findOne({ id: paymentMethod.userId });
    }
    return { paymentMethod, accountHolder };
  } catch (error) {
    throw error;
  }
};
const getDealerAccountForWithdrawal = async () => {
  try {
    const dealer = await Dealer.findOne({
      withdrawalStatus: passiveActiveStatuses.ACTIVE,
    });
    if (!dealer) {
      throw new Error(
        "Sorry , no dealer is available for wiithdrawal at this moment"
      );
    }
    const paymentMethod = await PaymentMethod.findOne({
      userId: dealer?.userId,
    });
    return { paymentMethod, accountHolder: dealer };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addDeposit,
  getADeposit,
  getAllDeposits,
  deleteDeposit,
  updateDeposit,
  getPaymentAccount,
  getDealerAccountForWithdrawal,
};
