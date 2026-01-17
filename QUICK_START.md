# LESS - Quick Start Guide 🚀

## Immediate Next Steps

### 1. Install Dependencies (Required)
```bash
npm install
```

This will install all required packages including:
- Expo SDK 50
- React Native 0.73
- Expo Router for navigation
- Axios for API calls
- AsyncStorage for local data
- All UI libraries

### 2. Add Assets (Recommended)

Create these image files in the `assets/` directory:
- **icon.png** (1024x1024) - App icon
- **splash.png** (2048x2048) - Splash screen
- **adaptive-icon.png** (1024x1024) - Android adaptive icon
- **favicon.png** (48x48) - Web favicon

**Quick Solution:** Use a placeholder purple image with "LESS" text for now.

### 3. Configure API Endpoint

Edit `services/api.js` and update the API URL:

```javascript
// For local development with backend on same machine
const API_URL = 'http://localhost:5000/api';

// For development with backend on network
const API_URL = 'http://192.168.1.x:5000/api';

// For production
const API_URL = 'https://your-backend.com/api';
```

### 4. Start Development Server

```bash
npm start
```

Then:
- Press `i` for iOS Simulator (macOS only)
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

### 5. Test the App

Use the demo account to test:
- **Email:** demo@less.app
- **Password:** password123

Or create a new account via the Register screen.

## Project Structure Quick Reference

```
Less/
├── app/                    # All screens (Expo Router)
│   ├── (auth)/            # Login & Register
│   ├── (tabs)/            # Main app (Home, Tasks, Add, Groups, Profile)
│   ├── _layout.js         # Root navigation
│   └── index.js           # Entry point
├── components/             # Reusable UI components
├── constants/              # Colors and theme
├── services/               # API calls
└── assets/                 # Images and icons
```

## Common Development Tasks

### Update API URL
**File:** `services/api.js`
**Line:** `const API_URL = '...'`

### Change Colors
**File:** `constants/Colors.js`
**Edit:** Any color value

### Modify a Screen
**Location:** `app/(tabs)/[screen-name].js`
**Example:** `app/(tabs)/home.js` for home screen

### Add New API Call
**Location:** `services/` directory
**Edit:** Relevant service file (e.g., `taskService.js`)

### Modify Component
**Location:** `components/` directory
**Example:** `components/Button.js`

## Testing Checklist

- [ ] Install dependencies
- [ ] Start dev server
- [ ] App opens without errors
- [ ] Navigate to login screen
- [ ] Try demo account login
- [ ] See home screen with greeting
- [ ] Navigate through all tabs
- [ ] Create a new task
- [ ] Create a task group
- [ ] View profile

## Troubleshooting

### "Cannot connect to Metro"
- Restart the dev server: `npm start`
- Clear cache: `npm start --clear`

### "Network request failed"
- Check API URL in `services/api.js`
- Ensure backend is running
- Check firewall settings

### "Module not found"
- Run `npm install` again
- Clear cache: `rm -rf node_modules && npm install`

### Expo Go issues
- Update Expo Go app to latest version
- Ensure dev server and device are on same network

## Backend Requirements

The app expects these endpoints to exist:

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/complete` - Mark complete

### Task Groups
- `GET /api/task-groups` - List all groups
- `POST /api/task-groups` - Create group
- `PUT /api/task-groups/:id` - Update group
- `DELETE /api/task-groups/:id` - Delete group

### User
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `DELETE /api/users/account` - Delete account

## Development Tips

1. **Hot Reload:** Changes auto-refresh. Shake device to open dev menu.

2. **Debug:** 
   - Shake device → "Debug Remote JS"
   - Open Chrome DevTools

3. **Inspect Element:**
   - Shake device → "Show Element Inspector"

4. **Performance:**
   - Use React DevTools for performance profiling
   - Enable "Fast Refresh" in settings

5. **Logs:**
   - View in terminal where `npm start` is running
   - Or in Expo Go app logs

## Building for Production

### iOS (requires macOS)
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

### Setup EAS (first time)
```bash
npm install -g eas-cli
eas login
eas build:configure
```

## Need Help?

- **Expo Docs:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/
- **Expo Router Docs:** https://expo.github.io/router/docs/

---

**LESS** - Do more, stress LESS 💜

Happy Coding! 🎉
