export interface ChecklistItem {
  checklistItemId: string;
  ownerId: string;
  title: string;
  description: string;
  isComplete: boolean;
  importance: 'Low' | 'Medium' | 'High';
  userOwner?: {
    userId: string;
    username: string;
    email: string;
    subId: string;
    avatarKey: string;
    gender: string;
    nationality: string;
    city: string;
    university: string;
    major: string;
    preferredLanguage: string;
    lastJoinDate: string;
    createdAt: string;
    updatedAt: string;
    checklistItems: string[];
  };
}

export interface CreateChecklistItemRequest {
  ownerId: string;
  title: string;
  description: string;
  isComplete: boolean;
  importance: 'Low' | 'Medium' | 'High';
}
