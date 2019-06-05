'use strict';

/** @module lib/server */

const express = require('express');

const app = express();

const PORT = process.env.PORT || 8080;

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
    throw new Error ('invalid alias provided')
  }
  // this.alias = alias = typeof alias === 'string' ? alias: 'invalid name provided';
  // id = Number(id);
}

app.use(express.json());
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
 */

app.get('/categories', (req,res,next) => {
  let count = db.length;
  let results = db;
  res.json({count,results});
});
/**
 * Get all the records
 */

app.get('/categories/:id', (req,res,next) => {
  let id = req.params.id;
  let record = db.filter((record) => record.id === parseInt(id));
  res.json(record[0]);
});


app.post('/categories', (req,res) => {
  let {name} = req.body;
  let record = {name};
  record.id = db.length + 1;
  db.push(record);
  res.json(record);
});

app.put('/categories/:id', (req,res,next) => {
  let id = req.params.id;
  db.map( (element, id) => {
    let {name} = req.body;
    let record = {name};
    res.json(record);
  });
  
});

app.delete('/categories/:id', (req,res,next) => {
  let id = req.params.id;
  let index = -1

  for(let i = 0; i < db.length; i++){
    if(db[i].id === Number(id)){
      index = i;

      db.splice(id,1);
      res.json(id);
    }
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.send(500).send('Internal server error encountered');
})

module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  },
};

