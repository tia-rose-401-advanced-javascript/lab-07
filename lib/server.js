'use strict';

/** @module lib/server */

const express = require('express');
const swaggify = require('./swaggify');

const app = express();


let db = [];

/**
 * @constructor
 * @param {String} alias - Alias of person 
 * @param {Number} id  - Unique identifier for the Person Object
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
 * Middleware to log Method
 * @param {Object} req
 * @param {Object} res
 */
app.use( (req,res,next) => {
  console.log('LOG:', req.method, req.path);
  next();
});

/**
 * @swagger
 * /categories
 *  get:
 *    responses:
 *      '200':
 *        description: Get all intries
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Matt-Man"
 */

app.get('/categories', (req,res) => {
  let count = db.length;
  let results = db;
  res.json({count,results});
});
/**
 * Get all the records
 */

/**
 * @swagger
 * /categories/:id
 *  get:
 *    responses:
 *      '200':
 *        description: Gets entry
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Matt-Man"
 */

app.get('/categories/:id', (req,res) => {
  let id = req.params.id;
  let record = db.filter((record) => record.id === parseInt(id));
  res.json(record[0]);
});

/**
 * @swagger
 * /categories/:id
 *  post:
 *    responses:
 *      '200':
 *        description: Adds entry
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Matt-Man"
 */

app.post('/categories', (req,res) => {
  let hero = new Hero(req.body.name);
  db.push(hero);
  res.json(db);
});

/**
 * @swagger
 * /categories/:id
 *  put:
 *    responses:
 *      '200':
 *        description: Updates entry
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Matt-Man"
 */

app.put('/categories/:id', (req,res) => {
  let id = req.params.id;

  if (!req.body.name || typeof req.body.name !== 'string') {
    console.error('Invalid name');
  } else {  
    let person = new Hero(req.body.name, id);
    let index = -1;

    for (let i = 0; i < db.length; i++) {
      if (db[i].id === Number(id)) {
        index = i;
        db.splice(index, 1, person);
        res.json(db);
      }
    }
  }
});

/**
 * @swagger
 * /categories/:id
 *  delete:
 *    responses:
 *      '200':
 *        description: Deletes entry
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Matt-Man"
 */

app.delete('/categories/:id', (req,res) => {
  let id = req.params.id;
  // eslint-disable-next-line no-unused-vars
  let index = -1;

  for(let i = 0; i < db.length; i++){
    if(db[i].id === Number(id)){
      index = i;

      db.splice(id,1);
      res.json(id);
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

