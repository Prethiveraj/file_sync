declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SYNC_ENDPOINT: string;
      EXPO_PUBLIC_APP_ID: string;
    }
  }
}

// Ensure this file is treated as a module
export {};