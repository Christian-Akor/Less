const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      maxlength: [200, 'Title cannot be more than 200 characters'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    progress: {
      type: Number,
      min: [0, 'Progress cannot be less than 0'],
      max: [100, 'Progress cannot be more than 100'],
      default: 0,
    },
    taskGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaskGroup',
      required: [true, 'Please add a task group'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-complete if progress = 100%
taskSchema.pre('save', function (next) {
  if (this.progress === 100 && !this.isCompleted) {
    this.isCompleted = true;
    this.status = 'completed';
    this.completedAt = Date.now();
  } else if (this.progress < 100 && this.isCompleted) {
    // Reset completion status if progress drops below 100%
    this.isCompleted = false;
    this.completedAt = null;
    // Update status to in-progress if it was completed
    if (this.status === 'completed') {
      this.status = 'in-progress';
    }
  }
  
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, taskGroup: 1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
