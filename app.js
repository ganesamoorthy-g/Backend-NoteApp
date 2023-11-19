const express = require('express');
const APP_SERVER = express();

// REGISTER ALL THE CONTROLLER IN APP SERVER

APP_SERVER.use("/users", require("./Controllers/Users.controller"));
APP_SERVER.use("/auth", require("./Controllers/Auth.controller"));
APP_SERVER.use("/activity", require("./Controllers/Activity.controller"));
APP_SERVER.use("/expense", require("./Controllers/Expense.controller"));
APP_SERVER.use("/officelog", require("./Controllers/Officelog.controller"));



module.exports = APP_SERVER;