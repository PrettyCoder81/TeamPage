import { mockApi } from './mockApi';
import * as realApi from './services';

// Use mock API in development, real API in production
// You can also control this with an environment variable
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const api = USE_MOCK_API ? mockApi : {
  auth: realApi.authApi,
  members: realApi.membersApi,
  machineRecords: realApi.machineRecordsApi,
  profile: realApi.profileApi,
  settings: realApi.settingsApi,
};

export { mockApi };
export * as realApi from './services';
export { default as apiClient } from './client';
