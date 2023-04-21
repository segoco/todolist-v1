/* eslint-disable quotes */
let items = [];
const workItems = [];

const express = require('express');
const bodyParser = require('body-parser');
const moongoose = require('./db');
const Item = require('./model/item');
const List = require('./model/list');

const date = require(__dirname + '/date.js');
const day = date.getDate();
const app = express();
let defaultItems = [];
let queryResult;

// tell app to use ejs as the view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initial DB Config
async function initialDBConfig() {
  try {
    const item1 = new Item({
      Name: 'Welcome to your todolist!',
    });
    const item2 = new Item({
      Name: 'Hit the + button to add a new item.',
    });
    const item3 = new Item({
      Name: '<-- Hit this to delete an item.',
    });

    defaultItems = [item1, item2, item3];

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
  } catch (error) {
    console.log(error);
  }
}

initialDBConfig().catch((err) => console.log(err));

async function findItemsDB() {
  let itemsFound = [];
  try {
    itemsFound = await Item.find();
  } catch (error) {
    console.log(error);
  }
  return itemsFound;
}

// route to home page (get request)
app.get('/', async (req, res) => {
  try {
    items = await findItemsDB();
    res.render('list', { listName: day, itemList: items });
  } catch (error) {
    console.log(error);
  }
});

app.get('/:listName', async (req, res) => {
  await List.findOne({ Name: req.params.listName }).then((result) => {
    if (!result) {
      console.log('No existe la lista');
      const list = new List({
        Name: req.params.listName,
        Items: defaultItems,
      });
      list.save().finally(() => {
        res.redirect(`/${req.params.listName}`);
      });
    } else {
      console.log('Existe la lista');
      res.render('list', { listName: result.Name, itemList: result.Items });
    }
  });
});

app.get('/work', (req, res) => {
  res.render('list', { listName: 'Work', itemList: workItems });
});
app.get('/about', (req, res) => {
  res.render('about');
});

async function insertItemDB(item) {
  try {
    const newItem = new Item({
      Name: item,
    });
    await newItem.save();
  } catch (error) {
    console.log(error);
  }
}

// route to home page (post request)
app.post('/', async (req, res) => {
  try {
    const newItem = req.body.newItem;
    await insertItemDB(newItem).finally(() => {
      res.redirect('/');
    });
  } catch (error) {
    console.log(error);
  }
});

app.post('/delete', async (req, res) => {
  try {
    const idItemToDelete = req.body.checkbox;
    await Item.findByIdAndRemove(idItemToDelete).finally(() => {
      res.redirect('/');
    });
  } catch (error) {
    console.log(error);
  }
});

// listen to port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
