/* eslint-disable quotes */
const items = [];
const workItems = [];

const express = require("express");
const bodyParser = require("body-parser");

const date = require(__dirname + "/date.js");
const day = date.getDate();

const app = express();

// tell app to use ejs as the view engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// route to home page (get request)
app.get("/", (req, res) => {
  res.render("list", { listName: day, itemList: items });
});
app.get("/work", (req, res) => {
  res.render("list", { listName: "Work", itemList: workItems });
});
app.get("/about", (req, res) => {
  res.render("about");
});

// route to home page (post request)
app.post("/", (req, res) => {
  // get the value of the input field
  const item = req.body.newItem;
  if (req.body.listType === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

// listen to port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
