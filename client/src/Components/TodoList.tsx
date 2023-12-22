import React, { useState, useEffect } from 'react';
import { authState } from '../store/authState.js';
import { useRecoilValue } from 'recoil';
import { Navigate, useNavigate } from 'react-router-dom';
import Login from './Login.js';

interface Todo {
  _id: string;
  title: string;
  description: string;
  done: boolean;
}

type TodoArray = Todo[];

function useTodos() {
  const [todos, setTodos] = useState<TodoArray>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getTodos = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/todo/todos', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const data = await response.json();

        if (isMounted) {
          setTodos(data);
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getTodos();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    loading,
    todos,
    setTodos,
  };
}

const TodoList = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { loading, todos, setTodos } = useTodos();
  const authStateValue = useRecoilValue(authState);

  const addTodo = async () => {
    try {
      const response = await fetch('http://localhost:3000/todo/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos((prevTodos) => [...prevTodos, data]);
      } else {
        console.error('Error adding todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const markDone = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/todo/todos/${id}/done`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
        );
      } else {
        console.error('Error marking todo as done:', response.statusText);
      }
    } catch (error) {
      console.error('Error marking todo as done:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/todo/todos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      } else {
        console.error('Error deleting todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <h2>Welcome {authStateValue.username}</h2>
        <div style={{ marginTop: 25, marginLeft: 20 }}>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              Navigate({to: "/Login"});
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <h2>Todo List</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button onClick={addTodo}>Add Todo</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        todos.map((todo) => (
          <div key={todo._id}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <button onClick={() => markDone(todo._id)}>
              {todo.done ? 'Done' : 'Mark as Done'}
            </button>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </div>
        ))
      )}
    </>
  );
};

export default TodoList;
