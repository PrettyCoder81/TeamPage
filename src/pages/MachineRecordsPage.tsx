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
  Chip,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Collapse,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addRecord, updateRecord, deleteRecord, setFilters, clearFilters } from '../store/slices/machineRecordsSlice';
import { MachineRecord } from '../types';

const statusColors: Record<string, { bg: string; color: string }> = {
  completed: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' },
  running: { bg: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' },
  failed: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
  pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
};

const weekOptions = [
  { value: '', label: 'All Weeks' },
  { value: '1', label: 'Week 1 (1-7)' },
  { value: '2', label: 'Week 2 (8-14)' },
  { value: '3', label: 'Week 3 (15-21)' },
  { value: '4', label: 'Week 4 (22-28)' },
];

const MachineRecordsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { records, filters } = useSelector((state: RootState) => state.machineRecords);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MachineRecord | null>(null);
  const [formData, setFormData] = useState<Partial<MachineRecord>>({
    subnet: '',
    date: new Date().toISOString().split('T')[0],
    trainer: '',
    machine: '',
    dataset: '',
    epoch: 0,
    purpose: '',
    result: '',
    analysis: '',
    status: 'pending',
  });

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          record.purpose.toLowerCase().includes(searchLower) ||
          record.trainer.toLowerCase().includes(searchLower) ||
          record.machine.toLowerCase().includes(searchLower) ||
          record.dataset.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      if (filters.subnet && record.subnet !== filters.subnet) return false;
      if (filters.trainer && record.trainer !== filters.trainer) return false;
      if (filters.machine && record.machine !== filters.machine) return false;
      if (filters.status && record.status !== filters.status) return false;
      if (filters.week) {
        const day = new Date(record.date).getDate();
        const weekNum = Math.ceil(day / 7);
        if (weekNum !== parseInt(filters.week)) return false;
      }
      if (filters.dateFrom) {
        if (record.date < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        if (record.date > filters.dateTo) return false;
      }
      return true;
    });
  }, [records, filters]);

  const uniqueTrainers = useMemo(() => [...new Set(records.map(r => r.trainer))], [records]);
  const uniqueMachines = useMemo(() => [...new Set(records.map(r => r.machine))], [records]);
  const uniqueSubnets = useMemo(() => [...new Set(records.map(r => r.subnet))], [records]);

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setFilters({ [field]: value }));
  };

  const handleDateFromChange = (date: Dayjs | null) => {
    dispatch(setFilters({ dateFrom: date ? date.format('YYYY-MM-DD') : '' }));
  };

  const handleDateToChange = (date: Dayjs | null) => {
    dispatch(setFilters({ dateTo: date ? date.format('YYYY-MM-DD') : '' }));
  };

  const handleOpenAddDialog = () => {
    setEditingRecord(null);
    setFormData({
      subnet: '',
      date: new Date().toISOString().split('T')[0],
      trainer: user?.name || '',
      machine: '',
      dataset: '',
      epoch: 0,
      purpose: '',
      result: '',
      analysis: '',
      status: 'pending',
    });
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (record: MachineRecord) => {
    setEditingRecord(record);
    setFormData(record);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingRecord) {
      dispatch(updateRecord({ ...editingRecord, ...formData } as MachineRecord));
    } else {
      const newRecord: MachineRecord = {
        id: String(Date.now()),
        subnet: formData.subnet || '',
        date: formData.date || '',
        trainer: formData.trainer || '',
        machine: formData.machine || '',
        dataset: formData.dataset || '',
        epoch: formData.epoch || 0,
        purpose: formData.purpose || '',
        result: formData.result || '',
        analysis: formData.analysis || '',
        createdBy: user?.id || '',
        status: (formData.status as MachineRecord['status']) || 'pending',
      };
      dispatch(addRecord(newRecord));
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteRecord(id));
  };

  const canEdit = (record: MachineRecord) => {
    return isAdmin || record.createdBy === user?.id;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Header Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Machine Renting Report
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and analyze machine renting records
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              bgcolor: '#6366f1',
              '&:hover': { bgcolor: '#4f46e5' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            Add Record
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
                  label={`${filteredRecords.length} records`}
                  size="small"
                  sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontWeight: 600 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => dispatch(clearFilters())}
                  sx={{ textTransform: 'none', color: '#64748b' }}
                >
                  Clear All
                </Button>
                <IconButton size="small" onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={showFilters}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search records..."
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
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Subnet</InputLabel>
                    <Select
                      value={filters.subnet}
                      label="Subnet"
                      onChange={(e: SelectChangeEvent) => handleFilterChange('subnet', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueSubnets.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Trainer</InputLabel>
                    <Select
                      value={filters.trainer}
                      label="Trainer"
                      onChange={(e: SelectChangeEvent) => handleFilterChange('trainer', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueTrainers.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Machine</InputLabel>
                    <Select
                      value={filters.machine}
                      label="Machine"
                      onChange={(e: SelectChangeEvent) => handleFilterChange('machine', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueMachines.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      label="Status"
                      onChange={(e: SelectChangeEvent) => handleFilterChange('status', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="running">Running</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Week</InputLabel>
                    <Select
                      value={filters.week}
                      label="Week"
                      onChange={(e: SelectChangeEvent) => handleFilterChange('week', e.target.value)}
                    >
                      {weekOptions.map(w => <MenuItem key={w.value} value={w.value}>{w.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Date Pickers */}
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <DatePicker
                    label="Date From"
                    value={filters.dateFrom ? dayjs(filters.dateFrom) : null}
                    onChange={handleDateFromChange}
                    slotProps={{
                      textField: { size: 'small', fullWidth: true },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <DatePicker
                    label="Date To"
                    value={filters.dateTo ? dayjs(filters.dateTo) : null}
                    onChange={handleDateToChange}
                    minDate={filters.dateFrom ? dayjs(filters.dateFrom) : undefined}
                    slotProps={{
                      textField: { size: 'small', fullWidth: true },
                    }}
                  />
                </Grid>
              </Grid>
            </Collapse>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 40 }} />
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Subnet</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Trainer</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Machine</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Dataset</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Purpose</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.map((record) => (
                  <React.Fragment key={record.id}>
                    <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => setExpandedRow(expandedRow === record.id ? null : record.id)}>
                      <TableCell>
                        <IconButton size="small">
                          {expandedRow === record.id ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{record.date}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {record.subnet}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{record.trainer}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{record.machine}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{record.dataset}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {record.purpose}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          size="small"
                          sx={{
                            bgcolor: statusColors[record.status]?.bg,
                            color: statusColors[record.status]?.color,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                          {canEdit(record) && (
                            <>
                              <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => handleOpenEditDialog(record)}>
                                  <EditIcon fontSize="small" sx={{ color: '#6366f1' }} />
                                </IconButton>
                              </Tooltip>
                              {(isAdmin || record.createdBy === user?.id) && (
                                <Tooltip title="Delete">
                                  <IconButton size="small" onClick={() => handleDelete(record.id)}>
                                    <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={9} sx={{ p: 0, borderBottom: expandedRow === record.id ? undefined : 'none' }}>
                        <Collapse in={expandedRow === record.id}>
                          <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
                            <Grid container spacing={3}>
                              <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                  Details
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 1 }}>
                                  <Typography variant="body2" sx={{ color: '#64748b' }}>Subnet:</Typography>
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{record.subnet}</Typography>
                                  <Typography variant="body2" sx={{ color: '#64748b' }}>Date:</Typography>
                                  <Typography variant="body2">{record.date}</Typography>
                                  <Typography variant="body2" sx={{ color: '#64748b' }}>Trainer:</Typography>
                                  <Typography variant="body2">{record.trainer}</Typography>
                                  <Typography variant="body2" sx={{ color: '#64748b' }}>Machine:</Typography>
                                  <Typography variant="body2">{record.machine}</Typography>
                                  <Typography variant="body2" sx={{ color: '#64748b' }}>Dataset:</Typography>
                                  <Typography variant="body2">{record.dataset}</Typography>
                                  <Typography variant="body2" sx={{ color: '#64748b' }}>Epoch:</Typography>
                                  <Typography variant="body2">{record.epoch}</Typography>
                                </Box>
                              </Grid>
                              <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1 }}>
                                  Results & Analysis
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>Purpose:</Typography>
                                  <Typography variant="body2">{record.purpose}</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>Result:</Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{record.result}</Typography>
                                </Box>
                                <Box>
                                  <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>Analysis:</Typography>
                                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#475569' }}>
                                    {record.analysis}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: 'center', py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No records found matching your filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: 3 } } }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            {editingRecord ? 'Edit Record' : 'Add New Record'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Subnet"
                  value={formData.subnet}
                  onChange={(e) => setFormData({ ...formData, subnet: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Trainer"
                  value={formData.trainer}
                  onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Machine"
                  value={formData.machine}
                  onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Dataset"
                  value={formData.dataset}
                  onChange={(e) => setFormData({ ...formData, dataset: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Epoch"
                  type="number"
                  value={formData.epoch}
                  onChange={(e) => setFormData({ ...formData, epoch: parseInt(e.target.value) || 0 })}
                  size="small"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Result"
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Analysis"
                  value={formData.analysis}
                  onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
                  size="small"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="running">Running</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none' }}>
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
              {editingRecord ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default MachineRecordsPage;
