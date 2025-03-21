const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { toJSON, paginate } = require("./plugins");
const userConfig = require("../config/user");

const institutionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
institutionSchema.plugin(toJSON);
institutionSchema.plugin(paginate);
institutionSchema.plugin(aggregatePaginate);

// Set Object and Json property to true. Default is set to false
institutionSchema.set("toObject", { virtuals: true, versionKey: false });
institutionSchema.set("toJSON", { virtuals: true, versionKey: false });

/**
 * @typedef Institution
 */
const Institution = mongoose.model("Institution", institutionSchema);

module.exports = Institution;
