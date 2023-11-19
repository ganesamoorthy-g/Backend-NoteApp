const { Schema, model } = require("mongoose");

const OfficeLogSchema = new Schema(
  {
    type: {
      type: String,
      default: "officelog",
      required: true
    },
    name: {
      type: String,
      required: true,
      maxlength: 30
    },
    pendingInDays: {
      type: Number,
      required: true,
      maxlength: 30
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 60
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }
);

const OfficeLogModel = model("OfficeLog", OfficeLogSchema);

module.exports = OfficeLogModel;
