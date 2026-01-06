const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

const createTask = async (req, res) => {
  const { title, description, priority, dueDate, tags } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    tags,
    createdBy: req.user.id
  });

  res.status(201).json(task);
};

const getTasks = async (req, res) => {
  const userId = req.user.id;

  const {
    search = '',
    status,
    priority,
    page = 1,
    limit =8
  } = req.query;

  const query = {
    createdBy: userId
  };

  // Search (title + description)
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Filters
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Task.countDocuments(query)
  ]);

  res.json({
    tasks,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    }
  });
};


const updateTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOneAndUpdate(
    { _id: id, createdBy: req.user.id }, // ownership check
    req.body,
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json(task);
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOneAndDelete({
    _id: id,
    createdBy: req.user.id
  });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ message: 'Task deleted' });
};

module.exports={
  createTask,
  getTasks,
  updateTask,
  deleteTask
}