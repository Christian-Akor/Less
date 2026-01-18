const mongoose = require('mongoose');

const taskGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a task group name'],
      maxlength: [100, 'Name cannot be more than 100 characters'],
      trim: true,
    },
    icon: {
      type: String,
      default: '📋',
    },
    color: {
      type: String,
      default: '#8B5CF6',
      match: [/^#([A-Fa-f0-9]{6})$/, 'Please provide a valid hex color code'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for tasks
taskGroupSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'taskGroup',
});

// Index for better query performance
taskGroupSchema.index({ user: 1 });

// Update timestamps on save
taskGroupSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TaskGroup', taskGroupSchema);
