const Task = require('../models/Task.model');
const TaskGroup = require('../models/TaskGroup.model');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getAllTasks = async (req, res) => {
  try {
    const { status, taskGroup, priority, search } = req.query;

    // Build query
    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    if (taskGroup) {
      query.taskGroup = taskGroup;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query)
      .populate('taskGroup', 'name icon color')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('taskGroup', 'name icon color');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, progress, taskGroup, dueDate } = req.body;

    // Validation
    if (!title || !taskGroup) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and task group',
      });
    }

    // Verify task group exists and belongs to user
    const group = await TaskGroup.findOne({
      _id: taskGroup,
      user: req.user._id,
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Task group not found',
      });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      progress: progress || 0,
      taskGroup,
      user: req.user._id,
      dueDate,
    });

    // Populate task group
    await task.populate('taskGroup', 'name icon color');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('taskGroup', 'name icon color');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get today's stats
// @route   GET /api/tasks/stats/today
// @access  Private
const getTodayStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all user tasks
    const allTasks = await Task.find({ user: req.user._id });
    
    // Get today's tasks (created today)
    const todayTasks = await Task.find({
      user: req.user._id,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Calculate stats
    const totalTasks = allTasks.length;
    const todayTasksCount = todayTasks.length;
    const completedTasks = allTasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = allTasks.filter(task => task.status === 'in-progress').length;
    const todoTasks = allTasks.filter(task => task.status === 'todo').length;

    // Calculate completion percentage
    const completionPercentage = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    // Calculate average progress of in-progress tasks
    const inProgressTasksList = allTasks.filter(task => task.status === 'in-progress');
    const averageProgress = inProgressTasksList.length > 0
      ? Math.round(
          inProgressTasksList.reduce((sum, task) => sum + task.progress, 0) / 
          inProgressTasksList.length
        )
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        todayTasks: todayTasksCount,
        completedTasks,
        inProgressTasks,
        todoTasks,
        completionPercentage,
        averageProgress,
      },
    });
  } catch (error) {
    console.error('Get today stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get tasks by status
// @route   GET /api/tasks/status/:status
// @access  Private
const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Validate status
    const validStatuses = ['todo', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be todo, in-progress, or completed',
      });
    }

    const tasks = await Task.find({
      user: req.user._id,
      status,
    }).populate('taskGroup', 'name icon color');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Get tasks by status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTodayStats,
  getTasksByStatus,
};
