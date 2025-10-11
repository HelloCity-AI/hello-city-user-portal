import type { ChecklistItem } from '../types';

// HelloCity AI Landing Assistant - Life settling checklist examples
export const defaultChecklistItems: ChecklistItem[] = [
  {
    id: '1',
    title: 'Student visa document preparation',
    description:
      'Prepare passport, acceptance letter, financial proof and other visa application materials',
    importance: 'high' as const,
    isComplete: true,
    dueDate: 'Jan 30',
    category: 'Visa',
    order: 0,
    createdAt: new Date('2025-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'University enrollment procedures',
    description:
      'Complete student ID processing, course registration, campus orientation and other enrollment processes',
    importance: 'high' as const,
    isComplete: false,
    dueDate: 'Jan 30',
    category: 'International Student',
    order: 1,
    createdAt: new Date('2025-01-15').toISOString(),
  },
  {
    id: '3',
    title: 'Find student accommodation',
    description:
      'Find suitable accommodation through university dormitories or off-campus rental platforms',
    importance: 'high' as const,
    isComplete: false,
    dueDate: 'Feb 5',
    category: 'International Student',
    order: 2,
    createdAt: new Date('2025-01-15').toISOString(),
  },
  {
    id: '4',
    title: 'Open bank account',
    description: 'Choose appropriate bank and prepare identity documents for account opening',
    importance: 'high' as const,
    isComplete: false,
    dueDate: 'Feb 10',
    category: 'Banking',
    order: 3,
    createdAt: new Date('2025-01-15').toISOString(),
  },
  {
    id: '5',
    title: 'Get mobile plan and internet',
    description: 'Choose carrier plans, get mobile service, and set up home internet',
    importance: 'medium' as const,
    isComplete: false,
    dueDate: 'Feb 15',
    category: 'Communications',
    order: 4,
    createdAt: new Date('2025-01-15').toISOString(),
  },
  {
    id: '6',
    title: 'Apply for health insurance',
    description: 'Understand local healthcare system and choose appropriate medical insurance plan',
    importance: 'medium' as const,
    isComplete: false,
    dueDate: 'Feb 20',
    category: 'New Immigrant',
    order: 5,
    createdAt: new Date('2025-01-15').toISOString(),
  },
  {
    id: '7',
    title: 'Transit card and travel planning',
    description: 'Get transit card, understand transport routes, and download travel apps',
    importance: 'medium' as const,
    isComplete: false,
    dueDate: 'Feb 25',
    category: 'Traveler',
    order: 6,
    createdAt: new Date('2025-01-15').toISOString(),
  },
  {
    id: '8',
    title: 'Government registration procedures',
    description:
      'Complete residence registration and other necessary procedures at local government offices',
    importance: 'low' as const,
    isComplete: false,
    dueDate: 'Mar 1',
    category: 'New Immigrant',
    order: 7,
    createdAt: new Date('2025-01-15').toISOString(),
  },
];

// HelloCity default title and subtitle
export const defaultPanelConfig = {
  title: 'HelloCity AI Landing Assistant',
  subtitle: 'Helping you adapt quickly and seamlessly in your new city',
};
