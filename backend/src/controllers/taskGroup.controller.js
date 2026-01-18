const TaskGroup = require('../models/TaskGroup.model');
const Task = require('../models/Task.model');

// @desc    Get all task groups
// @route   GET /api/task-groups
// @access  Private
const getAllTaskGroups = async (req, res) => {
  try {
    const groups = await TaskGroup.find({ user: req.user._id });

    // Calculate stats for each group
    const groupsWithStats = await Promise.all(
      groups.map(async (group) => {
        const tasks = await Task.find({ taskGroup: group._id });
        
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
        
        // Calculate average progress
        const averageProgress = totalTasks > 0
          ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / totalTasks)
          : 0;

        return {
          ...group.toObject(),
          totalTasks,
          completedTasks,
          inProgressTasks,
          averageProgress,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: groupsWithStats.length,
      data: groupsWithStats,
    });
  } catch (error) {
    console.error('Get all task groups error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single task group
// @route   GET /api/task-groups/:id
// @access  Private
const getTaskGroup = async (req, res) => {
  try {
    const group = await TaskGroup.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Task group not found',
      });
    }

    // Get all tasks in this group
    const tasks = await Task.find({ taskGroup: group._id });

    res.status(200).json({
      success: true,
      data: {
        ...group.toObject(),
        tasks,
      },
    });
  } catch (error) {
    console.error('Get task group error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create task group
// @route   POST /api/task-groups
// @access  Private
const createTaskGroup = async (req, res) => {
  try {
    const { name, icon, color, description } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a group name',
      });
    }

    // Create task group
    const group = await TaskGroup.create({
      name,
      icon: icon || '📋',
      color: color || '#8B5CF6',
      description,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task group created successfully',
      data: group,
    });
  } catch (error) {
    console.error('Create task group error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update task group
// @route   PUT /api/task-groups/:id
// @access  Private
const updateTaskGroup = async (req, res) => {
  try {
    let group = await TaskGroup.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Task group not found',
      });
    }

    // Prevent modifying isDefault if currently default
    if (group.isDefault && req.body.isDefault === false) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify default status of default groups',
      });
    }

    // Update group
    group = await TaskGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Task group updated successfully',
      data: group,
    });
  } catch (error) {
    console.error('Update task group error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete task group
// @route   DELETE /api/task-groups/:id
// @access  Private
const deleteTaskGroup = async (req, res) => {
  try {
    const group = await TaskGroup.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Task group not found',
      });
    }

    // Prevent deleting default groups
    if (group.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default task groups',
      });
    }

    // Check if tasks exist in group
    const tasksCount = await Task.countDocuments({ taskGroup: group._id });

    if (tasksCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete group with ${tasksCount} tasks. Please delete or move tasks first.`,
      });
    }

    await group.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task group deleted successfully',
    });
  } catch (error) {
    console.error('Delete task group error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get tasks in a task group
// @route   GET /api/task-groups/:id/tasks
// @access  Private
const getTaskGroupTasks = async (req, res) => {
  try {
    // Verify group exists and belongs to user
    const group = await TaskGroup.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Task group not found',
      });
    }

    // Get all tasks in group
    const tasks = await Task.find({ taskGroup: group._id });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
      group: {
        _id: group._id,
        name: group.name,
        icon: group.icon,
        color: group.color,
      },
    });
  } catch (error) {
    console.error('Get task group tasks error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  getAllTaskGroups,
  getTaskGroup,
  createTaskGroup,
  updateTaskGroup,
  deleteTaskGroup,
  getTaskGroupTasks,
};
