import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Pagination,
  Stack,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { formatEST } from '../utils/timezone';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Search as SearchIcon,
  OpenInNew as OpenInNewIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { RootState, useAppDispatch } from '../store';
import {
  fetchReferencePosts,
  createReferencePost,
  updateReferencePost,
  deleteReferencePost,
  setFilters,
  clearFilters,
} from '../store/slices/referencePostsSlice';
import { ReferencePost } from '../types';
import { toastActions } from '../utils/toast';

const ROWS_PER_PAGE = 6;

const ReferencePostsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, filters, loading } = useSelector((state: RootState) => state.referencePosts);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ReferencePost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    tags: [] as string[],
  });

  // Fetch posts on mount
  useEffect(() => {
    dispatch(fetchReferencePosts());
  }, [dispatch]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.description?.toLowerCase().includes(searchLower) ||
          post.url.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Tag filter
    if (filters.tag) {
      filtered = filtered.filter((post) => post.tags.includes(filters.tag));
    }

    // Created by filter
    if (filters.createdBy) {
      filtered = filtered.filter((post) => post.createdBy === filters.createdBy);
    }

    // Sort by date descending (latest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [posts, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / ROWS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [posts]);

  // Get all unique creators
  const allCreators = useMemo(() => {
    const creatorSet = new Set<string>();
    posts.forEach((post) => creatorSet.add(post.createdBy));
    return Array.from(creatorSet);
  }, [posts]);

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setFilters({ [field]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setCurrentPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleOpenDialog = (post?: ReferencePost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        url: post.url,
        title: post.title,
        description: post.description || '',
        tags: post.tags,
      });
    } else {
      setEditingPost(null);
      setFormData({
        url: '',
        title: '',
        description: '',
        tags: [],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPost(null);
    setFormData({
      url: '',
      title: '',
      description: '',
      tags: [],
    });
  };

  const handleSave = async () => {
    if (!formData.url || !formData.title) {
      toastActions.error('URL and title are required');
      return;
    }

    try {
      if (editingPost) {
        await dispatch(
          updateReferencePost({
            id: editingPost.id,
            updates: formData,
          })
        ).unwrap();
        toastActions.recordUpdated();
      } else {
        await dispatch(
          createReferencePost({
            ...formData,
            createdBy: user?.name || '',
          })
        ).unwrap();
        toastActions.recordCreated();
        setCurrentPage(1);
      }
      handleCloseDialog();
    } catch (error) {
      toastActions.recordError(editingPost ? 'update' : 'create');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deleteReferencePost(id)).unwrap();
        toastActions.recordDeleted();
      } catch (error) {
        toastActions.recordError('delete');
      }
    }
  };

  const canEdit = (post: ReferencePost) => {
    return isAdmin || post.createdBy === user?.name;
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  console.log(paginatedPosts)
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Reference Posts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share and manage useful reference links
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: '#6366f1',
            '&:hover': { bgcolor: '#4f46e5' },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          Add Post
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: showFilters ? 2 : 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon sx={{ color: '#64748b' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                Filters
              </Typography>
              <Chip
                label={`${filteredPosts.length} posts`}
                size="small"
                sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontWeight: 600 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                onClick={handleClearFilters}
                sx={{ textTransform: 'none', color: '#64748b' }}
              >
                Clear All
              </Button>
              <IconButton size="small" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? <ClearIcon /> : <FilterListIcon />}
              </IconButton>
            </Box>
          </Box>

          {showFilters && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search posts..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tag</InputLabel>
                  <Select
                    value={filters.tag}
                    label="Tag"
                    onChange={(e) => handleFilterChange('tag', e.target.value)}
                  >
                    <MenuItem value="">All Tags</MenuItem>
                    {allTags.map((tag) => (
                      <MenuItem key={tag} value={tag}>
                        {tag}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Created By</InputLabel>
                  <Select
                    value={filters.createdBy}
                    label="Created By"
                    onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                  >
                    <MenuItem value="">All Users</MenuItem>
                    {allCreators.map((creator) => (
                      <MenuItem key={creator} value={creator}>
                        {creator}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>URL</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Tags</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Created By</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPosts.map((post) => {
                const isLatest = currentPage === 1 && filteredPosts.indexOf(post) === 0;
                return (
                  <TableRow key={post.id} hover sx={{ bgcolor: isLatest ? 'rgba(99, 102, 241, 0.04)' : 'transparent' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {post.title}
                        </Typography>
                        {isLatest && (
                          <Chip
                            label="Latest"
                            size="small"
                            sx={{
                              bgcolor: '#6366f1',
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '0.65rem',
                              height: 20,
                            }}
                          />
                        )}
                      </Box>
                      {post.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {post.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinkIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#6366f1',
                            fontSize: '0.85rem',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {getDomainFromUrl(post.url)}
                        </Typography>
                        <Tooltip title="Open in new tab">
                          <IconButton
                            size="small"
                            onClick={() => window.open(post.url, '_blank')}
                            sx={{ color: '#6366f1' }}
                          >
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {post.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(99, 102, 241, 0.1)',
                              color: '#6366f1',
                              fontWeight: 500,
                              fontSize: '0.7rem',
                              height: 24,
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{post.createdBy}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                        {formatEST(post.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {canEdit(post) && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleOpenDialog(post)}>
                                <EditIcon fontSize="small" sx={{ color: '#6366f1' }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => handleDelete(post.id)}>
                                <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedPosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="body1" color="text.secondary">
                      No posts found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {filteredPosts.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2, borderTop: '1px solid #f1f5f9' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {((currentPage - 1) * ROWS_PER_PAGE) + 1} to {Math.min(currentPage * ROWS_PER_PAGE, filteredPosts.length)} of{' '}
              {filteredPosts.length} posts
            </Typography>
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
              />
            </Stack>
          </Box>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{editingPost ? 'Edit Post' : 'Add New Post'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Post title"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
                multiline
                rows={3}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                // value={formData.tags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag);
                  setFormData({ ...formData, tags });
                }}
                placeholder="e.g., React, Tutorial, JavaScript"
                helperText="Enter tags separated by commas"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: '#6366f1',
              '&:hover': { bgcolor: '#4f46e5' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {editingPost ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReferencePostsPage;
