const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const newTask = [];
const newTaskListWork = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  let dateFormat = date.getDate();
  res.render("list", { listTitle: dateFormat, newItems: newTask });
});

app.post("/", (req, res) => {
  const itemToPush = req.body.newItem;
  if (req.body.list === "Work") {
    newTaskListWork.push(itemToPush);
    res.redirect("/work");
  } else {
    newTask.push(itemToPush);
    res.redirect("/");
  }
});

// Work Page

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work", newItems: newTaskListWork });
});

app.post("/work", (req, res) => {});

//About Page
app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is listening at Port 3000");
});
