# LESS - Task Management App 📱

> **Do more, stress LESS**

A beautiful, modern task management mobile application built with React Native (Expo). LESS helps you organize your tasks, track progress, and manage your productivity with an elegant, minimal interface.

![LESS App](https://img.shields.io/badge/version-1.0.0-purple) ![React Native](https://img.shields.io/badge/React%20Native-0.73.0-blue) ![Expo](https://img.shields.io/badge/Expo-~50.0.0-black)

## ✨ Features

- **🔐 User Authentication**
  - Secure login and registration
  - Demo account for testing
  - Persistent authentication with AsyncStorage

- **📋 Task Management**
  - Create, read, update, and delete tasks
  - Set task priority (Low, Medium, High)
  - Track task progress with visual indicators
  - Filter tasks by status (To Do, In Progress, Completed)
  - Search tasks by title or description

- **📁 Task Groups**
  - Organize tasks into custom groups
  - Choose from 10 emoji icons
  - Select from 10 vibrant colors
  - View group progress at a glance

- **🏠 Dashboard**
  - Personalized greeting based on time of day
  - Daily progress tracking with circular progress indicator
  - Quick view of in-progress tasks
  - Overview of task groups

- **👤 User Profile**
  - View user information and statistics
  - Track total tasks, completed tasks, and groups
  - Settings and preferences (UI ready)
  - Account management

## 🎨 Design System

### Brand Identity
- **App Name:** LESS
- **Tagline:** "Do more, stress LESS"
- **Primary Color:** Purple (#8B5CF6)
- **Secondary Color:** Pink (#EC4899)
- **Accent Color:** Orange (#F97316)

### Color Palette
```javascript
Primary: #8B5CF6     Success: #10B981
Secondary: #EC4899   Warning: #F59E0B
Accent: #F97316      Danger: #EF4444
Info: #3B82F6        Background: #FAFAF9
```

## 📦 Project Structure

```
LESS/
├── app/                      # Expo Router screens
│   ├── (auth)/              # Authentication screens
│   │   ├── _layout.js       # Auth stack layout
│   │   ├── login.js         # Login screen
│   │   └── register.js      # Registration screen
│   ├── (tabs)/              # Main app tabs
│   │   ├── _layout.js       # Tab navigation layout
│   │   ├── home.js          # Dashboard/Home screen
│   │   ├── tasks.js         # Tasks list with filters
│   │   ├── add.js           # Create task screen
│   │   ├── groups.js        # Task groups management
│   │   └── profile.js       # User profile screen
│   ├── _layout.js           # Root layout with auth protection
│   └── index.js             # Entry point with redirect logic
├── components/               # Reusable components
│   ├── Button.js            # Custom button with variants
│   ├── Input.js             # Input field with validation
│   ├── ProgressCircle.js    # Circular progress indicator
│   ├── ProgressBar.js       # Linear progress bar
│   ├── TaskCard.js          # Task display card
│   └── TaskGroupCard.js     # Task group display card
├── constants/                # App constants
│   ├── Colors.js            # Color palette
│   └── Theme.js             # Theme configuration
├── services/                 # API services
│   ├── api.js               # Axios instance with interceptors
│   ├── authService.js       # Authentication API calls
│   ├── taskService.js       # Task API calls
│   ├── taskGroupService.js  # Task group API calls
│   └── userService.js       # User profile API calls
├── .gitignore               # Git ignore file
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (optional but recommended)
- **iOS Simulator** (for macOS) or **Android Emulator**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Christian-Akor/Less.git
   cd Less
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on your device/emulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## 🔑 Demo Account

Use these credentials to test the app:
- **Email:** demo@less.app
- **Password:** password123

Or tap the "Try Demo Account" button on the login screen.

## 🛠️ Tech Stack

- **Framework:** React Native 0.73.0
- **Navigation:** Expo Router 3.4.0
- **UI Components:** Custom components with React Native
- **State Management:** React Hooks (useState, useEffect)
- **Styling:** StyleSheet API
- **HTTP Client:** Axios 1.6.2
- **Storage:** AsyncStorage 1.21.0
- **Icons:** Ionicons (@expo/vector-icons)
- **Gradients:** expo-linear-gradient
- **Animations:** react-native-reanimated (ready for future use)

## ⚙️ Configuration

### API Configuration

Update the API base URL in `services/api.js`:

```javascript
const API_URL = 'http://localhost:5000/api'; // Development
// const API_URL = 'https://your-api.com/api'; // Production
```

### Environment Variables

For production, consider using environment variables:

```bash
# .env
API_URL=https://your-production-api.com/api
```

## 📱 Screens Overview

### Authentication Screens
- **Login:** Email/password login with demo account option
- **Register:** Create new account with validation

### Main App Screens
- **Home:** Dashboard with progress overview and quick stats
- **Tasks:** Filterable task list with search functionality
- **Add Task:** Create new tasks with priority and group selection
- **Groups:** Manage task groups with custom icons and colors
- **Profile:** User profile with statistics and settings

## 🎯 Key Features Implementation

### Pull to Refresh
All list screens support pull-to-refresh for data updates.

### Search & Filter
Tasks screen includes:
- Real-time search by title/description
- Filter by status (All, To Do, In Progress, Completed)

### Form Validation
- Required field validation
- Email format validation
- Password strength requirements
- Matching password confirmation

### Error Handling
- User-friendly error messages
- Network error handling
- API error responses displayed via alerts

## 🔐 Security

- JWT token-based authentication
- Secure storage with AsyncStorage
- Automatic token refresh on API calls
- 401 error handling with auto-logout

## 🚧 Backend Requirement

This frontend app requires a backend API server. The backend should implement:

### Required Endpoints

**Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

**Tasks**
- `GET /api/tasks` - Get all tasks (with optional filters)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/complete` - Mark task as completed

**Task Groups**
- `GET /api/task-groups` - Get all task groups
- `GET /api/task-groups/:id` - Get single group
- `POST /api/task-groups` - Create task group
- `PUT /api/task-groups/:id` - Update task group
- `DELETE /api/task-groups/:id` - Delete task group

**User**
- `GET /api/users/profile` - Get user profile with stats
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

## 🏗️ Building for Production

### iOS
```bash
npx expo build:ios
```

### Android
```bash
npx expo build:android
```

### Using EAS Build (Recommended)
```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

## 📸 Screenshots

*Coming soon - Add screenshots of your app here*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Christian Akor**
- GitHub: [@Christian-Akor](https://github.com/Christian-Akor)

## 🙏 Acknowledgments

- Design inspiration from modern task management apps
- Icons by Ionicons
- UI components built with React Native

---

**LESS** - Do more, stress LESS 💜