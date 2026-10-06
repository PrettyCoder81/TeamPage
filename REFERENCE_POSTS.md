# Reference Posts Feature

## Overview

The Reference Posts feature allows team members to share, manage, and organize useful reference links (URLs) with descriptions and tags. This creates a centralized knowledge base for the team.

## Features

### Core Functionality
- ✅ **Create Posts**: Add new reference URLs with title, description, and tags
- ✅ **Edit Posts**: Update your own posts (admins can edit all)
- ✅ **Delete Posts**: Remove your own posts (admins can delete all)
- ✅ **View Posts**: Browse all shared reference links
- ✅ **Open Links**: Click to open URLs in new tabs
- ✅ **Filter & Search**: Find posts by search term, tag, or creator
- ✅ **Pagination**: Navigate through posts (6 per page)
- ✅ **Latest Indicator**: Visual badge on the most recent post

### Data Model

```typescript
interface ReferencePost {
  id: string;
  url: string;              // The reference URL
  title: string;            // Post title
  description?: string;     // Optional description
  tags: string[];           // Array of tags for categorization
  createdBy: string;        // User ID who created the post
  createdAt: string;        // ISO timestamp
  updatedAt: string;        // ISO timestamp
}
```

## User Interface

### Posts Table
The main view displays posts in a table format with:
- **Title**: Post title with optional description below
- **URL**: Domain extracted from URL with link icon and "open in new tab" button
- **Tags**: Colored chips showing post tags
- **Created By**: User who created the post
- **Date**: Creation date
- **Actions**: Edit and delete buttons (for authorized users)

### Filters
Three filter options available:
1. **Search**: Full-text search across title, description, URL, and tags
2. **Tag**: Filter by specific tag
3. **Created By**: Filter by user who created the post

### Add/Edit Dialog
Form fields:
- **URL**: Required - The reference link
- **Title**: Required - Post title
- **Description**: Optional - Additional context
- **Tags**: Comma-separated list of tags

## Access Control

### Regular Users
- ✅ Can create their own posts
- ✅ Can edit their own posts
- ✅ Can delete their own posts
- ✅ Can view all posts

### Admins
- ✅ All user permissions
- ✅ Can edit any post
- ✅ Can delete any post

## Implementation Details

### File Structure
```
src/
├── types/
│   └── index.ts                    # ReferencePost interface
├── store/
│   └── slices/
│       └── referencePostsSlice.ts  # Redux slice with async thunks
├── api/
│   ├── mockApi.ts                  # Mock API implementation
│   ├── services.ts                 # Real API implementation
│   └── index.ts                    # API exports
├── pages/
│   └── ReferencePostsPage.tsx      # Main page component
├── layouts/
│   └── Sidebar.tsx                 # Navigation updated
├── utils/
│   └── toast.ts                    # Toast notifications
└── App.tsx                         # Route configuration
```

### Redux State
```typescript
interface ReferencePostsState {
  posts: ReferencePost[];
  filters: {
    search: string;
    tag: string;
    createdBy: string;
  };
  loading: boolean;
  error: string | null;
}
```

### API Endpoints (Mock)
```typescript
referencePosts: {
  getAll()              // GET /reference-posts
  getById(id)           // GET /reference-posts/:id
  create(post)          // POST /reference-posts
  update(id, updates)   // PUT /reference-posts/:id
  delete(id)            // DELETE /reference-posts/:id
}
```

### Sample Data
The mock API includes 5 sample posts:
1. GPT-3 Paper (arxiv.org)
2. PyTorch Tutorials
3. Hugging Face Documentation
4. Kaggle Learn
5. ML For Beginners (GitHub)

## Usage Examples

### Creating a Post
1. Click "Add Post" button
2. Fill in the form:
   - URL: `https://react.dev/learn`
   - Title: `React Official Documentation`
   - Description: `Learn React from the official docs`
   - Tags: `React, Tutorial, Frontend`
3. Click "Create"
4. Success toast appears

### Filtering Posts
1. Use search bar to find posts by keyword
2. Select a tag from dropdown to filter by category
3. Select a user to see their posts only
4. Click "Clear All" to reset filters

### Editing a Post
1. Click edit icon on your post
2. Modify fields in the dialog
3. Click "Update"
4. Success toast appears

### Deleting a Post
1. Click delete icon on your post
2. Confirm deletion in dialog
3. Post is removed
4. Success toast appears

## Toast Notifications

