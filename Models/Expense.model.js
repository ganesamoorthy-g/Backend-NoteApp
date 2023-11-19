const { Schema, model } = require("mongoose");

const ExpenseSchema = new Schema(
  {
    type: {
      type: String,
      default: "expense",
      required: true
    },
    name: {
      type: String,
      required: true,
      maxlength: 30
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 22
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }
);

const Expense = model("Expense", ExpenseSchema);

module.exports = Expense;
