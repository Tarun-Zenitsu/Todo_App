import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

export default function App() {

const [todos, setTodos] = useState([]);
const [title, setTitle] = useState([]);
const [description, setDescription] = useState([]);

useEffect(() => {
  axios.get("http://localhost:3000/todos")
    .then((res) => {
      console.log("Todo response:", res.data);
      setTodos(res.data);
    })
    .catch((err) => console.log(err))
    setInterval(() => {
          axios.get("http://localhost:3000/todos")
           .then((res) => {
             console.log("Todo response:", res.data);
             setTodos(res.data);
        })
        .catch((err) => console.log(err))
    }, 5000);
}, []);


const handleDelete = (id) => {
  axios.delete(`http://localhost:3000/todos/${id}`)
  .then((res) => setTodos(res.data))
  .catch((err) => console.log(err))
}

const handleTitleChange = (event) => {
  setTitle(event.target.value);
}

const handleDescriptionChange = (event) => {
  setDescription(event.target.value);
}


const handleSubmit = (event) => {
  event.preventDefault();
  const formData = {title, description}
    axios.post('http://localhost:3000/todos', formData, {headers: {'Content-Type': 'application/json'}})
      .then(response => console.log('Response from server:', response.data));
    setTitle('');
    setDescription('');
}

  return (
    <>
        <form onSubmit={handleSubmit}>
          <label> Title: <input type="text" value={title} onChange={handleTitleChange} /> </label>
          <br />
          <label> Description:
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              className='bg-gray-500'
            />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      <h1>Todo App</h1>
      <ol>
        {todos.map((todo) => {
          return <TodoItem key = {todo.id} todo = {todo} handleDelete = {handleDelete} />
        })}
      </ol>
    </>
  );
}

function TodoItem ({todo, handleDelete}) {
  const {id, title, description } = todo;

  return (
    <li>
      <b className='bg-blue-600'>Title:</b>{title} <br />
      <b>Description:</b>{description} <br />
      <button onClick={() => handleDelete(id)}>delete</button>
      <hr />
    </li>
  )
}
