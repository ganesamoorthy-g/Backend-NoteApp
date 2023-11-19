const express = require("express");
const Activitymodel = require("../Models/Activity.model"); 
const ActivityRouter = express.Router(); 
const UserModel = require("../Models/Users.model");



ActivityRouter.post("/createActivity", async (req, res) => {
    try {
      const { type, name,date, completedInMinutes, description, userId } = req.body;
  
      const dbActivityData = await Activitymodel.create({
        type,
        name,
        date,
        completedInMinutes,
        description,
        userId,
      });
  
     
      const dbUserData = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $push: { activity: dbActivityData._id } },
        { new: true }
      );
  
      if (!dbUserData) {
        // console.log("No user found with this id!");
        return res.status(404).json({ message: "Activity created but no user with this id!" });
      }
  
      // console.log("Activity successfully created!");
  
      // Log the custom response and send it
      const responseMessage = "Activity successfully created!";
      // console.log("Response:", responseMessage);
      res.status(200).json({ message: responseMessage });
    } catch (err) {
      // console.error("Error:", err); 
      res.status(500).json(err);
    }
  });


  // Get Activity by id
  ActivityRouter.get("/getActivity/:id", async (req, res) => {
    try {
      const { id } = req.params;
  // Use userId to filter by user
      const dbActivityData = await Activitymodel.find({ userId: id }); 
  // Return an empty array if no cardio data found
      res.json(dbActivityData || []); 
    } catch (err) {
      res.status(500).json(err);
    }
  });



// Delete a Activity by ID
ActivityRouter.delete("/deleteActivity/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the Aerobic data
    const dbActivityData = await Activitymodel.findOneAndDelete({ _id: id });

    if (!dbActivityData) {
      return res.status(404).json({ message: "No Activity data found with this id!" });
    }

    // Find the user associated with the Aerobic data
    const user = await UserModel.findOne({ activity: id });

    if (!user) {
      // Return success even if no associated user found
      return res.status(200).json({ message: "Activity  successfully deleted!" });
    }

    // Remove the Activity ID from the user's Aerobic array
    await UserModel.updateOne({ _id: user._id }, { $pull: { activity: id } });

    // Return a 200 status code and a success message
    res.status(200).json({ message: "Activity successfully deleted!" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});



// Update Activity by id

ActivityRouter.patch("/updateActivity/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body; // Fields to update

    // Find the  activity by ID and update the specified fields
    const dbActivityData = await Activitymodel.findOneAndUpdate(
      { _id: id },
      { $set: updateFields }, // Use $set to update specific fields
      { new: true }
    );

    if (!dbActivityData) {
      return res.status(404).json({ message: "No Activity data found with this id!" });
    }

    res.json(dbActivityData);
  } catch (err) {
    res.status(500).json(err);
  }
});
  
  
  module.exports = ActivityRouter;