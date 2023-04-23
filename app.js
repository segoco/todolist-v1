/* eslint-disable quotes */
let items = [];
const workItems = [];

const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const moongoose = require('./db');
const _ = require('lodash');
const Item = require('./model/item');
const List = require('./model/list');

const date = require(__dirname + '/date.js');
const day = date.getDate();
const app = express();
let defaultItems = [];
let queryResult;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(favicon(`${__dirname}/public/images/favicon.ico`));

async function initialDBConfig() {
  try {
    const item1 = new Item({
      Name: 'Welcome to your todolist!',
    });
    const item2 = new Item({
      Name: 'Hit the + button to add a new item.',
    });
    const item3 = new Item({
      Name: '<-- Hit this check to delete an item.',
    });

    defaultItems = [item1, item2, item3];

    // queryResult = await Item.find();
    // if (queryResult.length === 0) {
    //   Item.insertMany(defaultItems)
    //     .then(() => {
    //       console.log('successfuly saved');
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
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

app.get('/', (req, res) => {
  res.redirect('/Today');
});

app.get('/:listName', async (req, res) => {
  console.log('entro a listName');
  console.log('listName (get/listname): ', req.params.listName);

  await List.findOne({ Name: req.params.listName }).then((result) => {
    if (!result) {
      console.log('No existe la lista');
      const list = new List({
        Name: req.params.listName,
        Items: defaultItems,
      });
      list.save().finally(() => {
        console.log('Guardada listName: ', req.params.listName);
        console.log('variable xyz: ', `/${req.params.listName}`);
        res.redirect(`/${req.params.listName}`);
      });
    } else if (_.lowerCase(result.Name) === 'about') {
      res.render('About');
    } else {
      console.log('Existe la lista');
      console.log('result.Name: ', result.Name);
      res.render('list', { listName: req.params.listName, itemList: result.Items, day });
    }
  });
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

app.post('/', async (req, res) => {
  try {
    const { newItem } = req.body;
    const { listName } = req.body;
    console.log('listName: ', listName);
    console.log('newItem: ', newItem);
    if (listName === day) {
      console.log('entro a home');
      await insertItemDB(newItem).finally(() => {
        res.redirect('/');
      });
    } else {
      console.log('entro a otra lista');
      const listFound = await List.findOne({ Name: listName });
      console.log('list: ', listFound.Items);
      listFound.Items.push({ Name: newItem });
      listFound.save().finally(() => {
        res.redirect(`/${listName}`);
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post('/delete', async (req, res) => {
  try {
    const { listName } = req.body;
    const idItemToDelete = req.body.checkbox;
    console.log('listName: ', listName);
    if (listName === day) {
      console.log('entro a home');
      await Item.findByIdAndRemove(idItemToDelete).finally(() => {
        res.redirect('/');
      });
    } else {
      console.log('entro a otra lista');
      const ListFound = await List.findOne({ Name: listName });
      ListFound.Items.pull(idItemToDelete);
      ListFound.save().finally(() => {
        res.redirect(`/${listName}`);
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// listen to port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
