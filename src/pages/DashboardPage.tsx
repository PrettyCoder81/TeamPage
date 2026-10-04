import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { dashboardStats } from '../mock/data';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}> = ({ title, value, icon, color, trend }) => (
  <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', height: '100%' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              <TrendingUpIcon sx={{ fontSize: 16, color: '#22c55e' }} />
              <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 600 }}>
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage: React.FC = () => {
  const { totalMembers, activeMembers, activeJobs, completedJobs, failedJobs, pendingJobs, weeklyPerformance, machineUtilization } = dashboardStats;

  const pieData = [
    { name: 'Completed', value: completedJobs },
    { name: 'Running', value: activeJobs },
    { name: 'Failed', value: failedJobs },
    { name: 'Pending', value: pendingJobs },
  ];

  return (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Members" value={totalMembers} icon={<PeopleIcon />} color="#6366f1" trend="+2 this month" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active Members" value={activeMembers} icon={<PeopleIcon />} color="#22c55e" trend="67% active" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active Jobs" value={activeJobs} icon={<PrecisionManufacturingIcon />} color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Completed Jobs" value={completedJobs} icon={<CheckCircleIcon />} color="#8b5cf6" trend="+12% vs last week" />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                Weekly Job Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                Job Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Machine Utilization */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                Machine Utilization
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {machineUtilization.map((machine) => (
                  <Box key={machine.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {machine.name}
                      </Typography>
                      <Chip
                        label={`${machine.utilization}%`}
                        size="small"
                        sx={{
                          bgcolor: machine.utilization > 85 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                          color: machine.utilization > 85 ? '#ef4444' : '#22c55e',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={machine.utilization}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#f1f5f9',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: machine.utilization > 85 ? '#ef4444' : '#6366f1',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                Training Trends
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} name="Total Jobs" />
                  <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={3} dot={{ r: 5 }} name="Completed" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Summary */}
      <Grid container spacing={3} sx={{ mt: 0 }}>
        <Grid size={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                Quick Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 2, textAlign: 'center' }}>
                    <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#166534' }}>{completedJobs}</Typography>
                    <Typography variant="body2" color="text.secondary">Jobs Completed</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 2, bgcolor: '#fef3c7', borderRadius: 2, textAlign: 'center' }}>
                    <HourglassEmptyIcon sx={{ color: '#f59e0b', fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#92400e' }}>{activeJobs}</Typography>
                    <Typography variant="body2" color="text.secondary">Jobs Running</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ p: 2, bgcolor: '#fef2f2', borderRadius: 2, textAlign: 'center' }}>
                    <ErrorIcon sx={{ color: '#ef4444', fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#991b1b' }}>{failedJobs}</Typography>
                    <Typography variant="body2" color="text.secondary">Jobs Failed</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
