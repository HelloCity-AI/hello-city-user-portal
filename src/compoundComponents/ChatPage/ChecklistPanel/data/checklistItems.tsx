import type { ChecklistItem } from '../types';

// HelloCity AI Landing Assistant - Life settling checklist examples
export const defaultChecklistItems: ChecklistItem[] = [
  {
    id: '1',
    title: 'Student visa document preparation',
    description:
      'Prepare passport, acceptance letter, financial proof and other visa application materials',
    importance: 'urgent' as const,
    isComplete: true,
    dueDate: 'Jan 30',
    category: 'Visa',
  },
  {
    id: '2',
    title: 'University enrollment procedures',
    description:
      'Complete student ID processing, course registration, campus orientation and other enrollment processes',
    importance: 'urgent' as const,
    isComplete: false,
    dueDate: 'Jan 30',
    category: 'International Student',
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
  },
  {
    id: '4',
    title: 'Open bank account',
    description: 'Choose appropriate bank and prepare identity documents for account opening',
    importance: 'high' as const,
    isComplete: false,
    dueDate: 'Feb 10',
    category: 'Banking',
  },
  {
    id: '5',
    title: 'Get mobile plan and internet',
    description: 'Choose carrier plans, get mobile service, and set up home internet',
    importance: 'medium' as const,
    isComplete: false,
    dueDate: 'Feb 15',
    category: 'Communications',
  },
  {
    id: '6',
    title: 'Apply for health insurance',
    description: 'Understand local healthcare system and choose appropriate medical insurance plan',
    importance: 'medium' as const,
    isComplete: false,
    dueDate: 'Feb 20',
    category: 'New Immigrant',
  },
  {
    id: '7',
    title: 'Transit card and travel planning',
    description: 'Get transit card, understand transport routes, and download travel apps',
    importance: 'medium' as const,
    isComplete: false,
    dueDate: 'Feb 25',
    category: 'Traveler',
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
  },
];

// HelloCity default title and subtitle
export const defaultPanelConfig = {
  title: 'HelloCity AI Landing Assistant',
  subtitle: 'Helping you adapt quickly and seamlessly in your new city',
};
