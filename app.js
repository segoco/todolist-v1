/* eslint-disable quotes */
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// tell app to use ejs as the view engine
app.set("view engine", "ejs");

const today = new Date();
today.setDate(today.getDate() + 2);
const currentDay = today.getDay();
const specificDay = today.toLocaleDateString("en-US", { weekday: "long" });

// route to home page
app.get("/", (req, res) => {
  let day = "";

  if (currentDay === 6 || currentDay === 0) {
    day = "Weekend";
    res.render("list", { kindOfDay: day });
  } else {
    day = "Weekday";
    res.render("list", { kindOfDay: day });
  }
});

app.get("/specificDay", (req, res) => {
  res.render("list", { kindOfDay: specificDay });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
