# EST Timezone Configuration

## Overview

This project uses **Eastern Standard Time (EST)** as the default timezone for all date and time operations. All timestamps are stored and displayed in EST timezone (America/New_York), which automatically handles both EST (UTC-5) and EDT (UTC-4) during daylight saving time.

## Implementation

### Timezone Utility

The timezone utility is located at `src/utils/timezone.ts` and provides the following functions:

#### Core Functions

```typescript
import { 
  getESTNow, 
  toEST, 
  formatEST, 
  getESTDateString, 
  getESTTimestamp,
  isTodayEST,
  getESTStartOfDay,
  getESTEndOfDay,
  formatRelativeEST
} from './utils/timezone';
```

#### Available Functions

1. **`getESTNow()`** - Get current date/time in EST
   ```typescript
   const now = getESTNow(); // dayjs object in EST timezone
   ```

2. **`toEST(date)`** - Convert any date to EST timezone
   ```typescript
   const estDate = toEST('2024-01-15T10:00:00Z');
   ```

3. **`formatEST(date, format)`** - Format date in EST timezone
   ```typescript
   const formatted = formatEST(date, 'YYYY-MM-DD HH:mm:ss');
   const readable = formatEST(date, 'MMMM D, YYYY [at] h:mm A');
   ```

4. **`getESTDateString(date?)`** - Get EST date string (YYYY-MM-DD)
   ```typescript
   const dateStr = getESTDateString(); // Today's date in EST
   ```

5. **`getESTTimestamp(date?)`** - Get EST timestamp (ISO string)
   ```typescript
   const timestamp = getESTTimestamp(); // Current EST timestamp
   ```

6. **`isTodayEST(date)`** - Check if a date is today in EST
   ```typescript
   if (isTodayEST(record.date)) { ... }
   ```

7. **`getESTStartOfDay(date?)`** - Get start of day in EST
   ```typescript
   const startOfDay = getESTStartOfDay();
   ```

8. **`getESTEndOfDay(date?)`** - Get end of day in EST
   ```typescript
   const endOfDay = getESTEndOfDay();
   ```

9. **`formatRelativeEST(date)`** - Format relative time in EST
   ```typescript
   const relative = formatRelativeEST(post.createdAt); // "2 hours ago"
   ```

## Usage in Components

### Machine Records Page

```typescript
import { formatEST, getESTDateString } from '../utils/timezone';

// Display date in table
<Typography variant="body2">
  {formatEST(record.date, 'MMM D, YYYY')}
</Typography>

// Display detailed date/time
<Typography variant="body2">
  {formatEST(record.date, 'MMMM D, YYYY [at] h:mm A')}
</Typography>

// Initialize form with current EST date
const [formData, setFormData] = useState({
  date: getESTDateString(),
  // ...
});
```

### Reference Posts Page

```typescript
import { formatEST } from '../utils/timezone';

// Display creation date
<Typography variant="body2">
  {formatEST(post.createdAt, 'MMM D, YYYY')}
</Typography>
```

### Members Page

```typescript
import { getESTNow } from '../utils/timezone';

// Initialize calendar with EST date
const [selectedMonth, setSelectedMonth] = useState(getESTNow().month());
const [selectedYear, setSelectedYear] = useState(getESTNow().year());
```

## Mock Data

All mock data uses EST timezone timestamps:

### Machine Records
```typescript
// In src/mock/data.ts
function getRecentDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().replace('Z', '-05:00'); // EST timezone
}
```

### Reference Posts
```typescript
// In src/api/mockApi.ts
{
  id: '1',
  createdAt: '2024-01-15T10:00:00-05:00', // EST timezone
  updatedAt: '2024-01-15T10:00:00-05:00',
}
```

### Member Weekly Status
```typescript
// In src/mock/data.ts
const estDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
const dateStr = estDate.toISOString().split('T')[0];
```

## Date Format Examples

### Common Formats

```typescript
// Date only
formatEST(date, 'YYYY-MM-DD')           // 2024-01-15
formatEST(date, 'MMM D, YYYY')          // Jan 15, 2024
formatEST(date, 'MMMM D, YYYY')         // January 15, 2024

// Time only
formatEST(date, 'h:mm A')               // 10:30 AM
formatEST(date, 'HH:mm:ss')             // 10:30:00

// Date and time
formatEST(date, 'MMM D, YYYY h:mm A')   // Jan 15, 2024 10:30 AM
formatEST(date, 'MMMM D, YYYY [at] h:mm A') // January 15, 2024 at 10:30 AM

// Full timestamp
formatEST(date, 'YYYY-MM-DD HH:mm:ss')  // 2024-01-15 10:30:00
```

## Daylight Saving Time

