/**
 * Checklist Types - Single Source of Truth
 *
 * IMPORTANT: This is the ONLY place where ChecklistItem should be defined.
 * All other type definitions should import from here.
 *
 * @module checklist.types
 */

// ========== Basic Enums ==========

export type ChecklistImportance = 'high' | 'medium' | 'low';
export type ChecklistStatus = 'pending' | 'generating' | 'completed' | 'failed';
export type StayType = 'shortTerm' | 'mediumTerm' | 'longTerm';

// ========== Core Data Types ==========

/**
 * Core checklist item structure
 * Used across UI, Redux state, and API layers
 *
 * IMPORTANT: ID field is unified as 'id' (not 'checklistItemId')
 * IMPORTANT: Importance enum uses lowercase ('high', not 'High')
 */
export interface ChecklistItem {
  /** Unique identifier (unified field name) */
  id: string;

  /** Item title */
  title: string;

  /** Item description */
  description: string;

  /** Priority level (lowercase: high, medium, low) */
  importance: ChecklistImportance;

  /** Due date in ISO 8601 format (YYYY-MM-DD) */
  dueDate?: string;

  /** Optional category tag */
  category?: string;

  /** Display order (0-based index) */
  order: number;

  /** Completion status */
  isComplete: boolean;

  /** Creation timestamp in ISO 8601 format */
  createdAt: string;

  /** Last update timestamp in ISO 8601 format */
  updatedAt?: string;
}

/**
 * Checklist metadata (stored in Redux)
 * Must be fully serializable (no React elements)
 */
export interface ChecklistMetadata {
  /** Unique checklist identifier */
  checklistId: string;

  /** Parent conversation ID */
  conversationId: string;

  /** Version number for conflict resolution */
  version: number;

  /** Reference to previous version (for history tracking) */
  previousVersionId?: string;

  // AI-generated metadata
  /** Checklist title */
  title: string;

  /** Summary description */
  summary: string;

  /** Destination city/location */
  destination: string;

  /** Duration of stay */
  duration: string;

  /** Type of stay (short/medium/long term) */
  stayType: StayType;

  /** City code (lookup key for city data) */
  cityCode: string;

  // Status and items
  /** Generation/completion status */
  status: ChecklistStatus;

  /** Array of checklist items */
  items: ChecklistItem[];

  // Timestamps
  /** Creation timestamp in ISO 8601 format */
  createdAt: string;

  /** Last update timestamp in ISO 8601 format */
  updatedAt: string;
}

/**
 * Banner representation for conversation UI
 * Lightweight summary for displaying in conversation history
 */
export interface ChecklistBanner {
  /** Checklist identifier */
  checklistId: string;

  /** Version number */
  version: number;

  /** Display title */
  title: string;

  /** Destination name */
  destination: string;

  /** City code */
  cityCode: string;

  /** Total number of items */
  itemCount: number;

  /** Number of completed items */
  completedCount: number;

  /** Current status */
  status: ChecklistStatus;

  /** Creation timestamp */
  createdAt: string;

  /** Whether this is the active checklist */
  isActive: boolean;
}
