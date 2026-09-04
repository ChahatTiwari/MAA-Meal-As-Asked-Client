// config/env.ts
// Environment configuration for the MAA app

interface EnvConfig {
  // API Configuration
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  
  // WebSocket Configuration
  websocket: {
    url: string;
    reconnectAttempts: number;
    reconnectDelay: number;
    heartbeatInterval: number;
  };
  
  // Authentication Configuration
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
    tokenExpiryBuffer: number; // seconds before expiry to refresh
  };
  
  // Storage Configuration
  storage: {
    useSecureStore: boolean;
    fallbackToLocalStorage: boolean;
  };
  
  // Feature Flags
  features: {
    demoMode: boolean;
    enableLogging: boolean;
    enableAnalytics: boolean;
    enableCrashReporting: boolean;
  };
  
  // App Configuration
  app: {
    name: string;
    version: string;
    buildNumber: string;
    supportEmail: string;
    privacyPolicyUrl: string;
    termsOfServiceUrl: string;
  };
  
  // External Services
  external: {
    googleMapsApiKey?: string;
    openAiApiKey?: string;
    sentryDsn?: string;
  };
}

// Default configuration
const defaultConfig: EnvConfig = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  
  websocket: {
    url: process.env.EXPO_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080',
    reconnectAttempts: 5,
    reconnectDelay: 2000,
    heartbeatInterval: 30000,
  },
  
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiryBuffer: 300, // 5 minutes
  },
  
  storage: {
    useSecureStore: true,
    fallbackToLocalStorage: true,
  },
  
  features: {
    demoMode: process.env.EXPO_PUBLIC_DEMO_MODE === 'true' || true,
    enableLogging: __DEV__,
    enableAnalytics: false,
    enableCrashReporting: false,
  },
  
  app: {
    name: 'MAA',
    version: '1.0.0',
    buildNumber: '1',
    supportEmail: 'support@maa.app',
    privacyPolicyUrl: 'https://maa.app/privacy',
    termsOfServiceUrl: 'https://maa.app/terms',
  },
  
  external: {
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    openAiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  },
};

// Validate required environment variables
const validateConfig = (config: EnvConfig): void => {
  if (!config.api.baseUrl) {
    console.warn('[Config] API base URL not set, using default');
  }
  
  if (!config.websocket.url) {
    console.warn('[Config] WebSocket URL not set, using default');
  }
  
  if (config.features.demoMode) {
    console.log('[Config] Running in DEMO MODE');
  }
};

validateConfig(defaultConfig);

export const env = defaultConfig;
export type { EnvConfig };

export default env;