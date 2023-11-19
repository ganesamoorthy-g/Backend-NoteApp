const express = require("express");
const OfficeLogModel = require("../Models/OfficeLog.model"); 
const OfficeLogRouter = express.Router(); 
const UserModel = require("../Models/Users.model");

OfficeLogRouter.post("/createOfficeLog", async (req, res) => {
  try {
    const { type, name, pendingInDays, date, description, userId } = req.body;

    const dbOfficeLogData = await OfficeLogModel.create({
      type,
      name,
      pendingInDays,
      date,
      description,
      userId,
    });

    const dbUserData = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { officelogs: dbOfficeLogData._id } },
      { new: true }
    );

    if (!dbUserData) {
      return res.status(404).json({ message: "OfficeLog created but no user with this id!" });
    }

    const responseMessage = "OfficeLog successfully created!";
    res.status(200).json({ message: responseMessage });
  } catch (err) {
    res.status(500).json(err);
  }
});

OfficeLogRouter.get("/getOfficeLog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dbOfficeLogData = await OfficeLogModel.find({ userId: id });
    res.json(dbOfficeLogData || []);
  } catch (err) {
    res.status(500).json(err);
  }
});

OfficeLogRouter.delete("/deleteOfficeLog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dbOfficeLogData = await OfficeLogModel.findOneAndDelete({ _id: id });

    if (!dbOfficeLogData) {
      return res.status(404).json({ message: "No OfficeLog data found with this id!" });
    }

    const user = await UserModel.findOne({ officelogs: id });

    if (!user) {
      return res.status(200).json({ message: "OfficeLog successfully deleted!" });
    }

    await UserModel.updateOne({ _id: user._id }, { $pull: { officelogs: id } });

    res.status(200).json({ message: "OfficeLog successfully deleted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

OfficeLogRouter.patch("/updateOfficeLog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    const dbOfficeLogData = await OfficeLogModel.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true }
    );

    if (!dbOfficeLogData) {
      return res.status(404).json({ message: "No OfficeLog data found with this id!" });
    }

    res.json(dbOfficeLogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = OfficeLogRouter;
