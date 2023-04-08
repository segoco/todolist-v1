/* eslint-disable quotes */
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// tell app to use ejs as the view engine
app.set("view engine", "ejs");

const today = new Date();
const day = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

// route to home page
app.get("/", (req, res) => {
  res.render("list", { kindOfDay: day });
});

// listen to port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
