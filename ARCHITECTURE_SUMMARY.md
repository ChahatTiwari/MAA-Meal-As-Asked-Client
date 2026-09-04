# MAA App Architecture Summary

## Overview
This document summarizes the architectural improvements made to the MAA (Maa's Kitchen) food ordering application.

## Key Improvements

### 1. Design System (`src/theme/`)
- **Colors**: Comprehensive color palette with semantic tokens for light/dark themes
- **Typography**: Consistent type scale with preset styles for headings, body, labels, buttons
- **Spacing**: 4px base unit system with semantic spacing tokens
- **Shadows**: Elevation-based shadow system with named shadows
- **Borders**: Consistent border radius and width system
- **Theme Provider**: Centralized theme object with dark/light mode support

### 2. Type Safety (`src/types/`)
- Strongly typed interfaces for all domain models (User, Order, Cook, Meal, etc.)
- Discriminated unions for status types
- Navigation param lists with type safety
- API request/response types
- Form validation types
- Type guards for runtime type checking

### 3. Configuration (`src/config/`)
- Environment-based configuration with validation
- Feature flags for demo mode, logging, analytics
- External service keys management
- Type-safe config access

### 4. API Layer (`src/services/api/`)
- Centralized `ApiClient` class with:
  - Request/response interceptors
  - Automatic auth token injection
  - Token refresh logic
  - Retry with exponential backoff
  - Standardized error handling
- Modular API endpoints (auth, chat, order, payment, cook)
- Type-safe request/response handling

### 5. Secure Storage (`src/services/storage/`)
- Platform-aware storage (SecureStore on native, localStorage on web)
- Typed storage methods for auth tokens, user data, settings
- Device token and sync timestamp management

### 6. Error Handling (`src/utils/errorHandling.ts`)
- Standardized `AppError` structure with categories
- Automatic error normalization from Axios/unknown errors
- User-friendly error messages
- Retry logic with exponential backoff
- Error logging integration

### 7. Logging (`src/utils/logger.ts`)
- Leveled logging (debug, info, warn, error)
- Context-aware logging with tags
- API request/response logging
- Navigation and user action logging
- Performance timing
- Export for debugging

### 8. Validation (`src/utils/validation.ts`)
- Reusable validation rules (required, email, phone, password, etc.)
- Form-level validation with schema
- Common form schemas (login, register, profile, meal, etc.)
- Type-safe validation results

### 9. Redux Store (`src/store/`)
- Typed slices for auth, chat, theme
- Memoized selectors for derived state
- Logger middleware for development
- Persistence middleware for auth state
- Type-safe hooks (`useAppDispatch`, `useAppSelector`)

### 10. Custom Hooks (`src/hooks/`)
- `useAuth`: Authentication state and actions
- `useChat`: Chat business logic separated from UI
- `useWebSocket`: WebSocket connection with reconnection
- `useForm`: Form state management with validation

### 11. Reusable Components
- **Common**: Button, Input, Card with consistent theming
- **Feedback**: Loading, EmptyState, ErrorState, Toast/Snackbar
- **Forms**: Form hook integration
- **Layout**: Screen containers, safe area handling

### 12. Navigation (`src/navigation/`)
- Type-safe route definitions
- Param builders for navigation
- Deep linking configuration
- Screen options presets

## File Structure
```
src/
├── components/
│   ├── common/          # Button, Input, Card
│   ├── feedback/        # Loading, Empty, Error, Toast
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   └── navigation/      # Navigation components
├── config/
│   └── env.ts           # Environment configuration
├── constants/
│   └── index.ts         # App constants
├── hooks/
│   ├── redux.ts         # Typed Redux hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useChat.ts       # Chat business logic
│   ├── useWebSocket.ts  # WebSocket hook
│   └── useForm.ts       # Form hook
├── navigation/
│   └── routes.ts        # Navigation routes
├── services/
│   ├── api/             # API client and endpoints
│   ├── storage/         # Secure storage
│   └── auth/            # Auth service
├── store/
│   ├── slices/          # Redux slices
│   ├── middleware/      # Custom middleware
│   └── selectors/       # Memoized selectors
├── theme/
│   ├── colors.ts        # Color palette
│   ├── typography.ts    # Typography system
│   ├── spacing.ts       # Spacing system
│   ├── shadows.ts       # Shadow system
│   ├── borders.ts       # Border system
│   └── index.ts         # Theme exports
├── types/
│   └── index.ts         # Shared TypeScript types
├── utils/
│   ├── errorHandling.ts # Error utilities
│   ├── logger.ts        # Logging utility
│   ├── validation.ts    # Validation utilities
│   └── helpers.ts       # General helpers
└── screens/             # Screen components (existing)
```

## Migration Notes

### Breaking Changes
1. Import paths now use `@/` aliases (configured in tsconfig.json)
2. Theme colors accessed via `theme.colors.light` or `theme.colors.dark`
3. API calls now return standardized `ApiResponse<T>` objects
4. Redux selectors moved to `src/store/selectors`
5. Components use new design system tokens

### Deprecated
- Direct use of `colors.primary` from theme slice (use `theme.colors.light.primary`)
- Inline styles with magic numbers (use spacing tokens)
- Direct axios usage (use `apiClient` or API modules)
- Local storage for auth (use `secureStorage`)

## Future Enhancements
- Add React Query for server state management
- Implement proper offline support with queue
- Add unit/integration tests
- Set up CI/CD with linting and type checking
- Add Storybook for component documentation
- Implement feature flags service