/* eslint-disable quotes */
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const _ = require('lodash');
const db = require('./db');

const date = require(__dirname + '/date.js');
const day = date.getDate();
const app = express();
let defaultItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(favicon(`${__dirname}/public/images/favicon.ico`));

db.connect();

const Item = require('./model/item');
const List = require('./model/list');

async function initialListConfig() {
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
    console.error(error);
  }
}

initialListConfig().catch((err) => console.error(err));

app.get('/', (req, res) => {
  res.redirect('/Today');
});

app.get('/:listName', async (req, res) => {
  const listName = _.capitalize(req.params.listName);

  await List.findOne({ Name: listName }).then((result) => {
    if (!result) {
      const list = new List({
        Name: listName,
        Items: defaultItems,
      });
      list.save().finally(() => {
        res.redirect(`/${listName}`);
      });
    } else if (listName === 'About') {
      res.render('About');
    } else {
      res.render('list', { listName, itemList: result.Items, day });
    }
  });
});

app.post('/', async (req, res) => {
  try {
    const { newItem } = req.body;
    const listName = _.capitalize(req.body.listName);
    await List.findOne({ Name: listName }).then((result) => {
      if (result) {
        result.Items.push({ Name: newItem });
        result
          .save()
          .finally(() => {
            res.redirect(`/${listName}`);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  } catch (error) {
    console.error(error);
  }
});

app.post('/delete', async (req, res) => {
  try {
    const { listName } = req.body;
    const idItemToDelete = req.body.checkbox;
    await List.findOneAndUpdate({ Name: listName }, { $pull: { Items: { _id: idItemToDelete } } })
      .finally(() => {
        res.redirect(`/${listName}`);
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (error) {
    console.error(error);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.info('Server is running on port 3000');
});

process.on('SIGINT', () => {
  db.disconnect();
  console.error('La conexión a la base de datos se ha cerrado.');
  process.exit();
});
