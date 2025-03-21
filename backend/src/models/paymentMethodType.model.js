const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { toJSON, paginate } = require("./plugins");

const paymentMethodTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
    },
    type: {
      type: Number,
    },
    isParent: {
      type: Boolean,
    },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
paymentMethodTypeSchema.plugin(toJSON);
paymentMethodTypeSchema.plugin(paginate);
paymentMethodTypeSchema.plugin(aggregatePaginate);

// Set Object and Json property to true. Default is set to false
paymentMethodTypeSchema.set("toObject", { virtuals: true, versionKey: false });
paymentMethodTypeSchema.set("toJSON", { virtuals: true, versionKey: false });

/**
 * @typedef PaymentMethodType
 */
const PaymentMethodType = mongoose.model(
  "PaymentMethodType",
  paymentMethodTypeSchema
);

module.exports = PaymentMethodType;
