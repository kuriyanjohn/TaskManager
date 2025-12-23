const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;

// Create
// router.post('/', auth, async (req, res) => {
//   const task = new Task({ ...req.body, createdBy: req.user.id });
//   await task.save();
//   res.status(201).json(task);
// });

// List with search, filter, pagination
// Query params: q, status, priority, page, limit, sortBy
router.get('/', auth, async (req, res) => {
  const { q, status, priority, page = 1, limit = 10, sortBy = '-createdAt' } = req.query;
  const filter = { createdBy: req.user.id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }, { tags: new RegExp(q, 'i') }];

  const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(100, parseInt(limit));
  const tasks = await Task.find(filter).sort(sortBy).skip(skip).limit(Math.min(100, parseInt(limit)));
  const total = await Task.countDocuments(filter);
  res.json({ data: tasks, meta: { total, page: parseInt(page), limit: parseInt(limit) }});
});

// Get / Update / Delete by id — ensure createdBy owner check
router.get('/:id', auth, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!task) return res.status(404).json({ message: 'Not found' });
  res.json(task);
});
// router.put('/:id', auth, async (req, res) => {
//   const task = await Task.findOneAndUpdate({ _id: req.params.id, createdBy: req.user.id }, req.body, { new: true });
//   if (!task) return res.status(404).json({ message: 'Not found' });
//   res.json(task);
// });
// router.delete('/:id', auth, async (req, res) => {
//   const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
//   if (!task) return res.status(404).json({ message: 'Not found' });
//   res.json({ message: 'Deleted' });
// });

module.exports = router;
