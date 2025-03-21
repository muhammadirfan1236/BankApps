const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { toJSON, paginate } = require("./plugins");
const { getPersonalTypes } = require("../config/user");

const personalSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    type: {
      type: Number,
      enum: getPersonalTypes,
    },
    personalHolderId: {
      type: mongoose.SchemaTypes.ObjectId,
    },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
personalSchema.plugin(toJSON);
personalSchema.plugin(paginate);
personalSchema.plugin(aggregatePaginate);

// Set Object and Json property to true. Default is set to false
personalSchema.set("toObject", { virtuals: true, versionKey: false });
personalSchema.set("toJSON", { virtuals: true, versionKey: false });

/**
 * @typedef Personal
 */
const Personal = mongoose.model("Personal", personalSchema);

module.exports = Personal;
