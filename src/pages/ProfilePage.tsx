import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  TextField,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import LinkIcon from '@mui/icons-material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StarIcon from '@mui/icons-material/Star';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateProfile, addSkill, removeSkill, updateSocialLinks } from '../store/slices/profileSlice';
import { toastActions } from '../utils/toast';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.profile);
  const records = useSelector((state: RootState) => state.machineRecords.records);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const [newSkill, setNewSkill] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const userRecords = records.filter(r => r.createdBy === user?.id);
  const completedJobs = userRecords.filter(r => r.status === 'completed').length;
  const runningJobs = userRecords.filter(r => r.status === 'running').length;
  const totalEpochs = userRecords.reduce((sum, r) => sum + r.epoch, 0);

  const handleSave = () => {
    dispatch(updateProfile(editData));
    setIsEditing(false);
    toastActions.profileUpdated();
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      dispatch(addSkill(newSkill.trim()));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    dispatch(removeSkill(skill));
  };

  const recentActivity = [
    { id: 1, action: 'Completed training job', target: 'ResNet50 on ImageNet', time: '2 hours ago', icon: <CheckIcon sx={{ color: '#22c55e' }} /> },
    { id: 2, action: 'Started new job', target: 'BERT fine-tuning', time: '5 hours ago', icon: <PrecisionManufacturingIcon sx={{ color: '#6366f1' }} /> },
    { id: 3, action: 'Updated profile information', target: '', time: '1 day ago', icon: <EditIcon sx={{ color: '#f59e0b' }} /> },
    { id: 4, action: 'Joined team', target: 'AI Research', time: '2 weeks ago', icon: <StarIcon sx={{ color: '#8b5cf6' }} /> },
  ];

  return (
    <Box>
      {/* Cover + Profile Header */}
      <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', mb: 3 }}>
        <Box
          sx={{
            height: 180,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
          }}
        />
        <Box sx={{ px: 4, pb: 4, mt: -6, position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, mb: 3 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: '#6366f1',
                fontSize: '2.5rem',
                fontWeight: 700,
                border: '4px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, pb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {user?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {user?.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={user?.role}
                  size="small"
                  sx={{
                    bgcolor: user?.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: user?.role === 'admin' ? '#ef4444' : '#22c55e',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                />
                <Chip label="ML Engineer" size="small" variant="outlined" sx={{ borderColor: '#e2e8f0' }} />
              </Box>
            </Box>
            <Box>
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<CheckIcon />}
                    onClick={handleSave}
                    sx={{ bgcolor: '#22c55e', '&:hover': { bgcolor: '#16a34a' }, textTransform: 'none', borderRadius: 2 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    onClick={handleCancel}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Card>

      <Grid container spacing={3}>
        {/* Left Column - About */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* About Section */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                About
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="Write a short bio..."
                />
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {profile.bio}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Phone</Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    />
                  ) : (
                    <Typography variant="body1">{profile.phone}</Typography>
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Location</Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editData.location}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: '#94a3b8' }} /></InputAdornment> } }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                      <Typography variant="body1">{profile.location}</Typography>
                    </Box>
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Company</Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editData.company}
                      onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <WorkIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                      <Typography variant="body1">{profile.company}</Typography>
                    </Box>
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Website</Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editData.website}
                      onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LinkIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                      <Typography variant="body1" sx={{ color: '#6366f1' }}>{profile.website}</Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {profile.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={isEditing ? () => handleRemoveSkill(skill) : undefined}
                    sx={{
                      bgcolor: 'rgba(99, 102, 241, 0.08)',
                      color: '#6366f1',
                      fontWeight: 500,
                      '& .MuiChip-deleteIcon': { color: '#6366f1' },
                    }}
                  />
                ))}
              </Box>
              {isEditing && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddSkill}
                    sx={{ textTransform: 'none' }}
                  >
                    Add
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Stats & Activity */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Stats */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                    <CheckIcon sx={{ color: '#22c55e', fontSize: 28, mb: 0.5 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#166534' }}>{completedJobs}</Typography>
                    <Typography variant="caption" color="text.secondary">Completed</Typography>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(99, 102, 241, 0.08)', borderRadius: 2 }}>
                    <PrecisionManufacturingIcon sx={{ color: '#6366f1', fontSize: 28, mb: 0.5 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#6366f1' }}>{runningJobs}</Typography>
                    <Typography variant="caption" color="text.secondary">Running</Typography>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fef3c7', borderRadius: 2 }}>
                    <TrendingUpIcon sx={{ color: '#f59e0b', fontSize: 28, mb: 0.5 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#92400e' }}>{totalEpochs}</Typography>
                    <Typography variant="caption" color="text.secondary">Total Epochs</Typography>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#faf5ff', borderRadius: 2 }}>
                    <ScheduleIcon sx={{ color: '#8b5cf6', fontSize: 28, mb: 0.5 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#6b21a8' }}>{userRecords.length}</Typography>
                    <Typography variant="caption" color="text.secondary">Total Jobs</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                Social Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <GitHubIcon sx={{ color: '#475569' }} />
                  {isEditing ? (
                    <TextField
                      size="small"
                      fullWidth
                      value={editData.socialLinks.github}
                      onChange={(e) => setEditData({ ...editData, socialLinks: { ...editData.socialLinks, github: e.target.value } })}
                    />
                  ) : (
                    <Typography variant="body2">{profile.socialLinks.github}</Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LinkedInIcon sx={{ color: '#0077b5' }} />
                  {isEditing ? (
                    <TextField
                      size="small"
                      fullWidth
                      value={editData.socialLinks.linkedin}
                      onChange={(e) => setEditData({ ...editData, socialLinks: { ...editData.socialLinks, linkedin: e.target.value } })}
                    />
                  ) : (
                    <Typography variant="body2">{profile.socialLinks.linkedin}</Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TwitterIcon sx={{ color: '#1da1f2' }} />
                  {isEditing ? (
                    <TextField
                      size="small"
                      fullWidth
                      value={editData.socialLinks.twitter}
                      onChange={(e) => setEditData({ ...editData, socialLinks: { ...editData.socialLinks, twitter: e.target.value } })}
                    />
                  ) : (
                    <Typography variant="body2">{profile.socialLinks.twitter}</Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivity.map((activity, index) => (
                  <Box key={activity.id} sx={{ display: 'flex', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {React.cloneElement(activity.icon as React.ReactElement, { sx: { fontSize: 16 } })}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {activity.action}
                      </Typography>
                      {activity.target && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {activity.target}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
