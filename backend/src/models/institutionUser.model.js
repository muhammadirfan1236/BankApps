const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { toJSON, paginate } = require("./plugins");
const userConfig = require("../config/user");

const institutionUserSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
    },
    type: {
      type: Number,
      enum: userConfig.getPersonalTypes,
    },
    institutionId: {
      type: mongoose.SchemaTypes.ObjectId,
    },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
institutionUserSchema.plugin(toJSON);
institutionUserSchema.plugin(paginate);
institutionUserSchema.plugin(aggregatePaginate);

// Set Object and Json property to true. Default is set to false
institutionUserSchema.set("toObject", { virtuals: true, versionKey: false });
institutionUserSchema.set("toJSON", { virtuals: true, versionKey: false });

/**
 * @typedef Institution
 */
const InstitutionUser = mongoose.model(
  "InstitutionUser",
  institutionUserSchema
);

module.exports = InstitutionUser;