The timezone configuration uses `America/New_York`, which automatically handles:
- **EST (Eastern Standard Time)**: UTC-5 (November to March)
- **EDT (Eastern Daylight Time)**: UTC-4 (March to November)

No manual adjustments are needed for daylight saving time transitions.

## Best Practices

### 1. Always Use Timezone Utilities

❌ **Don't:**
```typescript
const date = new Date().toISOString();
const formatted = date.toLocaleDateString();
```

✅ **Do:**
```typescript
const date = getESTTimestamp();
const formatted = formatEST(date, 'MMM D, YYYY');
```

### 2. Store Dates in ISO Format

Always store dates in ISO format with timezone offset:
```typescript
// Good
createdAt: '2024-01-15T10:00:00-05:00'

// Avoid
createdAt: '2024-01-15T10:00:00Z' // UTC, not EST
createdAt: '2024-01-15' // No time information
```

### 3. Use Consistent Formatting

Use the same format for similar data types:
```typescript
// Table views - short format
formatEST(date, 'MMM D, YYYY')

// Detail views - long format
formatEST(date, 'MMMM D, YYYY [at] h:mm A')

// Forms - ISO format
getESTDateString() // YYYY-MM-DD
```

### 4. Handle User Input

When users input dates, convert them to EST:
```typescript
const userInput = '2024-01-15';
const estDate = toEST(userInput);
const timestamp = estDate.toISOString();
```

## Testing

### Verify EST Timezone

```typescript
import { getESTNow, formatEST } from './utils/timezone';

// Check current time is in EST
const now = getESTNow();
console.log(now.format('Z')); // Should show -05:00 or -04:00 (EDT)

// Format and verify
const formatted = formatEST(new Date(), 'YYYY-MM-DD HH:mm:ss Z');
console.log(formatted); // 2024-01-15 10:30:00 -05:00
```

### Test Date Conversions

```typescript
import { toEST, formatEST } from './utils/timezone';

// UTC to EST
const utcDate = '2024-01-15T15:00:00Z';
const estDate = toEST(utcDate);
console.log(formatEST(estDate, 'YYYY-MM-DD HH:mm:ss')); 
// 2024-01-15 10:00:00 (EST is UTC-5)
```

## Migration Guide

If you're updating existing code to use EST timezone:

### Step 1: Import Timezone Utilities
```typescript
import { formatEST, getESTDateString, getESTTimestamp } from '../utils/timezone';
```

### Step 2: Replace Date Operations

**Before:**
```typescript
const date = new Date().toISOString().split('T')[0];
<Typography>{record.date}</Typography>
```

**After:**
```typescript
const date = getESTDateString();
<Typography>{formatEST(record.date, 'MMM D, YYYY')}</Typography>
```

### Step 3: Update Mock Data

**Before:**
```typescript
createdAt: '2024-01-15T10:00:00Z'
```

**After:**
```typescript
createdAt: '2024-01-15T10:00:00-05:00'
```

## Troubleshooting

### Issue: Dates showing in wrong timezone

**Solution:** Ensure you're using `formatEST()` instead of native Date methods:
```typescript
// Wrong
new Date(date).toLocaleDateString()

// Right
formatEST(date, 'MMM D, YYYY')
```

### Issue: Form dates not in EST

**Solution:** Use `getESTDateString()` for date inputs:
```typescript
// Wrong
date: new Date().toISOString().split('T')[0]

// Right
date: getESTDateString()
```

### Issue: Mock data timestamps incorrect

**Solution:** Use EST timezone offset in mock data:
```typescript
// Wrong
createdAt: '2024-01-15T10:00:00Z'

// Right
createdAt: '2024-01-15T10:00:00-05:00'
```

## Dependencies

- **dayjs**: Lightweight date library (already installed)
- **dayjs/plugin/utc**: UTC plugin for dayjs
- **dayjs/plugin/timezone**: Timezone plugin for dayjs

## Files Modified

- `src/utils/timezone.ts` - Timezone utility functions
- `src/mock/data.ts` - Mock data with EST timestamps
- `src/api/mockApi.ts` - API mock data with EST timestamps
- `src/pages/MachineRecordsPage.tsx` - Date display and form handling
- `src/pages/ReferencePostsPage.tsx` - Date display
- `src/pages/MembersPage.tsx` - Calendar initialization

## Summary

All dates and times in the application are now handled in EST timezone:
- ✅ All timestamps stored with EST offset (-05:00)
- ✅ All date displays use `formatEST()` utility
- ✅ All form inputs use `getESTDateString()` utility
- ✅ Mock data uses EST timezone
- ✅ Calendar components use EST timezone
- ✅ Automatic daylight saving time handling

The application consistently displays and manages all temporal data in Eastern Standard Time.
