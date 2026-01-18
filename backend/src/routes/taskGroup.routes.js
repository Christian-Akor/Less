const express = require('express');
const router = express.Router();
const {
  getAllTaskGroups,
  getTaskGroup,
  createTaskGroup,
  updateTaskGroup,
  deleteTaskGroup,
  getTaskGroupTasks,
} = require('../controllers/taskGroup.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// Task groups routes
router.route('/').get(getAllTaskGroups).post(createTaskGroup);

// Single task group routes
router.route('/:id')
  .get(getTaskGroup)
  .put(updateTaskGroup)
  .delete(deleteTaskGroup);

// Get tasks in a task group
router.get('/:id/tasks', getTaskGroupTasks);

module.exports = router;
