const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { toJSON, paginate } = require("./plugins");

const paymentMethodSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    typeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "PaymentMethodType",
    },
    name: {
      type: String,
    },
    iban: {
      type: String,
    },
    detail: {
      type: String,
    },
    paymentMinLimit: {
      type: Number,
    },
    paymentMaxLimit: {
      type: Number,
    },
    totalLimit: {
      type: Number,
    },
    totalLimitLeft: {
      type: Number,
    },
    currency: {
      type: String,
    },
    isFull: {
      type: Boolean,
    },
    fastTransferStatus: {
      type: Number,
    },
    bankAccountStatus: {
      type: Number,
    },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
paymentMethodSchema.plugin(toJSON);
paymentMethodSchema.plugin(paginate);
paymentMethodSchema.plugin(aggregatePaginate);

// Set Object and Json property to true. Default is set to false
paymentMethodSchema.set("toObject", { virtuals: true, versionKey: false });
paymentMethodSchema.set("toJSON", { virtuals: true, versionKey: false });

/**
 * @typedef PaymentMethod
 */
const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);

module.exports = PaymentMethod;
