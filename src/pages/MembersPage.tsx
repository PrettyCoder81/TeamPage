import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Member } from '../types';

const statusColors: Record<string, { bg: string; color: string }> = {
  active: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' },
  inactive: { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' },
  'on-leave': { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
};

const dayStatusColors: Record<string, string> = {
  present: '#22c55e',
  absent: '#ef4444',
  leave: '#f59e0b',
  remote: '#6366f1',
};

const MembersPage: React.FC = () => {
  const members = useSelector((state: RootState) => state.members.members);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedMonth, selectedYear]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const getMemberStatusForDate = (member: Member, day: number): string | null => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return member.weeklyStatus[dateStr] || null;
  };

  return (
    <Box>
      {/* Performance Table */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
            Member Performance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Member</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Tasks</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Accuracy</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Avg Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#6366f1', fontSize: '0.85rem' }}>
                          {member.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{member.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{member.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{member.role}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{member.department}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.status}
                        size="small"
                        sx={{
                          bgcolor: statusColors[member.status]?.bg,
                          color: statusColors[member.status]?.color,
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {member.performance.tasksCompleted}/{member.performance.tasksTotal}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(member.performance.tasksCompleted / member.performance.tasksTotal) * 100}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            mt: 0.5,
                            backgroundColor: '#f1f5f9',
                            '& .MuiLinearProgress-bar': { borderRadius: 2, backgroundColor: '#6366f1' },
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${member.performance.accuracy}%`}
                        size="small"
                        sx={{
                          bgcolor: member.performance.accuracy > 90 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: member.performance.accuracy > 90 ? '#22c55e' : '#f59e0b',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{member.performance.avgResponseTime}h</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Calendar Section */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Team Attendance Calendar
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={handlePrevMonth} size="small">
                    <ChevronLeftIcon />
                  </IconButton>
                  <Typography variant="body1" sx={{ fontWeight: 600, minWidth: 140, textAlign: 'center' }}>
                    {monthNames[selectedMonth]} {selectedYear}
                  </Typography>
                  <IconButton onClick={handleNextMonth} size="small">
                    <ChevronRightIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Calendar Grid */}
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 700 }}>
                  {/* Day headers */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '150px repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
                    <Box sx={{ p: 1 }} />
                    {Array.from({ length: daysInMonth }, (_, i) => (
                      <Box key={i} sx={{ p: 0.5, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.65rem' }}>
                          {i + 1}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Member rows */}
                  {members.map((member) => (
                    <Box key={member.id} sx={{ display: 'grid', gridTemplateColumns: '150px repeat(7, 1fr)', gap: 0.5, mb: 0.5 }}>
                      <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#6366f1', fontSize: '0.7rem' }}>
                          {member.name.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
                          {member.name.split(' ')[0]}
                        </Typography>
                      </Box>
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const status = getMemberStatusForDate(member, i + 1);
                        return (
                          <Tooltip key={i} title={status || 'No data'} arrow>
                            <Box
                              sx={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: 1,
                                bgcolor: status ? dayStatusColors[status] : '#f1f5f9',
                                opacity: status ? 0.8 : 0.3,
                                cursor: 'pointer',
                                transition: 'transform 0.15s',
                                '&:hover': { transform: 'scale(1.2)' },
                                minHeight: 20,
                              }}
                            />
                          </Tooltip>
                        );
                      })}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Legend */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                {Object.entries(dayStatusColors).map(([status, color]) => (
                  <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: color }} />
                    <Typography variant="caption" sx={{ textTransform: 'capitalize', color: '#64748b' }}>
                      {status}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Summary */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                Weekly Summary
              </Typography>
              {members.slice(0, 4).map((member) => {
                const weekDays = [1, 2, 3, 4, 5]; // Mon-Fri of current week
                const presentDays = weekDays.filter(day => getMemberStatusForDate(member, day) === 'present').length;
                const percentage = (presentDays / weekDays.length) * 100;
                return (
                  <Box key={member.id} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: '#6366f1', fontSize: '0.7rem' }}>
                        {member.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>
                        {member.name.split(' ')[0]}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {presentDays}/5 days
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#f1f5f9',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#f59e0b' : '#ef4444',
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MembersPage;
