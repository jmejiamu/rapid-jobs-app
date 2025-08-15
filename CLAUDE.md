# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Rapid Jobs App**, a React Native/Expo mobile application for job search functionality. The project uses TypeScript, Redux for state management, React Navigation for routing, and i18n for internationalization.

## Key Commands

### Development
```bash
# Start Expo development server
npm start

# Start on specific platforms
npm run android
npm run ios
npm run web
```

### Important Notes
- No test scripts are defined in package.json
- No build/lint commands are available yet
- Check DEVELOPMENT_RULES.md for comprehensive coding standards

## Architecture Overview

### Core Technology Stack
- **Framework**: React Native with Expo (~53.0.20)
- **Language**: TypeScript with strict mode enabled
- **State Management**: Redux Toolkit with Redux Persist
- **Navigation**: React Navigation v7 (Bottom Tabs)
- **Internationalization**: i18n-js with expo-localization
- **Storage**: AsyncStorage for persistence

### Application Structure
```
src/
├── components/         # Reusable UI components
├── screens/           # Screen components (HomeScreen exists)
├── navigation/        # Navigation setup (AppNavigator, BottomTabNavigator)
├── redux/            # Redux store and slices (counterSlice exists)
├── hooks/            # Custom React hooks
├── theme/            # Design system (colors, fonts)
├── translation/      # i18n setup and locales (en, es)
└── utils/            # Utility functions
```

### State Management Architecture
- Redux store configured with persistence using AsyncStorage
- Currently has a counter slice (template/example)
- Store is wrapped with Provider and PersistGate in AppNavigator

### Navigation Architecture
- App.tsx renders AppNavigator
- AppNavigator wraps the app with Redux Provider and NavigationContainer
- Uses BottomTabNavigator as main navigation structure

### Internationalization Setup
- Supports English (en) and Spanish (es)
- Auto-detects system locale with fallback to en-US
- Includes RTL support detection
- Type-safe translation keys with TypeScript

## Development Guidelines

### Code Standards (from DEVELOPMENT_RULES.md)
- **TypeScript is mandatory** - All components must have proper typing
- **Functional components only** - Use React.FC with proper interfaces
- **Follow established folder structure** - Never create new folders without checking existing structure
- **Check dependencies first** - Always verify package.json before adding libraries
- **Reuse existing components** - Check existing code before creating new components

### Component Patterns
- Define interfaces for all component props
- Use PascalCase for components, camelCase for functions
- Implement proper error handling with try-catch
- Follow React Navigation v7 patterns for navigation

### State Management Patterns
- Use Redux Toolkit for global state
- Implement proper TypeScript types (RootState, AppDispatch)
- Utilize Redux Persist for data persistence
- Keep local state minimal, prefer Redux for shared state

### File Organization
- Place new screens in `src/screens/[ScreenName]/`
- Add reusable components to `src/components/`
- Use existing theme system in `src/theme/`
- Follow the established i18n pattern for new translations

## Key Files to Understand

- `App.tsx` - Main app entry point
- `src/navigation/AppNavigator.tsx` - Redux and navigation setup
- `src/redux/store.ts` - Redux store configuration
- `src/translation/i18n.ts` - Internationalization setup
- `DEVELOPMENT_RULES.md` - Comprehensive development guidelines (in Spanish)

## Important Notes

- The project has comprehensive development rules documented in Spanish
- Expo new architecture is enabled (`newArchEnabled: true`)
- Strict TypeScript configuration is enforced
- No existing test framework is configured
- The app currently has minimal functionality (just a basic HomeScreen)