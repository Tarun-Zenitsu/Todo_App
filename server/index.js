const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const path = require('path');
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

let todos = [];

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    res.status(404).send();
  } else {
    res.json(todo);
  }
});

app.post('/todos', (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 1000000), // unique random id
    title: req.body.title,
    description: req.body.description
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos[todoIndex].title = req.body.title;
    todos[todoIndex].description = req.body.description;
    res.json(todos[todoIndex]);
  }
});

app.delete('/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos.splice(todoIndex, 1);
    res.status(200).json(todos);
  }
});


// -------------------------this code for running a the file in localhost:3000-------------------

// app.get('/', (req, res)=> {
//   res.sendFile(path.join(__dirname,"index.html"))
// })

// for all other routes, return 404
app.use((req, res, next) => {
  res.status(404).send();
});


app.listen(3000, ()=> {
  console.log("app is listen on port number 3000");
})

// module.exports = app;
