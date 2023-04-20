/* eslint-disable quotes */
let items = [];
const workItems = [];

const express = require('express');
const bodyParser = require('body-parser');

const date = require(__dirname + '/date.js');
const day = date.getDate();
const app = express();
let queryResult;
let mongoose;

// tell app to use ejs as the view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initial DB Config
async function initialDBConfig() {
  try {
    mongoose = require('./db');
    const Item = require('./model');
    const item1 = new Item({
      Name: 'Welcome to your todolist!',
    });
    const item2 = new Item({
      Name: 'Hit the + button to add a new item.',
    });
    const item3 = new Item({
      Name: '<-- Hit this to delete an item.',
    });

    const defaultItems = [item1, item2, item3];

    queryResult = await Item.find();
    console.log(`se encontraron: ${queryResult.length} items`);
    if (queryResult.length === 0) {
      Item.insertMany(defaultItems)
        .then(() => {
          console.log('successfuly saved');
        })
        .catch((err) => {
          console.log(err);
        });
    }
    mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
}

initialDBConfig().catch((err) => console.log(err));

async function findItemsDB() {
  items = await Item.find().lean();
  return items.map((item) => item.Name);
}

async function insertItemDB(item) {
  // const newItem = new Item({
  //   Name: item,
  // });
  // await newItem.save();
}

// route to home page (get request)
app.get('/', async (req, res) => {
  // try {
  //   const mongoose = require('./db');
  //   items = await findItemsDB();
  //   console.log(items);
  //   res.render('list', { listName: day, itemList: items });
  // } catch (error) {
  //   console.log(error);
  // }
});

app.get('/work', (req, res) => {
  res.render('list', { listName: 'Work', itemList: workItems });
});
app.get('/about', (req, res) => {
  res.render('about');
});

// route to home page (post request)
app.post('/', (req, res) => {
  // get the value of the input field
  // const item = req.body.newItem;
  // if (req.body.listType === 'Work') {
  //   workItems.push(item);
  //   res.redirect('/work');
  // } else {
  //   insertItemDB(item);
  //   res.redirect('/');
  // }
});

// listen to port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
