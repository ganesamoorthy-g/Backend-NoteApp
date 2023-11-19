const express = require("express");
const ExpenseModel = require("../Models/Expense.model"); 
const ExpenseRouter = express.Router(); 
const UserModel = require("../Models/Users.model");

ExpenseRouter.post("/createExpense", async (req, res) => {
  try {
    const { type, name, amount, date, description, userId } = req.body;

    const dbExpenseData = await ExpenseModel.create({
      type,
      name,
      amount,
      date,
      description,
      userId,
    });

    const dbUserData = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { expenses: dbExpenseData._id } },
      { new: true }
    );

    if (!dbUserData) {
      return res.status(404).json({ message: "Expense created but no user with this id!" });
    }

    const responseMessage = "Expense successfully created!";
    res.status(200).json({ message: responseMessage });
  } catch (err) {
    res.status(500).json(err);
  }
});



ExpenseRouter.get("/getExpense/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dbExpenseData = await ExpenseModel.find({ userId: id });
    res.json(dbExpenseData || []);
  } catch (err) {
    res.status(500).json(err);
  }
});



ExpenseRouter.delete("/deleteExpense/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dbExpenseData = await ExpenseModel.findOneAndDelete({ _id: id });

    if (!dbExpenseData) {
      return res.status(404).json({ message: "No Expense data found with this id!" });
    }

    const user = await UserModel.findOne({ expenses: id });

    if (!user) {
      return res.status(200).json({ message: "Expense successfully deleted!" });
    }

    await UserModel.updateOne({ _id: user._id }, { $pull: { expenses: id } });

    res.status(200).json({ message: "Expense successfully deleted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});




ExpenseRouter.patch("/updateExpense/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    const dbExpenseData = await ExpenseModel.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true }
    );

    if (!dbExpenseData) {
      return res.status(404).json({ message: "No Expense data found with this id!" });
    }

    res.json(dbExpenseData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = ExpenseRouter;
