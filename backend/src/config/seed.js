require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const TaskGroup = require('../models/TaskGroup.model');
const Task = require('../models/Task.model');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Seed data
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await TaskGroup.deleteMany({});
    await Task.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create demo user
    console.log('👤 Creating demo user...');
    const demoUser = await User.create({
      name: 'Livia Vaccaro',
      email: 'demo@less.app',
      password: 'password123',
    });
    demoUser.avatar = demoUser.generateAvatar();
    await demoUser.save();
    console.log('✅ Demo user created');
    console.log(`   Email: ${demoUser.email}`);
    console.log(`   Password: password123\n`);

    // Create task groups
    console.log('📁 Creating task groups...');
    const taskGroups = await TaskGroup.create([
      {
        name: 'Office Project',
        icon: '💼',
        color: '#EC4899',
        description: 'Work-related tasks and projects',
        user: demoUser._id,
        isDefault: false,
      },
      {
        name: 'Personal Project',
        icon: '👤',
        color: '#8B5CF6',
        description: 'Personal development and side projects',
        user: demoUser._id,
        isDefault: false,
      },
      {
        name: 'Daily Study',
        icon: '📚',
        color: '#F97316',
        description: 'Learning and educational activities',
        user: demoUser._id,
        isDefault: false,
      },
      {
        name: 'Fitness & Health',
        icon: '💪',
        color: '#10B981',
        description: 'Health, fitness, and wellness tasks',
        user: demoUser._id,
        isDefault: false,
      },
    ]);
    console.log(`✅ ${taskGroups.length} task groups created\n`);

    // Create sample tasks
    console.log('📝 Creating sample tasks...');
    const tasks = await Task.create([
      // Office Project tasks
      {
        title: 'Grocery shopping app design',
        description: 'Design UI/UX for the new grocery shopping mobile application',
        status: 'in-progress',
        priority: 'high',
        progress: 65,
        taskGroup: taskGroups[0]._id,
        user: demoUser._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        title: 'Review project documentation',
        description: 'Review and update all project documentation for Q1',
        status: 'in-progress',
        priority: 'medium',
        progress: 45,
        taskGroup: taskGroups[0]._id,
        user: demoUser._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
      {
        title: 'Team meeting preparation',
        description: 'Prepare slides and agenda for weekly team meeting',
        status: 'completed',
        priority: 'high',
        progress: 100,
        taskGroup: taskGroups[0]._id,
        user: demoUser._id,
        isCompleted: true,
        completedAt: new Date(),
      },
      {
        title: 'Client feedback review',
        description: 'Review and document client feedback from last sprint',
        status: 'todo',
        priority: 'medium',
        progress: 0,
        taskGroup: taskGroups[0]._id,
        user: demoUser._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },
      // Personal Project tasks
      {
        title: 'Uber Eats redesign challenge',
        description: 'Complete the UI redesign challenge for Uber Eats app',
        status: 'in-progress',
        priority: 'medium',
        progress: 70,
        taskGroup: taskGroups[1]._id,
        user: demoUser._id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      },
      {
        title: 'Portfolio website update',
        description: 'Add new projects and update portfolio website',
        status: 'todo',
        priority: 'low',
        progress: 0,
        taskGroup: taskGroups[1]._id,
        user: demoUser._id,
      },
      // Daily Study tasks
      {
        title: 'JavaScript algorithms practice',
        description: 'Complete 5 algorithm challenges on LeetCode',
        status: 'in-progress',
        priority: 'high',
        progress: 80,
        taskGroup: taskGroups[2]._id,
        user: demoUser._id,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      },
      {
        title: 'Read React Native documentation',
        description: 'Study React Native advanced concepts and best practices',
        status: 'in-progress',
        priority: 'medium',
        progress: 40,
        taskGroup: taskGroups[2]._id,
        user: demoUser._id,
      },
      {
        title: 'Complete Node.js course',
        description: 'Finish the Node.js and Express course on Udemy',
        status: 'todo',
        priority: 'medium',
        progress: 0,
        taskGroup: taskGroups[2]._id,
        user: demoUser._id,
      },
      // Fitness & Health tasks
      {
        title: 'Morning workout routine',
        description: '30 minutes cardio and strength training',
        status: 'completed',
        priority: 'high',
        progress: 100,
        taskGroup: taskGroups[3]._id,
        user: demoUser._id,
        isCompleted: true,
        completedAt: new Date(),
      },
      {
        title: 'Meal prep for the week',
        description: 'Prepare healthy meals for the upcoming week',
        status: 'todo',
        priority: 'medium',
        progress: 0,
        taskGroup: taskGroups[3]._id,
        user: demoUser._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      },
      {
        title: 'Yoga session',
        description: 'Evening yoga and meditation session',
        status: 'in-progress',
        priority: 'low',
        progress: 50,
        taskGroup: taskGroups[3]._id,
        user: demoUser._id,
      },
    ]);
    console.log(`✅ ${tasks.length} sample tasks created\n`);

    console.log('✅ Database seeding completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   • Users: 1`);
    console.log(`   • Task Groups: ${taskGroups.length}`);
    console.log(`   • Tasks: ${tasks.length}`);
    console.log('\n🔑 Demo Account Credentials:');
    console.log('   Email: demo@less.app');
    console.log('   Password: password123');
    console.log('\n🚀 You can now start the server with: npm start or npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
connectDB().then(() => {
  seedDatabase();
});
