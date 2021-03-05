const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const fs = require("fs");

const app = express();
const dateFormat = date.getDate();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

var pwd;
try {
  pwd = fs.readFileSync(__dirname + "/pwd.txt", "utf8");
} catch (err) {
  console.error(err);
}

mongoose.connect(
  "mongodb+srv://arpitanand:" + pwd + "@cluster0.obkqd.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const itemSchema = {
  name: String,
};

const list = mongoose.model("task", itemSchema);

const item1 = new list({
  name: "Welcome to the TO DO List App..",
});
const item2 = new list({
  name: "<<-- Check this box to delete the item.",
});
const item3 = new list({
  name: "Hit + to add the task..",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema],
};

const customList = mongoose.model("customList", listSchema);

app.get("/", (req, res) => {
  //Finding data from db
  list.find((err, result) => {
    if (result.length === 0) {
      //Insertion of Default data when there is no data in the server.
      list.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Items Pushed Successfully !!");
        }
        res.redirect("/");
      });
    } else {
      if (err) {
        console.log(err);
      } else {
        res.render("list", { listTitle: dateFormat, newItems: result });
      }
    }
  });
});

app.get("/:listName", (req, res) => {
  const customListName = _.capitalize(req.params.listName);

  customList.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        //Create New List
        const list = new customList({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list
        res.render("list", {
          listTitle: foundList.name,
          newItems: foundList.items,
        });
      }
    }
  });
});

app.post("/", (req, res) => {
  const taskToSend = req.body.newItem;
  const listToPush = req.body.list;
  const itemToSend = new list({
    name: taskToSend,
  });
  if (listToPush === dateFormat) {
    itemToSend.save();
    res.redirect("/");
  } else {
    customList.findOne({ name: listToPush }, (err, foundList) => {
      foundList.items.push(itemToSend);
      foundList.save();
      res.redirect("/" + listToPush);
    });
  }
});

//About Page
app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/delete", (req, res) => {
  const checkedItemID = req.body.checkBox;
  const listToDeleteItemFrom = req.body.listName;

  if (listToDeleteItemFrom === dateFormat) {
    list.findByIdAndRemove(checkedItemID, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Item Deleted Successfully!");
        res.redirect("/");
      }
    });
  } else {
    customList.findOneAndUpdate(
      { name: listToDeleteItemFrom },
      { $pull: { items: { _id: checkedItemID } } },
      (err, foundList) => {
        if (!err) {
          res.redirect("/" + listToDeleteItemFrom);
        }
      }
    );
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server is listening at Port 3000");
});