### Success Messages
- ✅ "Reference post created successfully."
- ✅ "Reference post updated successfully."
- ✅ "Reference post deleted successfully."

### Error Messages
- ❌ "URL and title are required"
- ❌ "Failed to create post. Please try again."
- ❌ "Failed to update post. Please try again."
- ❌ "Failed to delete post. Please try again."

## Styling

### Color Scheme
- **Primary**: Indigo (#6366f1)
- **Tags**: Light indigo background with indigo text
- **Latest Badge**: Solid indigo background
- **Links**: Indigo text color
- **Domain Text**: Gray (#94a3b8)

### Visual Indicators
- **Latest Post**: Indigo background tint + "Latest" chip
- **Tags**: Rounded chips with light background
- **URLs**: Link icon + domain text + open button
- **Actions**: Edit (indigo) and Delete (red) icons

## Pagination

- **Items per page**: 6 posts
- **Navigation**: First, Previous, Page numbers, Next, Last
- **Info**: "Showing X to Y of Z posts"
- **Auto-reset**: Returns to page 1 when filters change

## Search & Filter Logic

### Search
Searches across:
- Title (case-insensitive)
- Description (case-insensitive)
- URL (case-insensitive)
- Tags (case-insensitive)

### Tag Filter
- Exact match on tag
- Dropdown populated from all unique tags in posts

### Created By Filter
- Exact match on creator ID
- Dropdown populated from all unique creators

## Sorting

Posts are sorted by creation date in descending order (newest first).

## Integration with Other Features

### Authentication
- Requires user to be logged in
- Uses `user.id` for `createdBy` field
- Checks permissions based on `user.role`

### Toast System
- Uses centralized toast utility
- Consistent with other CRUD operations
- Provides user feedback for all actions

### Persistence
- State persisted to localStorage
- Survives page refreshes
- Syncs with API on mount

## Backend API Specification

For real backend implementation:

### GET /reference-posts
Returns all reference posts.

**Response:**
```json
[
  {
    "id": "1",
    "url": "https://example.com",
    "title": "Example Post",
    "description": "Description",
    "tags": ["tag1", "tag2"],
    "createdBy": "user1",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

### POST /reference-posts
Creates a new reference post.

**Request:**
```json
{
  "url": "https://example.com",
  "title": "Example Post",
  "description": "Description",
  "tags": ["tag1", "tag2"],
  "createdBy": "user1"
}
```

**Response:** Created post with id and timestamps.

### PUT /reference-posts/:id
Updates an existing post.

**Request:**
```json
{
  "url": "https://example.com",
  "title": "Updated Title",
  "description": "Updated description",
  "tags": ["tag1", "tag3"]
}
```

**Response:** Updated post.

### DELETE /reference-posts/:id
Deletes a post.

**Response:** 204 No Content.

## Future Enhancements

Potential improvements:
- [ ] URL metadata auto-fetch (title, description, favicon)
- [ ] Rich text editor for descriptions
- [ ] Bookmark/favorite posts
- [ ] Comments on posts
- [ ] Share posts via email/chat
- [ ] Export posts to CSV/JSON
- [ ] Import posts from browser bookmarks
- [ ] Post categories/folders
- [ ] Pin important posts
- [ ] Post analytics (views, clicks)
- [ ] Related posts suggestions
- [ ] Full-text search with highlighting
- [ ] Tag autocomplete
- [ ] Bulk operations (delete multiple, export)

## Testing Checklist

- [ ] Create post with all fields
- [ ] Create post with minimal fields (URL + title)
- [ ] Edit post and verify changes
- [ ] Delete post and verify removal
- [ ] Filter by search term
- [ ] Filter by tag
- [ ] Filter by creator
- [ ] Clear all filters
- [ ] Navigate pagination
- [ ] Open URL in new tab
- [ ] Verify "Latest" badge on newest post
- [ ] Test access control (user vs admin)
- [ ] Verify toast notifications
- [ ] Test persistence (refresh page)
- [ ] Verify sorting (newest first)

## Troubleshooting

### Posts not loading
- Check API connection
- Verify authentication
- Check browser console for errors

### Can't edit/delete posts
- Verify you own the post or are admin
- Check permissions in Redux state

### Filters not working
- Clear all filters and try again
- Check filter state in Redux DevTools

### Toasts not showing
- Verify Toaster component in App.tsx
- Check toast utility imports

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API responses in Network tab
3. Check Redux state in DevTools
4. Review this documentation
5. Contact development team
