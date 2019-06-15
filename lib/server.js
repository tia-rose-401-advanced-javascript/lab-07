'use strict';

/** @module lib/server */

const express = require('express');
const swaggify = require('./swaggify.js');

const app = express();


let db = [];

/**
 * @constructor
 * @param {String} alias - Alias of hero 
 * @param {Number} id  - Unique identifier for the hero Object
 */ 


function Hero(alias, id){
  if(typeof alias === 'string'){
    this.alias;
  }else{
    throw new Error ('invalid alias provided');
  }
  id = Number(id);
  this.id = id ? id :this.id = db.length + 1;
}

app.use(express.json());

swaggify(app);

/**
 * Middleware to log METHOD and PATH of request
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 */
app.use( (req) => {
  console.log('LOG:', req.method, req.path);
});

/**
 * @swagger
 * /categories
 *  get
 *    responses
 *      '200'
 *        description Get all intries
 *        content
 *          application/json
 *            schema
 *              type object
 *              properties
 *                name
 *                  type string
 *                  example "Matt-Man"
 */
app.get('/categories', () => {
  let count = db.length;
  let results = db;
  res.json({count,results});
});

/**
 * @swagger
 * /categories/:id
 *  get
 *    responses
 *      '200'
 *        description Gets an entry
 *        content
 *          application/json
 *            schema
 *              type object
 *              properties
 *                name
 *                  type string
 *                  example "Matt-Man"
 */
app.get('/categories/:id', (req) => {
  let id = req.params.id;
  let record = db.filter((record) => record.id === parseInt(id));
  res.json(record[0]);
});

/**
 * @swagger
 * /categories/:id
 *  post
 *    responses
 *      '200'
 *        description Adds an entry
 *        content
 *          application/json
 *            schema
 *              type object
 *              properties
 *                name
 *                  type string
 *                  example "Matt-Man"
 */
app.post('/categories', (req, res) => {
  let hero = new Hero(req.body.name);
  db.push(hero);
  res.json(db);
});

/**
 * @swagger
 * /categories/:id
 *  put
 *    responses
 *      '200'
 *        description Changes an entry
 *        content
 *          application/json
 *            schema
 *              type object
 *              properties
 *                name
 *                  type string
 *                  example "Matt-Man"
 */
app.put('/categories/:id', (req,res) => {
  let id = req.params.id;

  if (!req.body.name || typeof req.body.name !== 'string') {
    console.error('Invalid name');
  } else {  
    let hero = new Hero(req.body.name, id);
    let index = -1;

    for (let i = 0; i < db.length; i++) {
      if (db[i].id === Number(id)) {
        index = i;
        db.splice(index, 1, hero);
        res.json(db);
      }
    }
  }
});

/**
 * @swagger
 * /categories/:id
 *  delete
 *    responses
 *      '200'
 *        description Delete an entry
 *        content
 *          application/json
 *            schema
 *              type object
 *              properties
 *                name
 *                  type string
 *                  example "Matt-Man"
 */
app.delete('/categories/:id', (req, res) => {
  let id = req.params.id;
  let index = -1;

  for (let i = 0; i < db.length; i++) {
    if (db[i].id === Number(id)) {
      index = i;

      db.splice(index, 1);
      res.json(db);
    }
  }
});

app.use((err, req, res) => {
  console.error(err);
  res.send(500).send('Internal server error encountered');
});

module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  },
};