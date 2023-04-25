/* eslint-disable quotes */
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
  } catch (error) {
    console.log(error);
  }
}

initialDBConfig().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.redirect('/Today');
});

app.get('/:listName', async (req, res) => {
  console.log('entro a listName');
  console.log('listName (get/listname): ', req.params.listName);

  await List.findOne({ Name: _.upperCase(req.params.listName) }).then((result) => {
    if (!result) {
      console.log('No existe la lista');
      const list = new List({
        Name: _.upperCase(req.params.listName),
        Items: defaultItems,
      });
      list.save().finally(() => {
        console.log('Guardada listName: ', req.params.listName);
        console.log('variable xyz: ', `/${req.params.listName}`);
        res.redirect(`/${_.capitalize(req.params.listName)}`);
      });
    } else if (_.lowerCase(result.Name) === 'about') {
      res.render('About');
    } else {
      console.log('Existe la lista');
      console.log('result.Name: ', result.Name);
      res.render('list', { listName: _.upperCase(req.params.listName), itemList: result.Items, day });
    }
  });
});

app.post('/', async (req, res) => {
  try {
    console.log('entro a post');
    const { newItem } = req.body;
    const listName = _.upperCase(req.body.listName);
    console.log('listName: ', listName);
    console.log('newItem: ', newItem);
    await List.findOne({ Name: listName }).then((result) => {
      if (result) {
        console.log('Existe la lista');
        console.log('result.Name: ', result.Name);
        console.log('result.Items: ', result.Items);
        result.Items.push({ Name: newItem });
        result
          .save()
          .finally(() => {
            res.redirect(`/${_.capitalize(listName)}`);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log('No existe la lista');
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.post('/delete', async (req, res) => {
  try {
    const { listName } = req.body;
    const idItemToDelete = req.body.checkbox;
    console.log('listName: ', listName);
    console.log('idItemToDelete: ', idItemToDelete);
    await List.findOneAndUpdate({ Name: listName }, { $pull: { Items: { _id: idItemToDelete } } })
      .finally(() => {
        console.log('borro el item');
        res.redirect(`/${_.capitalize(listName)}`);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
});

// listen to port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
