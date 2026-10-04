# API Integration Documentation

## Overview

The application now includes a comprehensive API layer that supports both mock and real backend implementations. The API is structured to be easily switchable between development (mock) and production (real backend) modes.

## Architecture

### API Layer Structure

```
src/api/
├── client.ts          # Axios instance with interceptors
├── services.ts        # Real API service implementations
├── mockApi.ts         # Mock API for development
└── index.ts           # API exports and environment switching
```

### API Client (`client.ts`)

The API client is configured with:
- **Base URL**: Configurable via `VITE_API_BASE_URL` environment variable
- **Timeout**: 10 seconds
- **Request Interceptor**: Automatically adds JWT token from localStorage
- **Response Interceptor**: Handles errors globally, including 401 unauthorized redirects

```typescript
// Example configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
```

### API Services (`services.ts`)

Real API implementations using axios:

#### Auth API
```typescript
authApi.login(email, password)           // POST /auth/login
authApi.register(userData)               // POST /auth/register
authApi.logout()                         // POST /auth/logout
authApi.getCurrentUser()                 // GET /auth/me
```

#### Members API
```typescript
membersApi.getAll()                      // GET /members
membersApi.getById(id)                   // GET /members/:id
membersApi.update(id, updates)           // PUT /members/:id
```

#### Machine Records API
```typescript
machineRecordsApi.getAll()               // GET /machine-records
machineRecordsApi.getById(id)            // GET /machine-records/:id
machineRecordsApi.create(record)         // POST /machine-records
machineRecordsApi.update(id, updates)    // PUT /machine-records/:id
machineRecordsApi.delete(id)             // DELETE /machine-records/:id
```

#### Profile API
```typescript
profileApi.get()                         // GET /profile
profileApi.update(updates)               // PUT /profile
profileApi.addSkill(skill)               // POST /profile/skills
profileApi.removeSkill(skill)            // DELETE /profile/skills/:skill
```

#### Settings API
```typescript
settingsApi.get()                        // GET /settings
settingsApi.update(updates)              // PUT /settings
```

### Mock API (`mockApi.ts`)

Provides mock implementations with simulated network delays for development:
- All methods return Promises
- Simulates realistic delays (200-500ms)
- Uses in-memory data from `mock/data.ts`
- Perfect for frontend development without a backend

## Environment Configuration

### Switching Between Mock and Real API

Create a `.env` file in the project root:

```bash
# Use mock API (default for development)
VITE_USE_MOCK_API=true

# Or use real API
VITE_USE_MOCK_API=false

# API base URL (for real API)
VITE_API_BASE_URL=http://localhost:3001/api
```

The API index file automatically switches based on the environment:

```typescript
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const api = USE_MOCK_API ? mockApi : {
  auth: realApi.authApi,
  members: realApi.membersApi,
  // ...
};
```

## Redux Integration

### Async Thunks

All API calls are wrapped in Redux async thunks for proper state management:

#### Auth Thunks
```typescript
dispatch(login({ email, password }))     // Login user
dispatch(register(userData))             // Register new user
dispatch(logout())                       // Logout user
```

#### Machine Records Thunks
```typescript
dispatch(fetchMachineRecords())          // Fetch all records
dispatch(createMachineRecord(record))    // Create new record
dispatch(updateMachineRecord({ id, updates }))  // Update record
dispatch(deleteMachineRecord(id))        // Delete record
```

### State Management

Each slice includes:
- **Loading state**: `loading: boolean`
- **Error state**: `error: string | null`
- **Data state**: Actual data from API

Example usage in components:
```typescript
const { records, loading, error } = useSelector((state) => state.machineRecords);

useEffect(() => {
  dispatch(fetchMachineRecords());
}, [dispatch]);

if (loading) return <CircularProgress />;
if (error) return <Alert severity="error">{error}</Alert>;
```

## Backend API Specification

If you're building a real backend, here's the expected API structure:

### Authentication Endpoints

#### POST /auth/login
```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

#### POST /auth/register
```json
// Request
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}

// Response
{
  "user": { ... },
  "token": "jwt-token-here"
}
```

### Machine Records Endpoints

#### GET /machine-records
```json
// Response
[
  {
    "id": "1",
    "subnet": "192.168.1.0/24",
    "date": "2024-01-15",
    "trainer": "John Smith",
    "machine": "GPU-Server-01",
    "dataset": "ImageNet-1K",
    "epoch": 100,
    "purpose": "Model Training",
    "result": "Accuracy: 94.2%",
    "analysis": "Model converged well",
    "createdBy": "1",
    "status": "completed"
  }
]
```

#### POST /machine-records
```json
// Request
{
  "subnet": "192.168.1.0/24",
  "date": "2024-01-15",
  "trainer": "John Smith",
  "machine": "GPU-Server-01",
  "dataset": "ImageNet-1K",
  "epoch": 100,
  "purpose": "Model Training",
  "result": "Accuracy: 94.2%",
  "analysis": "Model converged well",
  "createdBy": "1",
  "status": "completed"
}

// Response
{
  "id": "new-id",
  ... (all fields)
}
```

## Error Handling

The API client includes comprehensive error handling:

1. **Network Errors**: Handled in response interceptor
2. **401 Unauthorized**: Automatically clears token and redirects to login
3. **Validation Errors**: Returned as rejected promises with error messages
4. **Server Errors**: Logged and returned to components

Example error handling in components:
```typescript
try {
  await dispatch(createMachineRecord(record)).unwrap();
  // Success
} catch (error) {
  // Error is already in Redux state
  console.error('Failed to create record:', error);
}
```

## Development Workflow

### 1. Frontend Development (Mock API)
```bash
# .env
VITE_USE_MOCK_API=true

npm run dev
```

### 2. Backend Development
```bash
# .env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:3001/api

npm run dev
```

### 3. Production
```bash
# .env.production
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://api.yourdomain.com

npm run build
```

## Testing

### Testing with Mock API
The mock API is perfect for:
- Frontend development
- UI testing
- Demo presentations
- Offline development

### Testing with Real API
Use tools like Postman or Insomnia to test your backend endpoints before integrating with the frontend.

## Migration Guide

If you're migrating from mock to real API:

1. **Set up your backend** with the endpoints described above
2. **Update environment variables**:
   ```bash
   VITE_USE_MOCK_API=false
   VITE_API_BASE_URL=your-backend-url
   ```
3. **Test all features** to ensure API compatibility
4. **Deploy** with production environment variables

## Security Considerations

1. **JWT Tokens**: Stored in localStorage (consider httpOnly cookies for production)
2. **CORS**: Configure your backend to allow requests from your frontend domain
3. **HTTPS**: Always use HTTPS in production
4. **Token Refresh**: Implement token refresh logic for long sessions
5. **Rate Limiting**: Add rate limiting to your backend API

## Future Enhancements

- [ ] Token refresh mechanism
- [ ] Request/response caching
- [ ] Optimistic updates
- [ ] WebSocket support for real-time updates
- [ ] File upload support
- [ ] API versioning
- [ ] Request batching

## Support

For questions or issues with the API integration, refer to:
- Redux Toolkit documentation: https://redux-toolkit.js.org/
- Axios documentation: https://axios-http.com/
- React Router documentation: https://reactrouter.com/
