import type { ReactNode } from 'react';

export type ChecklistImportance = 'urgent' | 'high' | 'medium' | 'low';
export type FilterType = 'all' | 'completed' | 'incomplete';

export type CityCode =
  | 'sydney'
  | 'melbourne'
  | 'brisbane'
  | 'perth'
  | 'adelaide'
  | 'goldcoast'
  | 'toronto'
  | 'vancouver'
  | 'montreal'
  | 'calgary'
  | 'ottawa'
  | 'beijing'
  | 'shanghai'
  | 'guangzhou'
  | 'shenzhen'
  | 'hongkong'
  | 'chengdu'
  | 'chongqing'
  | 'xian'
  | 'hangzhou'
  | 'macau'
  | 'tokyo'
  | 'osaka'
  | 'kyoto'
  | 'singapore'
  | 'newyork'
  | 'losangeles'
  | 'sanfrancisco'
  | 'miami'
  | 'seattle'
  | 'chicago'
  | 'boston'
  | 'washingtondc'
  | 'london'
  | 'paris'
  | 'berlin'
  | 'amsterdam'
  | 'dublin'
  | 'edinburgh'
  | 'manchester'
  | 'munich'
  | 'hamburg'
  | 'auckland'
  | 'wellington'
  | 'christchurch'
  | 'dubai'
  | 'bangkok'
  | 'bali'
  | 'default';

export interface CityInfo {
  code: CityCode;
  name: ReactNode;
  country: string;
  heroImage: string;
  fallbackImage?: string;
  description: ReactNode;
  tagline: ReactNode;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  importance: ChecklistImportance;
  dueDate?: string;
  category?: string;
  order: number;
  isComplete: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ChecklistHandlers {
  onToggle: (itemId: string) => void;
  onEdit: (item: ChecklistItem) => void;
  onDelete: (itemId: string) => void;
  onReorder: (reorderedIds: string[]) => void;
  onAdd: () => void;
  onUpdate: (items: ChecklistItem[]) => void;
}

export interface CityDisplayData {
  image: string;
  name?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}

export interface ChecklistStats {
  completed: number;
  total: number;
  progress: number;
}

export interface ChecklistPanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
  checklistItems?: ChecklistItem[];
  cityInfo?: CityInfo;
  heroImage?: string;
  title?: string;
  subtitle?: string;
  onChecklistUpdate?: (items: ChecklistItem[]) => void;
  onChecklistToggle?: (itemId: string) => void;
  onChecklistEdit?: (item: ChecklistItem) => void;
  onChecklistDelete?: (itemId: string) => void;
  onChecklistAdd?: () => void;
}

export interface PanelLayoutProps {
  isCollapsed: boolean;
  panelWidth?: string;
  children: ReactNode;
}

export interface HeroSectionProps {
  title: ReactNode;
  subtitle: ReactNode;
  cityName?: ReactNode;
  backgroundImage?: string;
}

export interface ProgressSectionProps {
  stats: ChecklistStats;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export interface ChecklistHeaderSectionProps {
  title: ReactNode;
  subtitle: ReactNode;
  cityName?: ReactNode;
  stats: ChecklistStats;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export interface ChecklistSectionProps {
  items: ChecklistItem[];
  filter: FilterType;
  handlers: Pick<ChecklistHandlers, 'onToggle' | 'onEdit' | 'onDelete' | 'onReorder' | 'onAdd'>;
}

export interface ChecklistCardProps {
  item: ChecklistItem;
  onToggle: (itemId: string) => void;
  onEdit: (item: ChecklistItem) => void;
  onDelete: (itemId: string) => void;
}

// ========== AI-Generated Checklist Types ==========

export type StayType = 'short-term' | 'medium-term' | 'long-term';
export type ChecklistStatus = 'pending' | 'generating' | 'completed' | 'failed';

export interface ChecklistMetadata {
  checklistId: string;
  conversationId: string;
  version: number;
  previousVersionId?: string;

  // AI-generated metadata
  title: string;
  summary: string;
  destination: string;
  duration: string;
  stayType: StayType;

  // City info (AI identified)
  cityInfo: CityInfo;

  // Generation status
  status: ChecklistStatus;

  // Items
  items: ChecklistItem[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistBanner {
  checklistId: string;
  version: number;
  title: string;
  destination: string;
  cityCode: CityCode;
  itemCount: number;
  completedCount: number;
  createdAt: string;
  isActive: boolean;
}
