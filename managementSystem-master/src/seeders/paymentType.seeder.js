const { paymentTypesSeederData } = require("../config/payment");
const { PaymentMethodType } = require("../models");
const seedPaymentTypes = async () => {
  console.log("****** SEEDING PAYMENT TYPES *******");
  const result = await PaymentMethodType.insertMany(paymentTypesSeederData);
  console.log("****** PAYMENT TYPES SEEDED SUCCESFULLY *******");
};
module.exports = seedPaymentTypes;
