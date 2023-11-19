const { Schema, model } = require("mongoose");

const ActivitySchema = new Schema(
  {
    type: {
      type: String,
      default: "activity",
      required: true
    },
    name: {
      type: String,
      required: true,
      maxlength: 30
    },
    date: {
      type: Date,
      required: true,
    },
   
    completedInMinutes: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 50
    },
  
  
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }
);

const Activity = model("Activity", ActivitySchema);

module.exports = Activity;
