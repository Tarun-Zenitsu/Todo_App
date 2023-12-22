import express from 'express';
import { authenticateJwt, SECRET } from "../middleware/index";
import { Todo } from "../db";
import { z } from 'zod';

const router = express.Router();

let titileInputProps = z.object({
  title: z.string().min(3).max(20),
  description: z.string().min(3).max(20)
})

router.post('/todos', authenticateJwt, (req, res) => {
  const { title, description } = req.body;
  const done = false;
  const userId = req.headers["userId"];

  const newTodo = new Todo({ title, description, done, userId });

  newTodo.save()
    .then((savedTodo) => {
      res.status(201).json(savedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to create a new todo' });
    });
});


router.get('/todos', authenticateJwt, (req, res) => {
  const userId = req.headers["userId"];

  Todo.find({ userId })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});

router.delete('/todos/:todoId', authenticateJwt, async (req, res) => {
  const { todoId } = req.params;
  const userId = req.headers['userId'];

  try {
    // Check if the todo exists and belongs to the user
    const todoToDelete = await Todo.findOne({ _id: todoId, userId });

    if (!todoToDelete) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Delete the todo
    await Todo.deleteOne({ _id: todoId, userId });

    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});


router.patch('/todos/:todoId/done', authenticateJwt, (req, res) => {
  const { todoId } = req.params;
  const userId = req.headers["userId"];

  Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(updatedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update todo' });
    });
});

export default router;
