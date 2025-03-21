const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const { toJSON, paginate } = require("./plugins");

const depositSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Personal",
    },
    serviceProviderId: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    typeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "PaymentMethodType",
    },
    paymentMethodId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "PaymentMethod",
    },
    institutionId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Institution",
    },
    transactionId: {
      type: Number, // Field for auto-increment
      unique: true,
    },
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    iban: {
      type: String,
    },
    amount: {
      type: Number,
    },
    status: {
      type: Number,
    },
    transactionType: {
      type: Number,
    },
    isEndUserTransaction: {
      type: Boolean,
    },
    processedBy: {
      type: mongoose.SchemaTypes.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
depositSchema.plugin(toJSON);
depositSchema.plugin(paginate);
depositSchema.plugin(aggregatePaginate);
// Add the AutoIncrement plugin for transactionId
// Configure auto-increment for transactionId
depositSchema.plugin(autoIncrement.plugin, {
  model: "Deposit", // Name of the model
  field: "transactionId", // Field to auto-increment
  startAt: 1000, // Starting value
  incrementBy: 1, // Increment value
});

// Set Object and Json property to true. Default is set to false
depositSchema.set("toObject", { virtuals: true, versionKey: false });
depositSchema.set("toJSON", { virtuals: true, versionKey: false });

/**
 * @typedef deposit
 */
const Deposit = mongoose.model("Deposit", depositSchema);

module.exports = Deposit;
