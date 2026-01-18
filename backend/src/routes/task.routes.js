const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTodayStats,
  getTasksByStatus,
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// Tasks routes
router.route('/').get(getAllTasks).post(createTask);

// Stats route (must be before /:id to avoid route conflicts)
router.get('/stats/today', getTodayStats);

// Status route (must be before /:id to avoid route conflicts)
router.get('/status/:status', getTasksByStatus);

// Single task routes
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
