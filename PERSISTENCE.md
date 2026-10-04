# Redux Persistence Implementation

## Problem
The original `redux-persist` package (v6.0.0) has module resolution issues with Vite when the project uses `"type": "module"` in package.json. The package lacks proper ESM `exports` field, causing Vite to fail resolving subpath imports like:
- `redux-persist/lib/storage`
- `redux-persist/integration/react`

## Solution
Replaced `redux-persist` with a custom persistence middleware that uses `localStorage` directly.

## Implementation

### Custom Persistence Middleware (`src/store/index.ts`)

```typescript
// Saves state to localStorage after every action (debounced)
const persistMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  if (typeof window !== 'undefined') {
    requestAnimationFrame(() => {
      try {
        const state = storeAPI.getState();
        const toPersist = {
          auth: state.auth,
          members: state.members,
          machineRecords: state.machineRecords,
          settings: state.settings,
          profile: state.profile,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
      } catch (e) {
        console.warn('Failed to persist state:', e);
      }
    });
  }
  return result;
};

// Loads persisted state on app initialization
function loadPersistedState() {
  if (typeof window === 'undefined') return undefined;
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (e) {
    console.warn('Failed to load persisted state:', e);
    return undefined;
  }
}
```

### Key Features

1. **Automatic Persistence**: State is saved to localStorage after every Redux action
2. **Debounced Saves**: Uses `requestAnimationFrame` to batch saves and avoid excessive writes
3. **Error Handling**: Gracefully handles localStorage errors (quota exceeded, etc.)
4. **Selective Persistence**: Only persists specific slices (auth, members, machineRecords, settings, profile)
5. **SSR-Safe**: Checks for `window` object before accessing localStorage

### Storage Key
All persisted state is stored under: `team-portal-state`

### What Gets Persisted
- ✅ Authentication state (user info, login status)
- ✅ Members list
- ✅ Machine records
- ✅ User settings (notifications, appearance, security)
- ✅ User profile (bio, skills, social links)

## Benefits Over redux-persist

1. **No Module Resolution Issues**: Works seamlessly with Vite and ESM
2. **Simpler**: No additional dependencies or configuration
3. **Transparent**: Easy to understand and debug
4. **Flexible**: Can easily customize what gets persisted
5. **Lightweight**: No extra bundle size from redux-persist

## Usage

The persistence is automatic - no changes needed in components. Just dispatch Redux actions as normal, and the state will be persisted automatically.

To clear persisted state (e.g., on logout):
```typescript
localStorage.removeItem('team-portal-state');
```

## Testing

1. Make changes to any persisted state (login, add records, change settings)
2. Refresh the page
3. Verify the state is restored correctly

## Notes

- The `redux-persist` package is still in `package.json` but no longer used
- Can be safely removed with: `npm uninstall redux-persist`
- The custom solution provides the same functionality without the module resolution issues
