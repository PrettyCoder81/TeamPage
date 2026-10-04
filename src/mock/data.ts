import { Member, MachineRecord } from '../types';

export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@team.com',
    role: 'ML Engineer',
    department: 'AI Research',
    status: 'active',
    performance: { tasksCompleted: 45, tasksTotal: 50, accuracy: 92, avgResponseTime: 2.3 },
    weeklyStatus: generateWeeklyStatus('present'),
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@team.com',
    role: 'Data Scientist',
    department: 'Data Analytics',
    status: 'active',
    performance: { tasksCompleted: 38, tasksTotal: 42, accuracy: 88, avgResponseTime: 1.8 },
    weeklyStatus: generateWeeklyStatus('remote'),
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.j@team.com',
    role: 'DevOps Engineer',
    department: 'Infrastructure',
    status: 'on-leave',
    performance: { tasksCompleted: 30, tasksTotal: 35, accuracy: 95, avgResponseTime: 3.1 },
    weeklyStatus: generateWeeklyStatus('leave'),
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@team.com',
    role: 'ML Engineer',
    department: 'AI Research',
    status: 'active',
    performance: { tasksCompleted: 52, tasksTotal: 55, accuracy: 90, avgResponseTime: 2.0 },
    weeklyStatus: generateWeeklyStatus('present'),
  },
  {
    id: '5',
    name: 'Alex Wilson',
    email: 'alex.w@team.com',
    role: 'Research Intern',
    department: 'AI Research',
    status: 'active',
    performance: { tasksCompleted: 20, tasksTotal: 25, accuracy: 85, avgResponseTime: 4.2 },
    weeklyStatus: generateWeeklyStatus('present'),
  },
  {
    id: '6',
    name: 'Lisa Park',
    email: 'lisa.p@team.com',
    role: 'Data Engineer',
    department: 'Data Analytics',
    status: 'inactive',
    performance: { tasksCompleted: 15, tasksTotal: 20, accuracy: 78, avgResponseTime: 5.0 },
    weeklyStatus: generateWeeklyStatus('absent'),
  },
];

function generateWeeklyStatus(defaultStatus: 'present' | 'absent' | 'leave' | 'remote'): { [date: string]: 'present' | 'absent' | 'leave' | 'remote' } {
  const status: { [date: string]: 'present' | 'absent' | 'leave' | 'remote' } = {};
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      status[dateStr] = defaultStatus;
    } else {
      const rand = Math.random();
      if (rand > 0.85) status[dateStr] = 'remote';
      else if (rand > 0.75) status[dateStr] = 'leave';
      else if (rand > 0.65) status[dateStr] = 'absent';
      else status[dateStr] = defaultStatus;
    }
  }
  return status;
}

export const mockMachineRecords: MachineRecord[] = [
  {
    id: '1',
    subnet: '192.168.1.0/24',
    date: '2024-01-15',
    trainer: 'John Smith',
    machine: 'GPU-Server-01 (A100)',
    dataset: 'ImageNet-1K',
    epoch: 100,
    purpose: 'Model Training - ResNet50',
    result: 'Accuracy: 94.2%, Loss: 0.15',
    analysis: 'Model converged well. Consider increasing learning rate for faster convergence.',
    createdBy: '1',
    status: 'completed',
  },
  {
    id: '2',
    subnet: '192.168.1.0/24',
    date: '2024-01-16',
    trainer: 'Sarah Chen',
    machine: 'GPU-Server-02 (V100)',
    dataset: 'COCO-2017',
    epoch: 50,
    purpose: 'Object Detection - YOLOv8',
    result: 'mAP: 0.78, FPS: 45',
    analysis: 'Detection accuracy good but FPS below target. Optimize post-processing.',
    createdBy: '2',
    status: 'completed',
  },
  {
    id: '3',
    subnet: '192.168.2.0/24',
    date: '2024-01-17',
    trainer: 'Emily Davis',
    machine: 'GPU-Server-01 (A100)',
    dataset: 'Custom-NLP-v3',
    epoch: 200,
    purpose: 'Fine-tuning BERT for classification',
    result: 'F1-Score: 0.91',
    analysis: 'Excellent performance. Deploy to staging for A/B testing.',
    createdBy: '4',
    status: 'completed',
  },
  {
    id: '4',
    subnet: '192.168.2.0/24',
    date: '2024-01-18',
    trainer: 'John Smith',
    machine: 'GPU-Server-03 (H100)',
    dataset: 'Audio-Speech-500h',
    epoch: 75,
    purpose: 'ASR Model Training',
    result: 'WER: 5.2%',
    analysis: 'Running - Expected completion in 4 hours.',
    createdBy: '1',
    status: 'running',
  },
  {
    id: '5',
    subnet: '192.168.1.0/24',
    date: '2024-01-19',
    trainer: 'Alex Wilson',
    machine: 'GPU-Server-02 (V100)',
    dataset: 'GAN-Faces-100K',
    epoch: 150,
    purpose: 'GAN Training - Face Generation',
    result: 'FID: 12.3',
    analysis: 'Mode collapse detected at epoch 120. Restarting with different initialization.',
    createdBy: '5',
    status: 'failed',
  },
  {
    id: '6',
    subnet: '192.168.3.0/24',
    date: '2024-01-20',
    trainer: 'Sarah Chen',
    machine: 'GPU-Server-01 (A100)',
    dataset: 'Medical-X-Ray-50K',
    epoch: 30,
    purpose: 'Medical Image Classification',
    result: 'Pending',
    analysis: 'Scheduled for weekend batch processing.',
    createdBy: '2',
    status: 'pending',
  },
  {
    id: '7',
    subnet: '192.168.1.0/24',
    date: '2024-01-21',
    trainer: 'Emily Davis',
    machine: 'GPU-Server-03 (H100)',
    dataset: 'LLM-Corpus-v2',
    epoch: 10,
    purpose: 'LLM Pre-training',
    result: 'Loss: 2.1 (decreasing)',
    analysis: 'Early stage. Loss curve looks healthy. Monitor GPU utilization.',
    createdBy: '4',
    status: 'running',
  },
  {
    id: '8',
    subnet: '192.168.2.0/24',
    date: '2024-01-22',
    trainer: 'John Smith',
    machine: 'GPU-Server-02 (V100)',
    dataset: 'Tabular-Sales-2023',
    epoch: 500,
    purpose: 'XGBoost Hyperparameter Tuning',
    result: 'RMSE: 0.023, R²: 0.97',
    analysis: 'Best model found. Save and prepare for production deployment.',
    createdBy: '1',
    status: 'completed',
  },
];

export const dashboardStats = {
  totalMembers: 6,
  activeMembers: 4,
  totalMachines: 3,
  activeJobs: 2,
  completedJobs: 4,
  failedJobs: 1,
  pendingJobs: 1,
  weeklyPerformance: [
    { week: 'Week 1', completed: 12, failed: 1, total: 13 },
    { week: 'Week 2', completed: 15, failed: 2, total: 17 },
    { week: 'Week 3', completed: 18, failed: 0, total: 18 },
    { week: 'Week 4', completed: 14, failed: 1, total: 15 },
  ],
  machineUtilization: [
    { name: 'GPU-Server-01 (A100)', utilization: 87 },
    { name: 'GPU-Server-02 (V100)', utilization: 72 },
    { name: 'GPU-Server-03 (H100)', utilization: 93 },
  ],
};
