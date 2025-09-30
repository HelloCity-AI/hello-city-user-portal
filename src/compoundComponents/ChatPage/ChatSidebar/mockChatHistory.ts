/**
 * Mock data for chat history - 临时数据，待 server API 集成时移除
 */

export interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: Date;
  isActive: boolean;
}

export const mockChatHistory: ChatHistoryItem[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    title: '纽约搬迁咨询',
    createdAt: new Date('2024-01-15'),
    isActive: false,
  },
  {
    id: 'b2c3d4e5-f6g7-8901-bcde-f12345678901',
    title: '签证办理流程',
    createdAt: new Date('2024-01-14'),
    isActive: false,
  },
  {
    id: 'c3d4e5f6-g7h8-9012-cdef-123456789012',
    title: '租房推荐系统',
    createdAt: new Date('2024-01-13'),
    isActive: false,
  },
  {
    id: 'd4e5f6g7-h8i9-0123-def0-234567890123',
    title: 'School Comparison',
    createdAt: new Date('2024-01-12'),
    isActive: false,
  },
  {
    id: 'e5f6g7h8-i9j0-1234-ef01-345678901234',
    title: '税务咨询服务',
    createdAt: new Date('2024-01-11'),
    isActive: false,
  },
  {
    id: 'f6g7h8i9-j0k1-2345-f012-456789012345',
    title: '医疗保险方案',
    createdAt: new Date('2024-01-10'),
    isActive: false,
  },
  {
    id: 'g7h8i9j0-k1l2-3456-0123-567890123456',
    title: '驾照申请流程',
    createdAt: new Date('2024-01-09'),
    isActive: false,
  },
  {
    id: 'h8i9j0k1-l2m3-4567-1234-678901234567',
    title: '银行开户指南',
    createdAt: new Date('2024-01-08'),
    isActive: false,
  },
  {
    id: 'i9j0k1l2-m3n4-5678-2345-789012345678',
    title: '移民律师推荐',
    createdAt: new Date('2024-01-07'),
    isActive: false,
  },
  {
    id: 'j0k1l2m3-n4o5-6789-3456-890123456789',
    title: '城市生活指南',
    createdAt: new Date('2024-01-06'),
    isActive: false,
  },
];

export const defaultActiveSessionId = 'b2c3d4e5-f6g7-8901-bcde-f12345678901'; // 默认激活的会话 ID (签证办理流程)
