# Planit - Task Manager App

A powerful and intuitive task management application built with React Native and Expo, featuring a rich UI experience and comprehensive task management capabilities.

## Features

- **Task Management**
  - Create, edit, and delete tasks
  - Organize tasks with categories (Work, Personal, Urgent)
  - Break down tasks into subtasks
  - Set priorities (High, Medium, Low)

- **Progress Tracking**
  - Visual progress indicators
  - Daily and weekly goal tracking
  - Task completion statistics

- **Smart Features**
  - Real-time synchronization across devices
  - Offline support with automatic syncing
  - Smart scheduling with reminders
  - Search and filter capabilities

- **User Experience**
  - Beautiful, responsive UI
  - Dark and light theme support
  - Smooth animations and transitions
  - Skeleton loading states

## Tech Stack

- **Frontend Framework**
  - React Native with Expo
  - Expo Router for file-based navigation

- **UI Libraries**
  - Styled Components for dynamic theming
  - React Native Paper for Material Design components
  - NativeWind (Tailwind CSS for React Native)
  - React Native Elements
  - Reanimated & Gesture Handler for animations
  - Lottie for animated illustrations

- **State Management & Backend**
  - Redux Toolkit for state management
  - Firebase for real-time database and authentication
  - Offline-first architecture

## File Structure

```
app/
├── (auth)/                   # Authentication routes
│   ├── _layout.tsx          # Auth layout with navigation protection
│   ├── login.tsx            # Login screen
│   ├── register.tsx         # Registration screen
│   └── forgot-password.tsx  # Password recovery screen
├── (tabs)/                  # Main app tabs
│   ├── _layout.tsx          # Tabs layout with bottom navigation
│   ├── index.tsx            # Tasks list screen (main tab)
│   ├── stats.tsx            # Analytics and statistics
│   └── profile.tsx          # User profile and settings
├── components/              # Reusable components
│   ├── analytics/
│   │   └── StatsCard.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ShimmerLoader.tsx
│   │   └── TaskItem.tsx
│   └── tasks/
│       ├── SubTaskList.tsx
│       ├── TaskForm.tsx
│       └── TaskList.tsx
├── hooks/                   # Custom React hooks
│   ├── useAnalytics.ts
│   ├── useAuth.ts          # Authentication hook
│   ├── useTasks.ts
│   └── useTheme.ts
├── services/               # External services and APIs
│   ├── analytics.ts
│   ├── auth.ts
│   └── firebase.ts        # Firebase configuration
├── store/                  # Redux store
│   ├── index.ts           # Store configuration
│   ├── authSlice.ts       # Authentication state
│   ├── taskSlice.ts       # Tasks state
│   └── themeSlice.ts      # Theme preferences
├── theme/                  # Theming and styling
│   ├── animations.ts
│   ├── darkTheme.ts
│   └── lightTheme.ts
├── types/                  # TypeScript types
│   └── index.ts
├── utils/                  # Utility functions
│   ├── dateUtils.ts
│   └── taskUtils.ts
├── _layout.tsx            # Root layout with providers
└── index.tsx              # Entry point with auth routing
```

## Navigation Structure

The app uses Expo Router for navigation with the following structure:

1. **Root Layout** (`_layout.tsx`)
   - Provides Redux store
   - Provides theme
   - Handles Firebase auth state

2. **Authentication Flow** (`(auth)/_layout.tsx`)
   - Protects routes from authenticated users
   - Routes:
     - `/login` - User login
     - `/register` - New user registration
     - `/forgot-password` - Password recovery

3. **Main App Flow** (`(tabs)/_layout.tsx`)
   - Protected by authentication
   - Bottom tab navigation:
     - `/` - Tasks list (main screen)
     - `/stats` - Analytics and statistics
     - `/profile` - User profile and settings

## Authentication Flow

1. App starts → Checks authentication state
2. If loading → Shows nothing (brief flash)
3. If authenticated → Redirects to main app tabs
4. If not authenticated → Redirects to login screen
5. After login/register → Automatically redirects to main app

## Getting Started

1. **Prerequisites**
   - Node.js (v14 or later)
   - npm or yarn
   - Expo CLI
   - Firebase account

2. **Installation**
   ```bash
   # Install dependencies
   npm install

   # Start the development server
   npx expo start
   ```

3. **Firebase Setup**
   - Create a Firebase project
   - Enable Authentication and Realtime Database
   - Copy your Firebase config to `services/firebase.ts`

## Development Guidelines

- **Components**: Keep components small and focused
- **Styling**: Use styled-components for component-specific styles
- **State**: Manage global state with Redux, local state with hooks
- **TypeScript**: Maintain type safety throughout the codebase
- **Testing**: Write tests for critical business logic

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
